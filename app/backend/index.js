const userctrl = require('./controller.js');   // logic
const bodyParser = require('koa-bodyparser');

var Koa = require('koa2');
var Router = require('koa-router');

var app = new Koa();
var router = new Router();

const util = require("util");

app.use(bodyParser());

router.get('/api/pg-table-data.rest'    , userctrl.fetchPGData           );
router.get('/api/page-permission.rest'  , userctrl.getPagePermission     );
router.post('/api/pg-table-data.rest'   , userctrl.pushPGData            );
router.post('/api/new-page.rest'        , userctrl.pushTemplate01        );
router.post('/api/xls-def.rest'         , userctrl.pushNewXls            );

app
  .use(userctrl.chkUserAuth)
  .use(router.routes(app))
  .use(router.allowedMethods());

app.listen(8084, '0.0.0.0');
