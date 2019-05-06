const yaml     = require('node-yaml')
    , winston  = require("winston")
    , cfgData  = yaml.readSync("../etc/config.yaml")
    , verifyIDToken = require('yomo-gapi-auth')
    , fs            = require('fs')
    , crypto        = require('crypto');

global._$log = require('yomo-log')({
     transports: [new winston.transports.File({ filename: cfgData.bg_log_file })],
     level: 'debug'});

const db  = require('yomo-db')
    , util = require('util')
    , _ = require("lodash");

db.pg.initConn(cfgData["config-db"]);

_$log.level = cfgData.log_mode?cfgData.log_mode:'info';

function getRequestData(_url){
  var __strP = _url.includes("?")?decodeURI(_url.split("?")[1]):{} ;
  try {
    return JSON.parse(__strP);
  } catch (e) {
    _$log.debug("The strp is <%s>", __strP);
    if(__arrData =  __strP.match(/(.*)\.(.*)/)){
      _$log.debug("This parsed data is <%s>", JSON.stringify(__arrData));
      return {schema_name: __arrData[1], table_name: __arrData[2]};
    }
    _$log.debug("Can I catch it");
  }
}

function parseRawData(_data){
  var __arrData = decodeURIComponent(_data);
  return JSON.parse(__arrData);
}

function parseParam(_data){
  var __arrData = decodeURIComponent(_data).split("=");
  return {[__arrData[0]] : JSON.parse(__arrData[1])};
}

function signData(_data){
  const __pri = fs.readFileSync('/app/etc/sign.priv.pem');

  const __signer = crypto.createSign('RSA-SHA256');
  __signer.update(_data);
  const __sig = __signer.sign(__pri, 'base64');

  return __sig;
}

function verifySign(_data){
  const __jsonBuff = JSON.parse(Buffer.from(_data, 'base64'));
  const __pub = fs.readFileSync('/app/etc/sign.pub.pem');
  const __verifier = crypto.createVerify('RSA-SHA256');
  __verifier.update(JSON.stringify(__jsonBuff.payload));

  const __pubBuf = Buffer.from(__pub, 'utf-8');
  const __sigBuf = Buffer.from(__jsonBuff.siga , 'base64');
  return __verifier.verify(__pubBuf, __sigBuf);
}

class UserController {
  async chkUserAuth(_ctx, _next){
    try
    {
      _$log.info("--------Checking the authentication");
      _$log.debug("The cookies is <%s>", _ctx.cookies.get('idtoken'));

      const __openIDCfg = fs.existsSync(cfgData.cert_dir+"/openid-configuration")?cfgData.cert_dir+"/openid-configuration":undefined;
      const __jwtFile   = fs.existsSync(cfgData.cert_dir+"/jwks_files")?cfgData.cert_dir+"/jwks_files":undefined;
      _$log.debug("openID configuration : <> , jwt file: <%s>", __openIDCfg, __jwtFile);

      const __ret = await verifyIDToken(_ctx.cookies.get('idtoken'), cfgData.client_id, __openIDCfg, __jwtFile);
      if(!__ret.ret){
        _$log.debug("The error is <%s>", util.inspect(__ret));
        _ctx.body = {message: "Failed on the authentication"};
        _ctx.status = 401;
      }else{
        _ctx.userName = __ret.content.email.split('@')[0];

        if(_ctx.cookies.get('userAccess') !== undefined){
          if(verifySign(_ctx.cookies.get('userAccess')) !== true ){
            _$log.info("Invalid access from remote");
          }else{
            const __jsonBuff = JSON.parse(Buffer.from(_ctx.cookies.get('userAccess'), 'base64'));
            _$log.debug("User access data is <%s>", JSON.stringify(__jsonBuff));
          }
        }
        await _next();
      }
    } catch (_err){
      _ctx.body = {message: _err.message};
      _ctx.status = _err.status || 500;
    }
  }

  async fetchMenuList(ctx) {
    const __ret = await db.pg.pgGetTableData({"schema_name" : "yomo", "table_name": "vw_menu"});
    ctx.body = "Hello world"; 
  }

  async fetchPGData(ctx, next) {
    _$log.info("[fetchPGData] [url=<%s>]", ctx.request.url);
    ctx.body = await db.pg.pgGetTableData( getRequestData(ctx.request.url ));
  }

  async pushPGData(ctx, next) {
    _$log.info("[pushPGData] [data=<%s>]", ctx.request.rawBody);
    const __ret = await db.pg.pgPushTableData(JSON.parse(ctx.request.rawBody));
    _$log.debug("Return before ret is <%s>", JSON.stringify(__ret));
    ctx.body = __ret;
  }

  async pushNewXls(ctx, next){
    _$log.debug("[pushNewXls] [data=<%s>]", ctx.request.rawBody);
    const __data = JSON.parse(ctx.request.rawBody);
    _$log.debug("The data is <%s>", JSON.stringify(__data));
    const __prevID = _.min(_.map(__data.user_data, _e => _e["cmpt_id"])) - 1;
    _$log.debug("The previous id is <%d>", __prevID);

    const __funcAddExcel = async (_row) => {
      var __templateName;
      if(_row.comp_type === "excel"){
        __templateName = "/system/new-page/template-001";
      }else if(_row.comp_type === "chart"){
        __templateName = "/system/new-page/template-002";
      }else if(_row.comp_type === "button"){
        __templateName = "/system/new-page/template-003";
      }
      db.pg.pgPushTableData({"component_name": "yomo.v_cmpt_master", "user_data": [_row]});

      //await db.pg.pgExecuteQuery("insert into v_page_params(id, page_name, data_id, attr_key, attr_value, comment )  select ${xlsID}, page_name, data_id, 'cmpt_id', ${xlsID}::varchar, 'Generated from pushNewXls' from v_page_params where id = (${xlsID}/10)::int*10 ", {"prevXlsID" : __prevID, "xlsID" : _row["cmpt_id"]});

      await db.pg.pgExecuteQuery("insert into v_cmpt_conf(cmpt_id, attr_id, name, value, disabled_flag) select ${cmpt_id}, attr_id, name, value, disabled_flag from yomo_template.tpl_vw_cmpt_conf where template_name = ${template_name}", {template_name: __templateName, "cmpt_id" : _row["cmpt_id"]});

      await db.pg.pgExecuteQuery("insert into v_cmpt_col_conf(cmpt_id, col_id, attr_id, name, value) select ${cmpt_id}, col_id, attr_id, name, value from yomo_template.tpl_vw_cmpt_col_conf  where template_name = ${template_name}", {template_name: __templateName, "cmpt_id" : _row["cmpt_id"]} );
    };

    const __funcUpdateExcel = async (_row) => {
      db.pg.pgPushTableData({"component_name": "yomo.vw_cmpt_master", "user_data": [_row]});
    };

    const __funcDeleteExcel = async (_row) => {
      _$log.debug("Starting to delete one excel");
      //- Delete from v_cmpt_col_conf
      await db.pg.pgExecuteQuery("delete from v_cmpt_col_conf where cmpt_id = ${cmpt_id}", {"cmpt_id" : _row["cmpt_id"]});

      //- Delete from v_cmpt_conf
      await db.pg.pgExecuteQuery("delete from vw_cmpt_conf where cmpt_id = ${cmpt_id}", {"cmpt_id" : _row["cmpt_id"]});

      //- Delete from v_cmpt_master
      await db.pg.pgExecuteQuery("delete from vw_cmpt_master where cmpt_id = ${cmpt_id}", {"cmpt_id" : _row["cmpt_id"]});
      
      //- Delete from v_page_params
      await db.pg.pgExecuteQuery("delete from v_page_params where attr_key = 'cmpt_id' and attr_value::int = ${cmpt_id}", {"cmpt_id" : _row["cmpt_id"]});
    }
    //_.map(__data.user_data, _row => {
    //  console.log("The data is <%s>", JSON.stringify(_row));
    //  
    // });

    var __funcBranch = _.cond([
      [ _.matches({"$status" : "new"                          }), __funcAddExcel       ],
      [ _.matches({"$status" : "update"                       }), __funcUpdateExcel    ],
      [ _.matches({"$status" : "delete"                       }), __funcDeleteExcel    ],
      [_.stubTrue,    () => {_$log.debug("Unexpected data")}]
    ]);

    _(__data.user_data).map(__funcBranch).value();

   ctx.body = {"err_code" : 0};
    
  }

  async pushTemplate01(ctx, next) {
    _$log.info("[pushTemplate01] [data=<%s>]", ctx.request.rawBody);
    const __data = parseRawData(ctx.request.rawBody) ;
    _$log.debug("[pushTemplate01] [The parsed data is <%s>]", JSON.stringify(__data));

    //- New Branch
    const __funcAddBranch = async (_pageData) => {

      const __func_fetchIDQuery = (_pid) => {
        if(_pid < 90000) return "select coalesce(max(id), 0)+1 as id from v_menu where id < 100";
        if(_pid >= 90000 && _pid <  95000) return "select coalesce(max(id), 0)+1 as id from v_menu where id between 90000 and 90099";
        if(_pid >= 95000 && _pid < 100000) return "select coalesce(max(id), 0)+1 as id from v_menu where id between 95000 and 95099";
      };
      //-- * Get next id
      //const __ret = await db.pg.pgGetOneQueryData( _pageData.pid < 90000?"select coalesce(max(id), 0)+1 as id from v_menu where id < 100":"select coalesce(max(id), 0)+1 as id from v_menu where id between 90000 and 90099");
      const __ret = await db.pg.pgGetOneQueryData( __func_fetchIDQuery( _pageData.pid));
      const __pageData = _.assignIn(_pageData, __ret);
      await db.pg.insertTableData({"schema_name":"yomo", "table_name":"v_menu", "columns": __pageData});
      //-- * Insert into database 
    }; 

    //- New Page
    const __funcAddPage = async (_pageData) => {
      _$log.debug("Todo --  Add New Page in the menu for template 01 <%s>", JSON.stringify(_pageData));
      const __templateName = "/system/new-page/template-001";
      const __func_fetchBaseIDQuery = (_pid) => {
        if(_pid < 90000) return "select ((coalesce(max(id), 10)/100) + 1)*100 as id, ((coalesce(max(id), 10)/100) + 1)*100 as base_id from v_menu where id < 90000 and has_children = false";
        if(_pid >= 90000 && _pid <  95000) return "select ((coalesce(max(id), 90000)/100) + 1)*100 as id, ((coalesce(max(id), 90000)/100) + 1)*100 as base_id from v_menu where id >= 90000 and id < 95000 and has_children = false";
        if(_pid >= 95000 && _pid < 100000) return "select ((coalesce(max(id), 95000)/100) + 1)*100 as id, ((coalesce(max(id), 95000)/100) + 1)*100 as base_id from v_menu where id >= 95000 and id < 100000  and has_children = false";
      };
      //-- * Get next id
      //const __nxtID = await db.pg.pgGetOneQueryData(_pageData.pid < 90000?"select ((coalesce(max(id), 10)/100) + 1)*100 as id, ((coalesce(max(id), 10)/100) + 1)*100 as base_id from v_menu where id < 90000 and has_children = false":"select ((coalesce(max(id), 90000)/100) + 1)*100 as id, ((coalesce(max(id), 90000)/100) + 1)*100 as base_id from v_menu where id > 90000 and has_children = false");
      _$log.debug("Come here to add one page <%s>", _pageData["id"]);
      var __nxtID;
      if(_pageData["id"] === undefined || _pageData["id"] === ""){
        _$log.debug("Come fere to chec the data ")
        __nxtID = await db.pg.pgGetOneQueryData(__func_fetchBaseIDQuery(_pageData.pid));
      }else {
        __nxtID = {id: _pageData["id"], base_id: _pageData["id"]};
      }
      _$log.debug("The base id is <%s>", JSON.stringify(__nxtID));
      const __pageData = _.assignIn(_pageData, __nxtID, {"page_name" : _pageData.href.replace('/main.html', ''), "template_name" : __templateName, "has_children": false });
      _$log.debug("The data became to <%s>", JSON.stringify(__pageData));

      //- * Menu insert
      await db.pg.insertTableData({"schema_name":"yomo", "table_name":"v_menu", "columns": __pageData});
      // console.log("The page name is <%s>", _pageData.href.replace('/main.html', ''));
      //
      //- * vw_page_data_struct data insert
      await db.pg.pgExecuteQuery("insert into yomo.vu_page_data_struct(id, parent_node, child_node, type, action_name, comment ) select id + ${base_id} as id, replace(parent_node, '{page_name}', ${page_name}) as parent_node, child_node, type, action_name, comment from yomo_template.tpl_vw_page_data_struct  where template_name = ${template_name}", __pageData);

      //- * page_param
       await db.pg.pgExecuteQuery("insert into yomo.vu_page_params(id, page_name, data_id, attr_key, attr_value, comment) select id + ${base_id} as id , replace(page_name, '{page_name}', ${page_name}) as page_name , case when data_id < 90000 then data_id + ${base_id} else data_id end as data_id, attr_key, case when attr_key in ('cmpt_id', 'comp_id') then (attr_value::int + ${base_id})::varchar else attr_value end as attr_value , comment from yomo_template.tpl_vw_page_params where template_name = '/system/new-page/template-001'", __pageData);

      await db.pg.pgExecuteQuery("insert into yomo.vu_cmpt_master(cmpt_id, cmpt_uid, cmpt_name, comment) select cmpt_id+${base_id} as cmpt_id, cmpt_uid,  cmpt_name, comment from yomo_template.tpl_vw_cmpt_master where template_name = ${template_name}", __pageData);
      
      await db.pg.pgExecuteQuery("insert into yomo.vu_cmpt_conf(cmpt_id, attr_id, name, value) select cmpt_id + ${base_id} as cmpt_id, attr_id, name, value from yomo_template.tpl_vw_cmpt_conf where template_name = ${template_name}", __pageData);
      
      await db.pg.pgExecuteQuery("insert into yomo.vu_cmpt_col_conf(cmpt_id, col_id, attr_id, name, value) select cmpt_id + ${base_id} as cmpt_id, col_id, attr_id, name, value from yomo_template.tpl_vw_cmpt_col_conf  where template_name = ${template_name}", __pageData);

    }; 

    //- Update Branch
    const __funcUpdateBranch = (_pageData) => {
      _$log.debug("Todo --  Update Branch in the menu for template 01 <%s>", JSON.stringify(_pageData));
    }; 

    //- Update Page
    const __funcUpdatePage = (_pageData) => {
      _$log.debug("Todo --  Update Page in the menu for template 01 <%s>", JSON.stringify(_pageData));
    }; 

    //- Delete Branch
    const __funcDeleteBranch = (_pageData) => {
      _$log.debug("Todo --  Delete Branch in the menu for template 01 <%s>", JSON.stringify(_pageData));
    }; 

    //- Delete Page
    const __funcDeletePage = (_pageData) => {
      _$log.debug("Todo --  Delete Page in the menu for template 01 <%s>", JSON.stringify(_pageData));
    }; 

    var __funcBranch = _.cond([
      [ _.matches({"$status" : "new"   , "has_children" : true}), __funcAddBranch     ],
      [ _.matches({"$status" : "update", "has_children" : true}), __funcUpdateBranch  ],
      [ _.matches({"$status" : "delete", "has_children" : true}), __funcDeleteBranch  ],
      [ _.matches({"$status" : "new"                          }), __funcAddPage       ],
      [ _.matches({"$status" : "update"                       }), __funcUpdatePage    ],
      [ _.matches({"$status" : "delete"                       }), __funcDeletePage    ],
      [_.stubTrue,    () => {_$log.debug("Unexpected data")}]
    ]);

    _(__data.user_data).map(__funcBranch).value();
    ctx.body = {"err_code": 0};
  }

  async getPagePermission (_ctx, next) {
    const __ret = await db.pg.pgGetAnyQueryData("with recursive base_tbl as ( \
    select t1.role_name, \
           t1.object_name, \
           t1.priv \
    from   yomo.v_usr_priv_ajax t1 \
    inner  join yomo.v_usr_master t2 \
    on     t1.role_name = t2.role_name \
    union all \
    select t2.child_role , \
           t1.object_name, \
           t1.priv \
    from   yomo.usr_role_rel t2, \
           base_tbl t1 \
    where  t1.role_name = t2.parent_role \
) select * from base_tbl where role_name = 'chunhua.zhang'");

    const __sig = signData(JSON.stringify(__ret));
    const __data = {payload: __ret , siga: __sig}  ;
    _$log.debug("The data after signature is <%s>", JSON.stringify( __data  ));
    const __buff = Buffer.from(JSON.stringify(__data));
    const __resData = __buff.toString('base64');
    const __jsonBuff = JSON.parse(Buffer.from(__resData, 'base64'));
    //console.log("The json data is <%s>", util.inspect(__jsonBuff));

    _ctx.body = {"err_code": 0, "data" : __resData};
  }
}

module.exports = new UserController();
//module.exports = {
//login: ctx => {console.log("Hello login")}
//};

