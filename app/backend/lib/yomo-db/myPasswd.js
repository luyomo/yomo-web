const util          = require('util')
    , mysql         = require('mysql')
    , _             = require("lodash")
    , nodemailer    = require('nodemailer')
    , smtpTransport = require('nodemailer-smtp-transport')
    , yaml          = require('node-yaml')
    , rsa           = require('./rsa.js');

function $getMailCfg(){
  return new Promise((_rl, _rj) => {
    var cfgData = yaml.readSync("sendmail.yaml");
    _rl(cfgData.smtp_host);
  }).catch(_err => {
  });
}

send_mail =  (_to, _subject, _text) => {
  $getMailCfg().then( _v => {
    const transporter = nodemailer.createTransport(_v);

    const mailOptions = { to: _to, subject: _subject, text: _text, };

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) console.error("Error when seding the message<%s>", error);
      console.log("Message sent :%s", info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
};

module.exports = (_json, _timeout, _subject, _context, _callback) => {
  var res = [];
  //- hostname
  (_json.hostname === undefined) && res.push({error_code: "A-001", error_message: "Please provide the <hostname>"});
  
  // db name
  (_json.dbname=== undefined) && res.push({error_code: "A-002", error_message: "Please provide the <dbname>"});
  
  // port
  _json.port = (_json.port === undefined)?3306:_json.port;
  
  // conn user
  (_json.conn_user === undefined) && res.push({error_code: "A-003", error_message: "Please provide the <conn_user>"});
  
  // conn password
  (_json.conn_passwd === undefined) && res.push({error_code: "A-004", error_message: "Please provide the <conn_passwd>"});
  
  //   target user
  (_json.user === undefined) && res.push({error_code: "A-005", error_message: "Please provide the <user>"});
  
  //   notification user
  (_json.ccUser === undefined) && res.push({error_code: "A-005", error_message: "Please provide the <user>"});
  
  console.log("The original time is <%s>", _timeout);
  //['1 hours', '1 minutes', '1 seconds', '1 days']
  _timeout = (_timeout === undefined)? '1 hours':_timeout;

  if (res.length > 0) return res;
  
  var timeoutSec = 0;
  if(typeof(_timeout) === "string"){
    if(parsedHour = _timeout.match(/(\d+) hours/)){
      timeoutSec = timeoutSec + parsedHour[1]*3600 * 1000;
    }
    
    if(parsedMin = _timeout.match(/(\d+) minutes/)){
      timeoutSec = timeoutSec + parsedMin[1]*60 * 1000;
    }
    
    if(parsedSec = _timeout.match(/(\d+) seconds/)){
      timeoutSec = timeoutSec + parsedSec[1] * 1000;
    }
  }

  console.log("The time is <%d>", timeoutSec);

  if(typeof(_timeout )=== "number") timeoutSec = _timeout;
  
  //console.log("The result is the regrex <%s>", "10 hours".match(/(\d+) hours/));
  
  console.log("host           : %s", _json.hostname);
  console.log("dbname         : %s", _json.dbname);
  console.log("port           : %d", _json.port);
  console.log("conn user      : %s", _json.conn_user);
  console.log("conn password  : %s", _json.conn_passwd)
  console.log("target user    : %s", _json.user)
  console.log("time our       : %s", timeoutSec)
  console.log("user to notify : %s", _json.ccUser)
  
  const randPass = Math.random().toString(36).substring(7);
  
  setTimeout(() => {
    var connection = mysql.createConnection({
      host     : _json.hostname,
      user     : _json.conn_user,
      password : rsa.decrypt(_json.conn_passwd, "/lib/internal/dbapps-rsa/passwd.pem"),
      database : _json.dbname,
      port     : _json.port
    });
  
    connection.connect();
    console.log(util.format("alter user %s identified by '%s'", _json.user, (_json.passwd?_json.passwd:randPass) ));
    connection.query(util.format("alter user %s identified by '%s'", _json.user, (_json.passwd?_json.passwd:randPass)) 
      , function (error, results, fields) {
      if (error) throw error;
      send_mail(_json.ccUser, _subject, _context);
      _callback();
      console.log('The password was changed to <%s> ', randPass);
    });
    connection.end();
  }, timeoutSec);
  
  return {"password": randPass} 
};
