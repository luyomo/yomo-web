const sentinel   = require('redis-sentinel'),
      redis      = require('redis');

function getRedisConn(_args){
  return (_args.single === undefined )?sentinel.createClient.apply(this, _args.sentinal):redis.createClient.apply(this, _args.single);
}

module.exports = {
  getRedisConn : getRedisConn
};
