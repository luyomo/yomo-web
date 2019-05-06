var promise = require("bluebird");
var pgp = require("pg-promise")({promiseLib: promise}),
    _    = require("lodash")
    util = require("util");

const __$log = global._$log?global._$log:console;

//var insDB = pgp({"database": "yomo", "host": "postgres", "port": "5432", "user": "yomo", "password": "yomo"});
var $insDB; 

function initConn(_args){
  __$log.info("_args: <%s>", JSON.stringify(_args));
  $insDB = pgp(_args);
  __$log.debug("The connection is <%s>", JSON.stringify($insDB));
}

function closeConn(){
  $insDB && $insDB.end;
}

function getTableData(_args) {
  __$log.info("The value is <%s>", util.inspect(_args["schema_name"]));
  __$log.debug("The connection is <%s>", JSON.stringify($insDB));

  if(typeof($insDB) === "undefined"){__$log.error("Invalid db connection"); return null;}

  if(!_.has(_args, "where")) _.assignIn(_args, {"where": ""});

  return new promise((_resl, _rej) => {
    $insDB.any("select * from ${schema_name:name}.${table_name:name} ${where:raw}", _args)
         .then(_row => {__$log.debug("The data is <%s>", util.inspect(_row));  ; return _row;})
         .then(_row => _resl(_row))
         .catch(_err => { __$log.error("DB error: <%s>", util.inspect(_err)) ; _rej(_err);});
  });
};

function getOneQueryData(_query, _args) {
  return new promise((_resl, _rej) => {
    $insDB.one(_query, _args)
         .then(_row => _resl(_row))
         .catch(_err => _rej(_err));
  });
};

function getAnyQueryData(_query, _args) {
  return new promise((_resl, _rej) => {
    $insDB.any(_query, _args)
         .then(_row => _resl(_row))
         .catch(_err => _rej(_err));
  });
};

async function  getTableKey(_tableSchema, _tableName) {
  //- * Get the dependent
  const __dependent = await new promise((_resl, _rej) => {
   $insDB.any(" \
      SELECT distinct dependent_ns.nspname as dependent_schema \
           , dependent_view.relname as dependent_view  \
           , source_ns.nspname as source_schema \
           , source_table.relname as source_table \
        FROM pg_depend  \
        JOIN pg_rewrite ON pg_depend.objid = pg_rewrite.oid \
        JOIN pg_class as dependent_view ON pg_rewrite.ev_class = dependent_view.oid \
        JOIN pg_class as source_table ON pg_depend.refobjid = source_table.oid \
        JOIN pg_attribute ON pg_depend.refobjid = pg_attribute.attrelid \
         AND pg_depend.refobjsubid = pg_attribute.attnum \
        JOIN pg_namespace dependent_ns ON dependent_ns.oid = dependent_view.relnamespace \
        JOIN pg_namespace source_ns ON source_ns.oid = source_table.relnamespace \
       WHERE dependent_ns.nspname = ${tableSchema} \
         AND dependent_view.relname = ${tableName} \
         AND pg_attribute.attnum > 0 ", {tableSchema: _tableSchema, tableName: _tableName} )
     .then(_row => _resl(_row))
     .catch(_err => _rej(_err));
  });

  __$log.debug("The result is <%s>", JSON.stringify(__dependent));
  //- ** No reference
  if(__dependent.length === 1){
  //- ** One reference
    _tableSchema = __dependent[0].source_schema;
    _tableName   = __dependent[0].source_table; 
  }
  //- ** Multiple reference
  return new promise((_resl, _rej) => {
   $insDB.any(" \
    select kc.column_name                             \
      from information_schema.table_constraints tc,   \
           information_schema.key_column_usage kc     \
     where tc.constraint_type = 'PRIMARY KEY'         \
       and kc.table_name = tc.table_name              \
       and kc.table_schema = tc.table_schema          \
       and kc.constraint_name = tc.constraint_name    \
       and kc.table_schema = ${tableSchema}            \
       and kc.table_name = ${tableName}  ", {tableSchema: _tableSchema, tableName: _tableName} )
     .then(_row => _resl(_row))
     .catch(_err => _rej(_err));
  });
}

function getTableCols(_tableSchema, _tableName){
  return new promise((_resl, _rej) => {
  $insDB.any("select column_name from information_schema.columns where table_schema = ${tableSchema} and table_name = ${tableName} order by ordinal_position",  {tableSchema: _tableSchema, tableName: _tableName})
       .then(_row => _resl(_row))
       .catch(_err => _rej(_err));
  });
}

function getTableColsType(_tableSchema, _tableName){
  return new promise((_resl, _rej) => {
  $insDB.any("select column_name, data_type from information_schema.columns where table_schema = ${tableSchema} and table_name = ${tableName} order by ordinal_position",  {tableSchema: _tableSchema, tableName: _tableName})
       .then(_row => _resl(_row))
       .catch(_err => _rej(_err));
  });
}

async function insertTableData(_args){
  const __cols = await getTableCols(_args.schema_name, _args.table_name);
  const __targetData = _.pick(_args.columns, _.map(__cols, _e => _e["column_name"]) );
  $insDB.query('insert into ' + _args.schema_name + '.' + _args.table_name + '(${this:name}) values (${this:csv})', __targetData);
  
}
async function executeQuery(_query, _args){
  __$log.info("[executeQuery] query: <%s>, parameters: <%s>", _query, util.inspect(_args));
  return await new Promise((_resl, _rej) => {
    $insDB.query(_query, _args).then(_data => _resl(1)).catch(_err => _rej(_err)); 
  });
}

async function pushTableData(_args){
  __$log.debug("The parameters is <%s>", util.inspect(_args.component_name.split(".")));
  const __comp = _args.component_name.split(".");
  __$log.debug("schema: <%s>, table_name: <%s>", __comp[0], __comp[1]);
  var __ret = await getTableKey(__comp[0], __comp[1]);
  __$log.debug("The result is <%s>", util.inspect(__ret));

  const __colsType = await getTableColsType(__comp[0], __comp[1]);
  __$log.debug("The column type is <%s>", JSON.stringify(__colsType));

  __ret = await $insDB.tx(_tx => {
    const __funcUpdate = (_row) => {
      __$log.debug("The pk is <%s>", JSON.stringify(__ret));
      const __where = _(__ret).map(_e => _e["column_name"] + " = '" + (_.has(_row, ["$oData", _e["column_name"]])?_row["$oData"][_e["column_name"]]:_row[_e["column_name"]]) + "'").value()
      __$log.debug("The where is <%s>", __where);

      const __update = _(_row["$oData"]).map((_v, _k) => { 
          const __colType = _.find(__colsType, {"column_name": _k} ) ;
          return (__colType["data_type"] === "json")?(_k + " = to_json('" + _row[_k] + "'::varchar)"):(_k + " = '" + _row[_k] + "'")} 
      ).value();

      __$log.debug("The update is <%s>", util.inspect(__update));
      __$log.debug("The update query <%s>", util.format("update %s.%s set %s where %s", __comp[0], __comp[1], __update.join(" , "), __where.join(" and ")));
      return _tx.none(util.format("update %s.%s set %s where %s", __comp[0], __comp[1], __update.join(" , "), __where.join(" and ")));
  };

    const __funcInsert = (_row) => {
      __$log.debug("Perform insert action <%s>", JSON.stringify(_row));
      const __arrKeys = [];
      const __arrValues = [];
      _(_row).omit(['$status', '$oData']).map((_v, _k) => { __arrKeys.push(_k); __arrValues.push("'" + _v + "'");}  ).value();
      return _tx.none(util.format("insert into %s.%s(%s) values (%s)", __comp[0], __comp[1], __arrKeys.join(", "), __arrValues.join(", ")));
    };

    const __funcDelete = (_row) => {
      __$log.debug("Perform delete action");
      const __where = _(__ret).map(_e => _e["column_name"] + " = '" + (_.has(_row, ["$oData", _e["column_name"]])?_row["$oData"][_e["column_name"]]:_row[_e["column_name"]]) + "'").value();
      return _tx.none(util.format("delete from %s.%s where %s", __comp[0], __comp[1],  __where.join(" and ")));
    };

    const __funcPush = _.cond([
      [_.matches({"$status" : "update"}), __funcUpdate],
      [_.matches({"$status" : "new"}), __funcInsert],
      [_.matches({"$status" : "delete"}), __funcDelete]
    ]);

    __ret = _(_args.user_data).map(__funcPush  ).value();
    __$log.debug("The out is <%s>", util.inspect(__ret));
    return _tx.batch(__ret);
  }).then(_data => {
    __$log.debug("Complete the transaction");
    return {err_code: 0}
  }).catch(_error => {
    __$log.debug("Error occurred <%s>", util.inspect(_error));
    return {err_code: 1, err_msg: JSON.stringify(_error)}
  }).finally(__$log.debug("Complete"));
  
  __$log.debug("The return is <%s>", JSON.stringify(__ret));
  return __ret;
}


module.exports = {
  executeQuery      : executeQuery    ,
  getTableData      : getTableData    ,
  getOneQueryData   : getOneQueryData ,
  getAnyQueryData   : getAnyQueryData ,
  pushTableData     : pushTableData   ,
  insertTableData   : insertTableData ,
  initConn          : initConn        ,
  closeConn         : closeConn  
};


