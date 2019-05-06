const yaml     = require('node-yaml')
    , winston  = require("winston")
    , cfgData  = yaml.readSync("/app/etc/config.yaml")
    , fs       = require("fs");
var {Pool} = require('pg');
var copyTo = require('pg-copy-streams').to;

global._$log = require('yomo-log')({
     transports: [new winston.transports.File({ filename: cfgData.bg_log_file })],
     level: 'debug'});

const db  = require('yomo-db')
    , util = require('util')
    , _ = require("lodash");

db.pg.initConn(cfgData["config-db"]);

_$log.level = cfgData.log_mode?cfgData.log_mode:'info';

async function dumpSequence(){
  const __ret = await db.pg.pgGetAnyQueryData("select schemaname, sequencename, 'create sequence ' || schemaname || '.' || sequencename || ' INCREMENT by ' || increment_by || ' MINVALUE ' || min_value || ' MAXVALUE ' || max_value || ';' as seqdef from pg_sequences  where schemaname ~ 'yomo'" );
  __ret.forEach(async _e => {
    try{
      fs.writeFileSync(util.format('ddl/sequence/%s.%s.ddl', _e.schemaname, _e.sequencename), _e.seqdef );
    }catch(_err){
      console.log("The error is <<%s>", _err);
    }
  });
}

async function dumpTable(){
  const __ret = await db.pg.pgGetAnyQueryData("select table_schema, table_name, yomo.generate_create_table_statement (table_schema, table_name) as ddl from information_schema.tables where table_schema ~ 'yomo' and table_type = 'BASE TABLE'" );
  __ret.forEach(async _e => {
    try{
      fs.writeFileSync(util.format('ddl/table/%s.%s.ddl', _e.table_schema, _e.table_name), _e.ddl);
    }catch(_err){
      console.log("The error is <<%s>", _err);
    }
  });
}

async function dumpPK(){
  const __ret = await db.pg.pgGetAnyQueryData("select t2.nspname, t3.relname, 'alter table ' || t2.nspname || '.' || t3.relname || ' add ' || pg_get_constraintdef(t1.oid) || ';' as ddl from pg_constraint t1,  pg_namespace t2, pg_class t3 where t1.contype = 'p' and t2.oid = t1.connamespace and nspname ~ 'yomo' and t1.conrelid = t3.oid" );
  __ret.forEach(async _e => {
    try{
      fs.writeFileSync(util.format('ddl/pk/%s.%s.ddl', _e.nspname, _e.relname), _e.ddl);
    }catch(_err){
      console.log("The error is <<%s>", _err);
    }
  });
}

async function dumpIndex(){
  const __ret = await db.pg.pgGetAnyQueryData("select schemaname, indexname, indexdef from pg_indexes where schemaname ~ 'yomo' and (schemaname, indexname ) not in (select t2.nspname, t1.conname from pg_constraint t1,  pg_namespace t2, pg_class t3 where t1.contype = 'p' and t2.oid = t1.connamespace and nspname ~ 'yomo' and t1.conrelid = t3.oid) " );
  __ret.forEach(async _e => {
    try{
      fs.writeFileSync(util.format('ddl/index/%s.%s.ddl', _e.schemaname, _e.indexname), _e.indexdef + ";");
    }catch(_err){
      console.log("The error is <<%s>", _err);
    }
  });
}

async function dumpView(){
  const __ret = await db.pg.pgGetAnyQueryData("select schemaname, viewname , definition from pg_views where schemaname ~ 'yomo'" );
  __ret.forEach(async _e => {
    try{
      fs.writeFileSync(util.format('ddl/view/%s.%s.ddl', _e.schemaname, _e.viewname), util.format("create or replace view %s.%s as \n %s", _e.schemaname, _e.viewname,  _e.definition));
    }catch(_err){
      console.log("The error is <<%s>", _err);
    }
  });
}

async function dumpFunction(){
  const __ret = await db.pg.pgGetAnyQueryData("SELECT t2.nspname, t1.proname,   prosrc FROM pg_proc t1 inner join pg_namespace t2 on t1.pronamespace = t2.oid where t2.nspname ~ 'yomo'" );
  __ret.forEach(async _e => {
    try{
      fs.writeFileSync(util.format('ddl/function/%s.%s.ddl', _e.nspname, _e.proname), _e.prosrc);
    }catch(_err){
      console.log("The error is <<%s>", _err);
    }
  });
}

async function dumpData(){
  const __ret = await db.pg.pgGetAnyQueryData("select table_schema, table_name from information_schema.tables where table_schema ~ 'yomo' and table_type = 'BASE TABLE'" );
  __ret.forEach(async _e => {

  console.log("The data is <%s.%s>", _e.table_schema, _e.table_name);
  var pool = new Pool(cfgData["config-db"]);  
  pool.connect(function(err, client, done) {
    var stream = client.query(copyTo(util.format("COPY %s.%s TO stdout with (format csv, delimiter ',', null '\\N')", _e.table_schema, _e.table_name)));
    var writeStream = fs.createWriteStream(util.format('./data/%s.%s.csv', _e.table_schema, _e.table_name))
    stream.pipe(writeStream);
    stream.on('end', () => {console.log("Completed"); client.end();});
    stream.on('error', _err => {console.log("The error is <%s>", _err)});
  });
  });
}

async function main (){
  await dumpSequence();
  await dumpTable();
  await dumpPK();
  await dumpIndex();
  await dumpView();
  //await dumpFunction();
  await dumpData();
  db.pg.closeConn();
}

main();

