const myPasswd = require ('./myPasswd');
const pgTableData = require('./pgTableData');
const redisPkg = require('./redisFetchData.js');

module.exports = {
  my : {
         myPasswd : myPasswd,
       },
  pg : {
         initConn            :  pgTableData.initConn,
         closeConn           :  pgTableData.closeConn,
         pgExecuteQuery      :  pgTableData.executeQuery,
         pgGetTableData      :  pgTableData.getTableData,
         pgGetOneQueryData   :  pgTableData.getOneQueryData,
         pgGetAnyQueryData   :  pgTableData.getAnyQueryData,
         pgPushTableData     :  pgTableData.pushTableData,
         insertTableData     :  pgTableData.insertTableData,
       },
  redis: {
         getRedisConn     : redisPkg.getRedisConn
       }
};
