
function afterMainLoad(){

  var timer = null;
  const __func_menuList_SaveData = () => {
    $("#div-xls-menu-list").handsontable("addHook", "afterSaveData", (_res) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log("Come here or not <%s>", JSON.stringify(_res));
        $("#div-xls-menu-list").handsontable("reloadAjax");
      }, 100);
    });
  };

  //Calling functions
  return _.chain()
    .thru(__func_menuList_SaveData )
    ;
}

