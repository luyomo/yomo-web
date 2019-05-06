const util       = require('util')
    , serve      = require('koa-static')
    , views      = require('koa-views')
    , convert    = require('koa-convert')
    , crypto     = require('crypto')
    , cookie     = require('cookie')
    , _          = require("lodash")
    , koa        = require('koa2')
    , app        = new koa()
    , os         = require("os")
    , fs         = require('fs')
    , yaml       = require('node-yaml')
    , IO         = require('koa-socket')
    , bodyParser = require('koa-bodyparser')
    , winston    = require('winston')
    , verifyIDToken = require("yomo-gapi-auth")
    , pgViewIns  = require("base.js");

function onError (error) {
    log.error(error);
    log.error(error.stack);

};

var cfgData = yaml.readSync("../etc/config.yaml");

const log = new (winston.Logger)({
     transports: [new winston.transports.File({ filename: cfgData.fg_log_file })
      ]});
log.level = cfgData.log_mode?cfgData.log_mode:'info';
log.log("info", "This message is from bunyan");

pgViewIns.setLog(log);

pgViewIns.addFunc(cfgData["root_dir"]+"/lib/plugins/");

pgViewIns.set_root_dir(cfgData.root_dir);

var defaultMenu;

app.use(convert(serve(pgViewIns.return_new_dir(""))));
app.use(convert(serve(pgViewIns.return_new_dir("/html"))));
app.use(convert(serve(pgViewIns.return_new_dir("/lib"))));
app.use(convert(serve(pgViewIns.return_new_dir("/node_modules"))));
app.use(convert(serve(pgViewIns.return_new_dir("/views"))));
app.use(convert(serve(pgViewIns.return_new_dir("/css"))));   //  Resolve the googleapis.css
app.use(views(pgViewIns.return_new_dir("/lib/jquery")), {extension: 'jade'});
app.use(bodyParser());


//Add the post-process event
app.use(async(ctx, next) => {

  await next().then(() => {
    log.info("step 9: post-process for %s", ctx.url);
  });
});

//(ctx.priv-info, ctx.data, ctx.data.ajax-res, ctx.data.jade_template) ====> ctx.body
app.use(async (ctx, next) => {
  const start = new Date();

  await next().then(() => {
    log.info("step: 8 setting the body");
    const ms = new Date() - start;
    if(ctx["priv-info"] === undefined) {ctx.data.root_path = ctx.request.header.root_path || "";}    //example   dba-web/

    ctx.type = 'html';
    ctx.data.js_src && console.log("The include files is <%s>", util.inspect(ctx.data.js_src));
    log.info("The root path is <%s>", ctx.data.root_path);
    ctx.data.client_id      = cfgData.client_id;
    ctx.data.api_key        = cfgData.api_key;
    ctx.data.menu_title     = ctx.header.menu_title;
    ctx.data.scope          = ctx.headers.scope;
    ctx.data.user_name      = ctx.request.header.username;
    ctx.data.discovery_docs = ctx.headers.discovery_docs;
    ctx.body =  ctx["priv-info"] || ctx.data["ajax-res"] || ctx.data["jade_template"](ctx.data);

  });
});

//(priv-info, ctx.data.ajax-res) ==defaultMenu==> ctx.data.menus
app.use(async (ctx, next) => {
  await next().then(() => {
    log.info("step: 7 getting the menus");
    if(ctx["priv-info"] !== undefined) return {};
    if(ctx.data && !ctx.data["ajax-res"]){
      if(ctx.data && !ctx.data.menus){
        ctx.data || (() => {ctx.data={};});
        ctx.data.menus = defaultMenu.menus;
      }
    }
  });
});

//Get the data
// (ctx.request.body, ctx.url, ctx.priv-info, ctx.cookies, ctx.request.header.username, ctx.request.header.root_path)
//   ==db==> ctx.data.????
app.use(async (ctx, next) => {
  var jsonData = ctx.request.body;
  jsonData["url"] = ctx.url;
  log.debug("The url is [%s]", ctx.url);
  await next().then(() => {
    log.info("step: 6 Getting data ", ctx["priv-info"]);
    if(ctx["priv-info"] !== undefined) return {};
    return pgViewIns.loop_href_action( _.assignIn({}, jsonData, ctx.cookies
                                                  , {"user_name": ctx.request.header.username}
                                                  , {"root_path": ctx.request.header.root_path}
                                                  , {"connMD5"  : ctx.connMD5})
                                     ).then((output) => {
      log.debug("The ourput is " + util.inspect(output));
      //ctx.data = output;
      ctx.data = _.assign({}, ctx.data, output );

    }).catch(err => {
      log.error("[%d]Failed in the main functrion <%s>", 103, err);
    });
  });
});

//Get the include files
//(ctx.url,ctx.request.header.root_path) ==db==> ctx.data.include_src
app.use(async (ctx, next) => {
  await next().then(() => {
    log.info("step: 5");
    return new Promise((resolve, reject) => {
      pgViewIns.fetch_pg_data_from_file(resolve, reject, []
                                        , {"query_file" : "/sql/meta/fetch-include-src.sql"
                                           , "url"      : ctx.url
                                           , "root_path": ctx.request.header.root_path
                                           , "connMD5"  : ctx.connMD5});})
      .then((values) =>{
        ctx.data = _.assign({}, ctx.data, {"include_src": values.user_data} );
      }).catch(err => {
        log.error("[%d]Erro when fetch the include files<%s> ", 104, err);
      });
  });
});

//Add the pre-process event
// ctx ====> ()
app.use(async(ctx, next) => {

  await next().then(() => {
    log.info("step: 4 pre-process for %s", ctx.url);
    return pgViewIns.run_callback('pre-process', ctx);
  });
});

//Get the permission
// (ctx.url, ctx.request.header.username) ==db==>  ????
app.use(async (ctx, next) => {
  await next().then(() => {
    log.info("step: 3");

    return new Promise((_resl, _rej) => {
      pgViewIns.fetch_pg_data_from_file(_resl, _rej, []
                                        , {"query_file": "/sql/meta/fetch-rbac.sql"
                                           , "url": ctx.url
                                           , "user_name": ctx.request.header.username
                                           , "connMD5"  : ctx.connMD5 });})
      .then((_rows) =>{
        log.debug("The src files is <%s>", util.inspect(_rows));
      }).catch(err => {
        log.error("[%d]Erro when fetch the include files<%s> ", 105, err);
      });
    });
});

//Get the menus
// (ctx.request.header.username) ==db==> defaultMenu??
app.use(async (ctx, next) => {
  await next().then(() => {
    log.info("step: 2 , session id : %s, username : %s", ctx.cookies.get('sessionid'),  ctx.request.header.username);
    return new Promise((resolve, reject) => {
      pgViewIns.fetch_menu_conf(resolve, reject, null, {"user_name" : ctx.request.header.username, "connMD5" : ctx.connMD5});
      log.info("The user is %s" , ctx.request.header.username);
    }).then(menus => {
      log.debug("The got menu is ");
      defaultMenu = menus;
    }).catch(err => {
      log.error("[%d]Failed to get the default menus <%s>", 106, err);
    });
  });
});

// (ctx.headers.db_host/db_port/db_name/db_user/db_pass) ====> insDB["md5"]
app.use(async (ctx, next) => {
  await next().then(() => {
    log.info("step: 1 get db connection conf ");
    return new Promise((resolve, reject) => {
      const __md5 = pgViewIns.add_pg_conn( { host     : ctx.headers.db_host
                                           , port     : ctx.headers.db_port
                                           , database : ctx.headers.db_name
                                           , user     : ctx.headers.db_user
                                           , password : ctx.headers.db_pass
                                           , application_name : "WEB TEST" });
      log.debug("The return md5 is <%s>", __md5);
      ctx.connMD5 = __md5;
      resolve(1);
    });
  });
});


// (ctx.cookie.idtoken) ====> authentication
app.use(async (ctx, next) => {
    log.info("step: 1 Starting to call id token verification");
    return new Promise(async (resolve, reject) => {
      log.debug("step: 1 idtoken : <%s>", ctx.cookies.get('idtoken'));
      const clientId = cfgData.client_id; 
      if(ctx.cookies.get('idtoken') === undefined || ctx.cookies.get('idtoken') === ""){
        ctx["priv-info"] =  pgViewIns.compile_jade_template("/views/login.jade")({
          "api_key" : cfgData.api_key , "client_id": cfgData.client_id ,
          "scope" : ctx.headers.scope, "discovery_docs" : ctx.headers.discovery_docs});
        resolve(1);
      }else{
        const __openIDCfg = fs.existsSync(cfgData.cert_dir+"/openid-configuration")?cfgData.cert_dir+"/openid-configuration":undefined;
        const __jwtFile   = fs.existsSync(cfgData.cert_dir+"/jwks_files")?cfgData.cert_dir+"/jwks_files":undefined;
        log.debug("openID configuration : <> , jwt file: <%s>", __openIDCfg, __jwtFile);
        const __ret = await verifyIDToken(ctx.cookies.get('idtoken'), clientId, __openIDCfg, __jwtFile);
        log.debug("step 1: The result from the verification is <%s>", util.inspect(__ret));
        if(__ret.ret === false) ctx["priv-info"] = pgViewIns.compile_jade_template("/views/login.jade")({
          "api_key" : cfgData.api_key, "client_id": cfgData.client_id,
           "scope" : ctx.headers.scope, "discovery_docs" : ctx.headers.discovery_docs});
        if(__ret.ret === true){
          log.debug("The user email address is <%s>", __ret.content.email.split('@'));
          ctx.request.header.username = __ret.content.email.split('@')[0];
          log.debug("The user name is <%s>", ctx.request.header.username);
        }
        resolve(__ret);
      }
    });
});

app.listen(cfgData.listening_port);
