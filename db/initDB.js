const yaml     = require('node-yaml')
    , winston  = require("winston")
    , cfgData  = yaml.readSync("/app/etc/config.yaml")
    , fs       = require("fs");
var {Pool} = require('pg');
var copyTo = require('pg-copy-streams').to;
var copyFrom = require('pg-copy-streams').from;

global._$log = require('yomo-log')({
     transports: [new winston.transports.File({ filename: cfgData.bg_log_file })],
     level: 'debug'});

const db  = require('yomo-db')
    , util = require('util')
    , _ = require("lodash");

const __dbCfg = { host     : process.env.PG_HOST
                , port     : process.env.PG_PORT
                , database : process.env.PG_DATABASE
                , user     : process.env.PG_USER
                , password : process.env.PG_PASSWORD
                , application_name : "DB INIT" };
const __md5 = db.pg.initConn(__dbCfg);
//console.log("The md5 value is <%s>", __md5);
//process.exit(1);

_$log.level = cfgData.log_mode?cfgData.log_mode:'info';

async function initSchema(){
  const __schemas = ['yomo', 'yomo_template', 'yomo_example'];
  for(let __idx =0; __idx < __schemas.length; __idx++){
    try {
      await db.pg.pgExecuteQuery(__md5, util.format("create schema %s",__schemas[__idx] ));
    }catch (_err) {
      if(_err.code !== '42P06'){
        console.log("Error: <%s>", _err);
        return;
      }else{
        console.log("Duplicate schema");
      }
    }
  }
}

async function exeQuery( _file){
  // Do whatever you want to do with the file
  var __ddl = fs.readFileSync(_file, 'utf8');
  try{
    await db.pg.pgExecuteQuery(__md5, __ddl);
  }catch(_err){
    if(!_.includes(['42723', '42P07'],  _err.code) ){
      console.log(_file); 
      console.log("Err <%s>", util.inspect(_err));
      console.log(__ddl);
    }
  }
}

async function impData(_file){
  return await new Promise((_resl, _rej) => {
    var __parse = _file.match(/data\/(.*).csv/);
  
    var pool = new Pool(__dbCfg);  
    pool.connect(function(err, client, done) {
      if (err) { console.log("Connection errors <%s>", err); return; }
      var stream = client.query(copyFrom(util.format("COPY %s FROM STDIN with (format csv, delimiter ',', NULL '\\N' )", __parse[1])));
      var fileStream = fs.createReadStream(_file);
      fileStream.on('error', _err => {console.log("Error when open the file "); _rej(_err);});
      stream.on('error', _err => {console.log("Error when reading the file <%s>", util.inspect(_err)); _rej(_err);} );
      stream.on('end', () => {done(); _resl(1); });
      fileStream.pipe(stream);
    });
  });

}

async function initObjects(_dir, _callback ){
  if(!fs.existsSync(_dir)){
    return;
  }

  const __files = fs.readdirSync(_dir);
  for(let __idx=0; __idx < __files.length; __idx++){
    await _callback(_dir + '/' + __files[__idx]);
  }
}

async function main (){
  await initSchema();
  await initObjects( 'ddl/function', exeQuery  );
  await initObjects( 'ddl/sequence', exeQuery  );
  await initObjects( 'ddl/table'   , exeQuery  );
  await initObjects( 'ddl/pk'      , exeQuery  );
  await initObjects( 'ddl/index'   , exeQuery  );
  await initObjects( 'ddl/view'    , exeQuery  );
  await initObjects( 'data'        , impData);
}

main();

