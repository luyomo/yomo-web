
function afterMainLoad(){

  $("#div-gapi-driver").handsontable("setDataAtCell", 0, 0, apiKey);
  $("#div-gapi-driver").handsontable("setDataAtCell", 0, 1, clientId);
  $("#div-gapi-driver-data").handsontable("setDataAtCell", 0, 0, "/RT/99991/test.txt");
  $("#div-gapi-driver-data").handsontable("setDataAtCell", 0, 1, userInfo.email);
  $("#div-gapi-driver-data").handsontable("setDataAtCell", 0, 2, "This is the password");
  $("#div-gapi-driver-data").handsontable("setDataAtCell", 0, 3, "5");

  const __apiKey = $("#div-gapi-driver").handsontable("getDataAtRowProp", 0, "api_key");
  const __clientSecret = $("#div-gapi-driver").handsontable("getDataAtRowProp", 0, "client_secret");
  console.log("The api key is <%s> and client secret is <%s>", __apiKey, __clientSecret);
  //folder/shareTo/content

  const __setting = $("#div-gapi-driver-data").handsontable("getSettings");
  __setting.saveData = () => {
    makeGAPIInstance(__apiKey, __clientSecret);

    setTimeout( (async () => {
      const __absFile = $("#div-gapi-driver-data").handsontable("getDataAtRowProp", 0, "folder");
      const __shareTo = $("#div-gapi-driver-data").handsontable("getDataAtRowProp", 0, "shareTo");
      const __content = $("#div-gapi-driver-data").handsontable("getDataAtRowProp", 0, "content");
      const __expiration = $("#div-gapi-driver-data").handsontable("getDataAtRowProp", 0, "expiration");
      console.log("The folder to create is <%s> and type <%s>", __absFile, typeof(__absFile));
      console.log("The notification target is <%s>", __shareTo);
      console.log("The content to share <%s>", __content);
      console.log("The expiration  <%s>", __expiration);

      const __elapseTime = __expiration * 1000 * 60;
      console.log("The time to expire is <%s>", __elapseTime);

      // Make one file
      var __ret = await makeFile2GAPIDriver(__absFile);
      console.log("Result of making one file <%s>", JSON.stringify(__ret));

      // Write message to file
      __ret = await writeToFile(__absFile, __content);
      console.log("Result of writing files <%s>", JSON.stringify(__ret));

      // Grant the file to one user
      __ret = await grantFileToUser(__absFile, "user", "reader", __shareTo);
      console.log("Result of granting permission <%s>", JSON.stringify(__ret));
    
      // List the permission of the file
      __ret = await listFilePermission(__absFile);
      console.log("Result of listing permissions <%s>", JSON.stringify(__ret));

      setTimeout(() => { rm(__absFile) }, __elapseTime);
    }), 3000);
  };
  
  return _.chain() ;
}
