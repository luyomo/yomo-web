const util       = require('util')
    , _          = require("lodash")
    , pgp        = require("pg-promise")
    , jade       = require('jade')
    , readFile   = require('fs-readfile-promise')
    , sentinel   = require('redis-sentinel')
    , redis      = require('redis')
    , os         = require("os")
    , fs         = require('fs')
    , crypto     = require('crypto');

var insRedis, rootDir, log, insDBs = {};

var jadeBuf = {};

function runPromiseQuery(resolve, reject, router, args, queries){
  var allRunQueries = {};
  log.debug("The parameters is <%s>", util.inspect(_.omit(args, ["request",  "response", "secure"])));
  allRunQueries =  queries.map(query => {
    return insDBs[args.connMD5].any(query["query"], args).then(res => {return {[query["comp_name"]] : res};})
      .catch(err =>{
        log.error("[%d][runPromiseQuery][promise preparation]: Failed in the query. Error :[%s],query :[%s], params:[%s]"
                  , 1001 , err, query["query"], util.inspect(_.omit(args, ["request",  "response", "secure"])));
        throw err;
      });
  });

  Promise.all(allRunQueries).then(res => {
    //[{key01:value01}, {key02:value02}]   => {key01:value01, key02:value02}
    var resObj = _(res).compact().unshift({}).reduce((_p, _n) => {return _.assign(_p, _n);});

    router.reverse().unshift(resObj);
    resolve(router.reduce((child_node, parent_node) => {return {[parent_node] : child_node};}));
  }).catch(err => {
    log.error("[%d][runPromiseQuery][promise run]:Failed to execute the postgres queries :[" + err + "]", 1002);
  });
}

function pop_value(object, arrKey){
  var theKey = arrKey.shift();

  if(object[theKey] === undefined) {return undefined;}

  return (arrKey.length)?pop_value(object[theKey], arrKey):object[theKey];
}

module.exports = {
  setLog : function(_log) {log = _log},

  addFunc: function(_dir){
    //fs.readdir("/app/lib/plugins", (_err, _files) => {
    fs.readdir(_dir, (_err, _files) => {
      _err && log.error("Failed to open the folder for loading the modules <%s>", JSON.stringify(_err));
      log.info("Loading modules [%s]", _files);
      _(_files)
        .filter(_f => !_f.match(/^config/))
        .map(_file => {

        //_.assignIn(module.exports, require("/app/lib/plugins/" + _file));
        _.assignIn(module.exports, require(_dir + _file));

      }).value();
    });
  },
  
  add_pg_conn: function(args){
    // args ====> md5
    const __connMD5 = crypto.createHash('md5').update(JSON.stringify(args) ).digest("hex"); 

    // Connection addition
    if(!_.has(insDBs, __connMD5 )){
      insDBs[__connMD5] = new pgp()(args);
      log.debug("The connection is successfully. conn info: <%s>", JSON.stringify(args));
    }else {
      log.debug("The connection is done before. conn info: <%s>", JSON.stringify(args));
    } 
    return __connMD5;
  },

  init_redis_conn: function(args){
    insRedis = (args.single === undefined )?sentinel.createClient.apply(this, args.sentinal):redis.createClient.apply(this, args.single);
  },

  get_redis_conn: function(){ return insRedis; },

  set_root_dir : function(pRootDir){rootDir = pRootDir;},

  return_new_dir : function(pOldDir) {return rootDir + pOldDir;},

  loop_href_action: function(args){
    return new Promise((resolve, reject) => {
      insDBs[args.connMD5].any((new pgp.QueryFile(module.exports.return_new_dir("/sql/meta/event-search.sql"), {minify: true, noWarnings: true})), args)
        .then(rows => {
          log.debug("The url is <%s>",  args.url);
          return rows.map(row => {
            return new Promise((subResolve, reject) =>{
              module.exports[row.action_name](subResolve, reject, row.router, _.assignIn({}, args, row.params));
            });
          });
        })
        .then(promises => {
          return Promise.all(promises).then(values => {resolve(_(values).unshift({}).reduce((_p, _n) => {return _.merge(_p, _n);}));});
        }).catch((err) => {log.error("[%d]Failed to fetch all the function :[" + err + "]", 1005 );});
    });
  },

  fetch_menu_conf: function(resolve, reject, router, args){
    insDBs[args.connMD5].any(new pgp.QueryFile(module.exports.return_new_dir("/sql/meta/fetch-menu.sql"), {minify: true, noWarnings: true}), args)
      .then((values) => {log.debug("Resolved");resolve({"menus" : values});})
    .catch(err => {log.error("[%d][fetch_menu_conf]:Failed to fetch all the menus : [" + err + "]", 1007); });
  },

  fetch_pg_data_from_file: function( resolve, reject, router, args){
    log.debug("The query file is <%s>", args["query_file"]);
    readFile(module.exports.return_new_dir(args["query_file"])).then(buffer => {
      return _([]).push({"query" : buffer.toString(), "comp_name":"user_data"});})
      .then(queries => {runPromiseQuery(resolve, reject, router, args, queries); })
      .catch(err => log.error("[%d]%s", 1008,  err.message));
  },

  fetch_jade_template : function(resolve, reject, router, args){
      jadeBuf[module.exports.return_new_dir(args.jade_template_name)] = jade.compileFile(module.exports.return_new_dir(args.jade_template_name));
    resolve({[router.pop()] : jadeBuf[module.exports.return_new_dir(args.jade_template_name)]});
  },

  compile_jade_template: function(_fileName) {
    if(!_.has(jadeBuf, module.exports.return_new_dir(_fileName) )){
      jadeBuf[module.exports.return_new_dir(_fileName)] = jade.compileFile(module.exports.return_new_dir(_fileName));
    }
    return jadeBuf[module.exports.return_new_dir(_fileName)];
  },

  run_callback: function(event, args){
    // using event and url to get all the function
    return new Promise((resolve, reject) => {
      insDBs[args.connMD5].any("select call_back from yomo.event_master where page_name = ${url} and event_name = ${event} order by seq"
              , _.assignIn({}, args, {event: event}))
        .then(events => {
          events.map(event => {
            log.debug("The event name is %s", event.call_back);
            log.debug("All the events is <%s>", JSON.stringify(event));
            //log.debug("The event name after %s", util.inspect(this[event.call_back]));
            this[event.call_back](log, insDBs[args.connMD5], args);
          });
          resolve(1);
        })
        .catch(err =>{
          log.error("[%d][run_callback][promise preparation]: Failed to fetch the callbacks. Error :[" + err + "]"
                      + ",query :[" + query["query"]  +"]", 1017);
          throw err;
      })
    });
    // Call the function by delivering the args
  },

  generateKey : function() {
      var sha = crypto.createHash('sha256');
      sha.update(Math.random().toString());
      return sha.digest('hex');
  }

};

