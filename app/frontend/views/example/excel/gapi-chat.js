//var __$user = "", __$pubKey = "", __$priKey = "", __$passphrase = "";
////var __$pubKeys = {};
//var __filter = {}, __shareFilter = {};
//var __showBtn = "<input id='btnShow' onclick='onShowClick({0})' type='button' value='Show' />";
//var __curSafetyRow = undefined;

function afterMainLoad() {
  console.log("Hello world");
  const __originalSaveData = $("#div-xlsGoldedPrice").handsontable("getSettings")["saveData"];
  console.log("-----------");
  console.log(__originalSaveData);

  const __f_ajaxJson = () => {
    // Commit to database backend
    const __jsonData = JSON.stringify({"user_data" :  $("#div-xlsGoldedPrice").handsontable("fetchIncrementalData")
               , "component_name": $("#div-xlsGoldedPrice").handsontable("getSettings")["bindName"]  });

      console.log("url: <%s>, data: <%s>", __jsonData);
      Rx.Observable.ajax({url: __originalSaveData, method: "POST", body: __jsonData})
        .map(_e => {
           if(_e.response.err_code === 0){
              $("#div-xlsGoldedPrice").handsontable("refreshLoki");
              alert("The data has been updated sucessfully");
           }else{
           }
        }).subscribe(console.log("Complete"));

      // Commit to database backend
      $.ajax({url: "/bot-chat/golden/price/", type: "POST", contentType: "application/json", data: __jsonData, success: function(result){
          console.log(result);
        }});



   };



//  const __func = () => {
//    const __data = $("#div-xlsGoldedPrice").handsontable("fetchIncrementalData");
//    Rx.Observable.ajax({url: __originalSaveData,
//                       method: "POST",
//                       body: JSON.stringify( {"user_data":__data} ),
//                       headers:{"Content-Type":"application/json"}
//                       }).map(_e => {
//     console.log("Data synced", _e.response);
//    }).subscribe(() =>{
//      console.log("Log data is [%o]", logData);
//    });
//  };
  $("#div-xlsGoldedPrice").handsontable("updateSettings", {saveData: __f_ajaxJson});

//  $("#div-xlsGoldenPrice").handsontable("updateSettings", {saveData: __func});

//  loadMsgArea();
//  getConfInfo();
//
//  var _xlsSetting = $("#div-sshInfoArea").handsontable("getSettings")["columns"];
//  _xlsSetting[2]["renderer"] = "html";
//  $("#div-sshInfoArea").handsontable("updateSettings", {columns: _xlsSetting});
//  $("#div-sshInfoArea").handsontable("setDataAtRowProp", 0, "private_key", "<input id='btn-priKey' onchange='onImpPriKeyClick()' type='file'>");
//
//  _xlsSetting = $("#div-safetyInfoboxArea").handsontable("getSettings")["columns"];
//  _xlsSetting[0]["renderer"] = "html";
//  _xlsSetting[5]["colWidths"] = 0.1;
//  $("#div-safetyInfoboxArea").handsontable("updateSettings", {columns: _xlsSetting, saveData: saveData});
//  __filter = {"user_id":"empty"};
//  $("#div-safetyInfoboxArea").handsontable("refreshLoki", __filter);
//  genShowButton();
//  // need plugin hiddenColumns
//  //$("#div-safetyInfoboxArea").handsontable("hiddenColumns", {columns:[5]});
//  
//  $("#div-safetyInfoboxArea").handsontable("addHook", "afterOnCellMouseDown", (_event, _coords, _td) => {
//    //console.log(_event, _coords, _td);
//    /*
//    if(_coords["col"] == 0) {
//      onShowClick(_coords["row"]);
//    }
//    */
//    __curSafetyRow = _coords["row"];
//  });
//  
//  $("#div-searchArea").handsontable("addHook", "afterChange", (_chg) => {
//    //console.log(_chg);
//    if(_chg == undefined) { return; }
//    _chg.forEach(([row, prop, oldVal, newVal]) => {
//      if(prop == "team") {
//        __shareFilter[prop] = {"$regex":new RegExp(newVal, "i")};
//      } else {
//        var vals = [];
//        var inVals = newVal.split(",");
//        inVals.forEach((val) => {
//          console.log(prop);
//          var cdtn = {};
//          cdtn[prop] =  { "$regex" : new RegExp(val, "i") };
//          vals.push(cdtn);
//        });
//        __filter["$or"] = vals;
//      }
//    });
//    console.log(__filter);
//    $("#div-shareTargetsArea").handsontable("refreshLoki", __shareFilter);
//    $("#div-safetyInfoboxArea").handsontable("refreshLoki", __filter);
//    genShowButton();
//  });
//
//  $("#div-sshInfoArea").handsontable("addHook", "afterChange", (_chg) => {
//    if(_chg == undefined) { return; }
//    _chg.forEach(([row, prop, oldVal, newVal]) => {
//      if(prop == "user_id") {
//        __$pubKey = "";
//        __$priKey = "";
//        //__$passphrase = "";
//        __$user = newVal;
//
//        $("#div-sshInfoArea").handsontable("setDataAtRowProp", 0, "passphrase", "");
//
//        if(newVal != undefined && newVal != null && newVal != "") {
//          __filter["user_id"] = newVal;
//          if(oldVal != undefined && oldVal != null && oldVal != "") {
//            setCookie("ssh-user", newVal);
//          }
//          $("#div-safetyInfoboxArea").handsontable("refreshLoki", __filter);
//          genShowButton();
//          /*
//          _sshRow = $("#div-shareTargetsArea").handsontable("fetchFullData", {"user_id":newVal})[0];
//          //console.log(_sshRow);
//          if(_sshRow == undefined || _sshRow == null) {
//            //msg.innerHTML = "<li>Cannot find the public key, please set it first.</li>";
//            alert("Cannot find the public key, please set it first.");
//          } else {
//            __$pubKey = _sshRow["dflt_pub_key"];
//            if(_sshRow["cust_pub_key"] != undefined && _sshRow["cust_pub_key"] != null && _sshRow["cust_pub_key"] != "") {
//              __$pubKey = _sshRow["cust_pub_key"];
//            }
//          }
//          */
//          __$pubKey = getPubKey(newVal);
//          //console.log(__$pubKey1 == __$pubKey);
//          //console.log(cryptoPublic.publicEncrypt(__$pubKey, "test"));
//        } else {
//          __filter["user_id"] = "empty";
//          $("#div-safetyInfoboxArea").handsontable("refreshLoki", __filter);
//        }
//      } else if(prop == "passphrase") {
//        __$passphrase = newVal;
//      }
//    });
//  });
// 
//  $("#div-sshInfoArea").handsontable("setDataAtRowProp", 0, "user_id", getCookie("ssh-user", false));
//
//  $("#div-shareTargetsArea").handsontable("addHook", "afterOnCellMouseDown", (_event, _coords, _td) => {
//    if(__curSafetyRow == undefined) { return; }
//    var _users =  $("#div-safetyInfoboxArea").handsontable("getDataAtRowProp", __curSafetyRow, "share_users");
//    var _user = $("#div-shareTargetsArea").handsontable("getDataAtRowProp", _coords["row"], "user_id");
//    if(_users == undefined || _users == null || _users == "") {
//      _users = _user;
//    } else {
//      if(_users.split(",").has(_user) == false) {
//        _users += "," + _user;
//      }
//    }
//    $("#div-safetyInfoboxArea").handsontable("setDataAtRowProp", __curSafetyRow, "share_users", _users);
//  });

  return _.chain().thru(() => {});
}

//function getPubKey(userName) {
//  var pubKey = "";
//  if(userName !== undefined){
//
//    $.ajax({ url: '/ssh-pub-key/' + userName,
//      method: "GET",
//      async: false,
//      success: function(_data){
//        //console.log("Success + <%s>",_data);
//        pubKey = _data;
//      },
//      error: function(_data){
//        alert("Get public key failed.");
//        console.log("Error+ <%s>", JSON.stringify(_data));
//      }
//    });
//  }
//  return pubKey;
//}

//function onImpPriKeyClick() {
//  var file    = document.querySelector('input[id=btn-priKey]').files[0];
//  var reader  = new FileReader();
//
//  reader.addEventListener("load", function () {
//    __$priKey = reader.result.replace(/\n$/, "");
//  }, false);
//
//  if (file) {
//    reader.readAsText(file);
//  }
//}

//function enc(pubKey, str) {
//  //console.log(str, pubKey);
//  if(str == undefined || str == "") {return "";}
//  if(pubKey == "") {
//    alert("Please set the public key first.");
//    //msg.innerHTML = "<li>Please set the public key first.</li>";
//    return "";
//  }
//  return cryptoPublic.publicEncrypt(pubKey, str);
//}

//function dec(encStr) {
//  if(encStr == undefined || encStr == "") {return "";}
//  if(__$priKey == "") {
//    alert("Please set the private key first.");
//    //msg.innerHTML = "<li>Please set the private key first.</li>";
//    return "";
//  }
//  if(__$passphrase == "") {
//    alert("Please set the passphrase first.");
//    //msg.innerHTML = "<li>Please set the passphrase first.</li>";
//    return "";
//  }
//  var str = cryptoPublic.privateDecrypt({ key: __$priKey  , passphrase: __$passphrase }, encStr);
//  return str;
//}

//function genShowButton() {
//  setTimeout(() => {
//    var rowCnt = $("#div-safetyInfoboxArea").handsontable("countRows");
//    //console.log("generate show button for %d lines", rowCnt);
//    for(var i = 0; i < rowCnt; i++) {
//      $("#div-safetyInfoboxArea").handsontable("setDataAtRowProp", i, "show", stringFormat(__showBtn, [i]));
//    }
//  }, 1000);
//}

//function onShowClick(rowNo) {
//  encStr = $("#div-safetyInfoboxArea").handsontable("getDataAtRowProp", rowNo, "value");
//  //console.log("Crypted text [%s]", encStr);
//  str = dec(encStr);
//  //console.log("Decrypted text [%s]", str);
//  if(str == "") { return; }
//  alert("Your decrypted string is [{0}]".format(str));
//}

//function saveData() {
//  var odata = $("#div-safetyInfoboxArea").handsontable("fetchIncrementalData");
//  var data = [], logData = [], oldShareData = [], newShareData = [];
//  //console.log("incremental data is %o", odata);
//
//  // get incremental main data
//  odata.forEach((_row) => {
//    var oval =  _row["new_value"];
//
//    delete _row["show"];
//    delete _row["created_at"];
//    delete _row["updated_at"];
//    delete _row["new_value"];
//
//    if(_row["$status"] == "new") {
//      delete _row["id"];
//    } else if(_row["$status"] == "update") {
//      delete _row["$oData"]["show"];
//      if(oval != undefined && oval != "") {
//        _row["$oData"]["value"] = _row["value"];
//      }
//      //console.log(JSON.stringify(_row["$oData"]));
//      if( _row["$oData"] == undefined || JSON.stringify(_row["$oData"]) == "{}") { return; }
//    } else if(_row["$status"] == "delete") {
//
//    }
//
//    if(oval == undefined || oval == "") {
//      oval = dec(_row["value"]);
//    } else {
//      _row["value"] = enc(__$pubKey, oval);
//    }
//    _row["user_id"] = __$user;
//    _row["created_by"] = __$user;
//    _row["updated_by"] = __$user;
//
//    if(_row["share_users"] == undefined || _row["share_users"] == "") {
//      _row["share_users"] = __$user;
//    } else if(_row["share_users"].split(",").has(__$user) == false) {
//      _row["share_users"] = _row["share_users"] + "," + __$user;
//    }
//    data.push(_row);
//
//    // prepare log data
//    if(_row["$status"] != "new") {
//      var _logrow = {
//          "$status":"new"
//        , "$oData":{}
//        , "id":_row["id"]
//        , "user_id":__$user
//        , "value":_row["value"]
//        , "share_users":_row["share_users"]
//        , "tags":_row["tags"]
//        , "opt_type":_row["$status"]
//        , "created_by":__$user
//        , "updated_by":__$user
//      };
//      if(_row["$status"] == "update") {
//        if(_row["$oData"]["value"] != undefined) { _logrow["value"] = _row["$oData"]["value"] }
//        if(_row["$oData"]["tags"] != undefined) { _logrow["tags"] = _row["$oData"]["tags"] }
//        if(_row["$oData"]["shares_users"] != undefined) { _logrow["share_users"] = _row["$oData"]["share_users"] }
//      }
//      logData.push(_logrow);
//    }
//
//    //prepare old share data
//    var oldShareUsers = {"user_id":{"$ne":__$user}};
//    if(_row["$status"] == "update") {
//      if(_row["$oData"]["share_users"] != undefined) {
//        oldShareUsers["share_users"] = _row["$oData"]["share_users"];
//      } else {
//        oldShareUsers["share_users"] = _row["share_users"];
//      }
//      if(_row["$oData"]["tags"] != undefined) {
//        oldShareUsers["tags"] = _row["$oData"]["tags"];
//      } else {
//        oldShareUsers["tags"] = _row["tags"];
//      }
//    } else if(_row["$status"] == "delete") {
//      oldShareUsers["share_users"] = _row["share_users"];
//      oldShareUsers["tags"] = _row["tags"];
//    } else {
//      oldShareUsers = undefined;
//    }
//    if(oldShareUsers != undefined) {
//      // get old share users key
//      var tmpRows = $("#div-safetyInfoboxArea").handsontable("fetchFullData", oldShareUsers);
//      //console.log(oldShareUsers, tmpRows);
//      tmpRows.forEach((tmpRow) => {
//        tmpRow["$status"] = "delete";
//        oldShareData.push(tmpRow);
//      });
//    }
//
//    //prepare new share data
//    var shareUsers = [];
//    if(_row["$status"] == "new" || _row["$status"] == "update") {
//      shareUsers = uniqArr(_row["share_users"].split(","));
//    }
//    shareUsers.forEach((_shareUser) => {
//      var newShareRow = {};
//      if(_shareUser == __$user) { return; }
//      var shareUserPubKey = getPubKey(_shareUser);
//      var shareValue = enc(shareUserPubKey, oval);
//      newShareRow = {
//          "$status":"new"
//        , "$oData":{}
//        , "user_id":_shareUser
//        , "value":shareValue
//        , "share_users":_row["share_users"]
//        , "tags":_row["tags"]
//        , "created_by":__$user
//        , "updated_by":__$user
//      };
//      newShareData.push(newShareRow);
//    });
//  });
//  // save data
//  console.log("incremental data is %o", data);
//  Rx.Observable.ajax({url: "/db/db/db_mgmt/common/m_safety_inbox",
//                      method: "POST",
//                      body: JSON.stringify( {"user_data":data} ),
//                      headers:{"Content-Type":"application/json"}
//                      }).map(_e => {
//    console.log("Save data of [Safety Infobox] %o", _e.response);
//  }).subscribe(() =>{
//    console.log("Log data is [%o]", logData);
//    // save log
//    Rx.Observable.ajax({url: "/db/db/db_mgmt/common/t_safety_inbox_log",
//                        method: "POST",
//                        body: JSON.stringify( {"user_data":logData} ),
//                        headers:{"Content-Type":"application/json"}
//                       }).map(_e => {
//      console.log("Save log data result %o", _e.response);
//    }).subscribe(() =>{
//      console.log("Save data of [Safety Infobox maintain log] completed");
//
//      // get log
//      Rx.Observable.ajax("/db/db/db_mgmt/common/t_safety_inbox_log").map(_e => {
//        //console.log("The get objects is <%s>", JSON.stringify(_e.response));
//        $("#div-SafetyInfoboxMaintainLogArea").handsontable("loadLoki", _e.response);
//      }).subscribe(() => {
//        console.log("Refresh data of [Safety Infobox Maintain Log] completed");
//      });
//    });
//    // clean old share data
//    console.log("clean old share data is %o", oldShareData);
//    Rx.Observable.ajax({url: "/db/db/db_mgmt/common/m_safety_inbox",
//                        method: "POST",
//                        body: JSON.stringify( {"user_data":oldShareData} ),
//                        headers:{"Content-Type":"application/json"}
//                       }).map(_e => {
//      console.log("Delete old share data result %o", _e.response);
//    }).subscribe(() =>{
//      // add new share data
//      console.log("add new share data is %o", newShareData);
//      Rx.Observable.ajax({url: "/db/db/db_mgmt/common/m_safety_inbox",
//                          method: "POST",
//                          body: JSON.stringify( {"user_data":newShareData} ),
//                          headers:{"Content-Type":"application/json"}
//                         }).map(_e => {
//        console.log("Save new share data result %o", _e.response);
//        msg.innerHTML = "<li>Save data of [Safety Infobox] completed</li>";
//      }).subscribe(() =>{
//        console.log("Save data of [Safety Infobox] completed");
//        // get data
//        Rx.Observable.ajax("/db/db/db_mgmt/common/m_safety_inbox").map(_e => {
//          //console.log("The get objects is <%s>", JSON.stringify(_e.response));
//          $("#div-safetyInfoboxArea").handsontable("loadLoki", _e.response);
//          $("#div-safetyInfoboxArea").handsontable("refreshLoki", __filter);
//          genShowButton();
//        }).subscribe(() => {
//          console.log("Refresh data of [Safety Infobox] completed");
//        });
//      });
//    });
//  });
//}

