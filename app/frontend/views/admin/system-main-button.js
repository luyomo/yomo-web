const lokiCfg = new loki("config");

//var lokiXlsid2name    = lokiCfg.addCollection("xlsID2Name");
//var lokiXlsColid2name = lokiCfg.addCollection("xlsColID2Name");

const lokiData = {};
lokiData["xlsID2Name"]    = lokiCfg.addCollection("xlsID2Name");
lokiData["xlsColID2Name"] = lokiCfg.addCollection("xlsColID2Name");


function onXlsid2name(_comp, _data){
  lokiData["xlsID2Name"].insert(_data);
}
function onXlsColid2name(_comp, _data){
  lokiData["xlsColID2Name"].insert(_data);
}

function afterMainLoad(){
  $("#div-xls-list").handsontable("refreshLoki", {"cmpt_id": 0});
  $("#div-xls-conf").handsontable("refreshLoki", {"cmpt_id": 0});

  //- * menu list click
  //- ** show all the excel list for the menu
  //- ** Hide all the contents in the configuration and cols conf
  var timer = null;

  const __f_MenuList_ClkEvent = () => {
    //console.log("The loki data xls <%s>", JSON.stringify( lokiData["xlsID2Name"] ));
    //console.log("The loki col data xls <%s>", JSON.stringify( lokiData["xlsColID2Name"] ));
    //- Add the click event
    $("#div-xls-menu-list").handsontable("addHook", "afterOnCellMouseDown", (_event, _coords, _td) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        //console.log("The coords is <%s>", JSON.stringify(_coords));

        const __xlsList = $("#div-xls-menu-list").handsontable("getDataAtRowProp", _coords.row, "cmpt_id_list");
        $("#div-xls-list").handsontable("refreshLoki", { 'cmpt_id' : {'$in' : __xlsList}});
        $("#div-xls-conf").handsontable("refreshLoki", {"cmpt_id": 0});
      }, 100);
    });
  }; 

  //- * Excel list click 
  //- ** Show all the contents on the configuration
  //- ** Show all the contents on the xls cols
    const __f_XlsList_ClkEvent =  () => {
    //- Add the click event
    $("#div-xls-list").handsontable("addHook", "afterOnCellMouseDown", (_event, _coords, _td) => {
      clearTimeout(timer);

      timer = setTimeout(() => {
        //console.log("The coords is <%s>", JSON.stringify(_coords));

        const __xlsID = $("#div-xls-list").handsontable("getDataAtRowProp", _coords.row, "cmpt_id");
        console.log("The data is <%s>", JSON.stringify(__xlsID));
        $("#div-xls-conf").handsontable("refreshLoki", {"cmpt_id": __xlsID});
      }, 100);
    });
  };

  //- * After create new row
  //- ** Set ExcelID as the value max + 1
  //- ** Add the excel id into the menu list
  const __func_xlsList_CreateRowEvent =  () => {
    $("#div-xls-list").handsontable("addHook", "afterCreateRow", (_index, _amount, _source) => {
      clearTimeout(timer);
      const __filter = $("#div-xls-list").handsontable("getLokiFilter");
      console.log("The filter is <%s>", JSON.stringify(   Math.floor(_.min(__filter["cmpt_id"]["$in"])/100)*100 + 21 ));
      timer = setTimeout(() => {
        const __winData =  $("#div-xls-list").handsontable("fetchWindowData");
        const __nexID = _.max(_.map(__winData, _e => _e["cmpt_id"]))+1  ;
        $("#div-xls-list").handsontable("setDataAtRowProp", _index, "cmpt_id", (__nexID || (Math.floor(_.min(__filter["cmpt_id"]["$in"])/100)*100 + 21) ));
        $("#div-xls-list").handsontable("setDataAtRowProp", _index, "disabled_flag", false);
        const __lokiData = $("#div-xls-menu-list").handsontable("fetchLokiBy", {"cmpt_id_list" : {'$contains' : (__nexID -1)}})   ;
        console.log("The loki data is <%s>", JSON.stringify(__lokiData));
        __lokiData[0].cmpt_id_list.push(__nexID);
      }, 100);
    })
  };

  const __func_xlsList_SaveData = () => {
    $("#div-xls-list").handsontable("addHook", "afterSaveData", (_res) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("Came into the customeize hooks <%s>", JSON.stringify(_res));
        $("#div-xls-conf").handsontable("reloadAjax");
        $("#div-xls-list").handsontable("reloadAjax");
      }, 100);
    });
  };


  //- * Add new line into xls configuration
  //- ** Set the cmpt_id as the previous value
  //- ** After change on the attr id , set default name
  //- ** After change on the attr value, set default id
  const __func_xlsConf_CreateRowEvent =  () => {
    $("#div-xls-conf").handsontable("addHook", "afterCreateRow", (_index, _amount, _source) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        var __originalRow;
        if(_source === "ContextMenu.rowBelow"){
          __originalRow = _index - 1;
        }else if(_source === "ContextMenu.rowAbove")
          __originalRow = _index + 1;
        else{
          return;
        }
         $("#div-xls-conf").handsontable("setDataAtRowProp", _index, "cmpt_id", $("#div-xls-conf").handsontable("getDataAtRowProp", __originalRow, "cmpt_id") );
      }, 100);
    })
  };

  const __func_xlsConf_chgEvt = () => {
    $("#div-xls-conf").handsontable("addHook", "afterChange", (_changes, _source) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
       const __funcRow = (_row) => {
         if(_source === "edit"){
           if(_row[1] === "attr_id" && [null, ""].includes($("#div-xls-conf").handsontable("getDataAtRowProp", _row[0], "name" ) )){
             const __arrTarget = lokiData["xlsID2Name"].find({"attr_key" : _row[3]});
             if(__arrTarget.length > 0){
               $("#div-xls-conf").handsontable("setDataAtRowProp", _row[0], "name", __arrTarget[0]["attr_value"]);
             }
             
           }
           if(_row[1] === "name" && [null, ""].includes($("#div-xls-conf").handsontable("getDataAtRowProp", _row[0], "attr_id" ) )  ){
             const __arrTarget = lokiData["xlsID2Name"].find({"attr_value" : _row[3]});
             if(__arrTarget.length > 0){
               $("#div-xls-conf").handsontable("setDataAtRowProp", _row[0], "attr_id", __arrTarget[0]["attr_key"]);
             }
           }
         }

         if(_source === "CopyPaste.paste"){
         }
       };

        _(_changes).map(__funcRow).value();
      }, 100);
    })
  };

  //Calling functions
  return _.chain()
    .thru(__f_MenuList_ClkEvent)
    .thru(__f_XlsList_ClkEvent)
    .thru(__func_xlsList_CreateRowEvent)
    .thru(__func_xlsList_SaveData )

    // - xls conf event
    .thru(__func_xlsConf_CreateRowEvent)
    .thru(__func_xlsConf_chgEvt)
    ;
}

