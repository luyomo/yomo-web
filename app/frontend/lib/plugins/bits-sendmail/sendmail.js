(() => {
const util          = require('util')
    , _             = require("lodash")
    , nodemailer    = require('nodemailer')
    , smtpTransport = require('nodemailer-smtp-transport')
    , yaml          = require('node-yaml');

var log ;

//------------------------------------------------------------------------------
// FUNCTION NAME: send_mail
// DESC : Sending email according the table definition
// FLOW : (DB instance, parameters ) =>MAIL sending
//------------------------------------------------------------------------------
exports.send_mail =  (_log, insDB, args) => {
  _log.debug("Come inti the send mail function");

  const pGetMail    = $getMailTo(_log, insDB, 1);
  const pGetMailTpl = $getMailTemplate(_log, insDB, 1);
  const pGetMailCfg = $getMailCfg(_log);

  Promise.all([pGetMail, pGetMailTpl, pGetMailCfg]).then( _v => {
    const [_em_to, _em_text, _em_smtp] = _v;

    _log.debug("The config is <%s>", util.inspect(_em_smtp));
    const transporter = nodemailer.createTransport(_em_smtp);

    const mailOptions = {
      to: _em_to,
      subject: 'test from nodejs',
      text: 'test email fro nodejs',
      html: _em_text
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if(error) return _log.error(error);
      console.log("Message sent :%s", info.messageId);
      console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });
  });
};

//------------------------------------------------------------------------------
// FUNCTION NAME: $getMailTo
// DESC : Getting the email address to send to
// FLOW : (DB instance, group id ) => mail addresses <a@gmail.com, b@gmail.com>
//------------------------------------------------------------------------------
function $getMailTo(_log, _insDB, _gID){
  return new Promise((_rl, _re)=> {
    _log.debug("The parameters is [%s]", typeof({"group_id": _gID}));

    _insDB.any("select email_addr from em_group eg inner join em_users eu on eu.group_id = eg.id and eg.group_name = 'price engine'", {"group_id": _gID})
      .then(_mail_tos => _rl(_mail_tos.map(_mail_to =>  _mail_to.email_addr).join(",")))
      .catch(_err => {_log.error("The erro info is ", util.inspect(_err)); _re(_err);});
  });
}

//------------------------------------------------------------------------------
// FUNCTION NAME: $getMailTemplate
// DESC : Getting the email template to send
// FLOW : (DB instance, group id ) => mail template
//------------------------------------------------------------------------------
function $getMailTemplate(_log, _insDB, _gID){
  return new Promise((_rl, _rj)=> {
    _log.debug("The parameters is [%s]", typeof({"group_id": _gID}));

    _insDB.any(`select ec.mail_template
               from em_group_2_mail g2m
         inner join em_group eg
                 on g2m.group_id = eg.id
                and g2m.group_id = $(group_id)
         inner join em_tpl_content ec
                 on g2m.em_tpl_id = ec.id`, {"group_id": _gID})
      .then(_tpl_mail => { _tpl_mail[0]?_rl(_tpl_mail[0].mail_template):_rl("No template found");})
      .catch(_err => {_log.error("The erro info is ", util.inspect(_err)); _rj(_err);});
  });
}

//------------------------------------------------------------------------------
// FUNCTION NAME: $getMailCfg
// DESC : Getting the server configuration
// FLOW : () => server configuration
//------------------------------------------------------------------------------
function $getMailCfg(_log){
  return new Promise((_rl, _rj) => {
    var cfgData = yaml.readSync("sendmail.yaml");
    _log.debug("The config value is <%s>", util.inspect(cfgData));
    _rl(cfgData.smtp_host);
  }).catch(_err => {
    _log.error.log("The error is <%s>", util.inspect(_err));
    _rj(_err);
  });
}

})();

return module.exports;
