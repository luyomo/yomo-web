
function afterMainLoad(){
  $("#div-ajax-list").handsontable("refreshLoki", {"id": 0});

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
        console.log("The coords is <%s>", JSON.stringify(_coords));
        const __pageName = $("#div-xls-menu-list").handsontable("getDataAtRowProp", _coords.row, "href");
        const __ajaxName = __pageName.replace(/main.html/i, 'yomo-ajax-master.ajax');
        console.log("The na,e is <%s>", __ajaxName);

        $("#div-ajax-list").handsontable("refreshLoki", { 'page_name' : __ajaxName });
      }, 100);
    });
  };

  //- * Add new line into xls configuration
  //- ** Set the cmpt_id as the previous value
  //- ** After change on the attr id , set default name
  //- ** After change on the attr value, set default id
  const __func_xlsConf_CreateRowEvent =  () => {
    $("#div-ajax-list").handsontable("addHook", "afterCreateRow", (_index, _amount, _source) => {
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
        $("#div-ajax-list").handsontable("setDataAtRowProp", _index, "cmpt_id", $("#div-xls-conf").handsontable("getDataAtRowProp", __originalRow, "cmpt_id") );
      }, 100);
    })
  };

  //Calling functions
  return _.chain()
          .thru(__f_MenuList_ClkEvent)
          .thru(__func_xlsConf_CreateRowEvent)
    ;
}

