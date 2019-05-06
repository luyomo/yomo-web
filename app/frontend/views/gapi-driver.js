//Depend:
//- https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js
//- https://apis.google.com/js/api.js

//reference
//- https://developers.google.com/drive/api/v3/reference/permissions/list
//- https://modernways.be/myap/it/page/programming/html%20-%20javascript%20-%20css/google-developers/De%20Google%20Drive%20API%20-%20folders.html
//- https://developers.google.com/drive/api/v3/quickstart/js#step_1_turn_on_the

function makeGAPIInstance(_apiKey, _clientId){
  gapi.load('client:auth2', () => {
    gapi.client.init({
        'apiKey'       : _apiKey,
        'discoveryDocs': ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"],
        'clientId'     : _clientId,
        'scope'        : 'https://www.googleapis.com/auth/drive'
    });
  });
}

/*
 * const _fileID = searchAbsFile("level01/level02/level03/test.txt");
 */
async function searchAbsFile(_fileName){
  const __folders = _fileName.split('/');
  __folders.shift();
  var __parent = "root";
  for(var __folder of __folders){ __parent = await searchFolder(__folder, __parent); }
  return __parent;
}

/*
 * const __fileID = searchFolder("FileToSearch")   => const __fileID = searchFolder("FileToSearch", "root")
 * const __fileID = searchFolder("FileToSearch", "parent-file-id")
 */
async function searchFolder(_folder, _parent='root'){
  const __ret = await gapi.client.drive.files.list({q: "name='" + _folder + "' and '" + _parent + "' in parents and trashed = false", fields: "files(id, name)"});
  if(__ret.result.files.length > 1) console.warn("More than one files are found. <%s>", JSON.stringify(__ret.result.files));
  return (__ret.result.files.length === 0)?undefined:__ret.result.files[0].id;
}

/*
 * const __retFileID = makeIfNotExist("folderName"); => const __retFileID = makeIfNotExist("folderName", "root");
 * const __retFileID = makeIfNotExist("folderName", "1xu-4chEmZJfuroOtSBjoNcmoTExS2dI6");
 */
async function makeIfNotExist(_file, _type,  _parent='root'){
  const __fileID = await searchFolder(_file, _parent);
  if(__fileID === undefined){
    const __reqData = new Object();
    __reqData.name = _file;
    __reqData.parents = [_parent];
    //Type: document, file, folder, spreadsheet
    __reqData.mimeType = "application/vnd.google-apps." + _type;

    const __ret = await gapi.client.request({'path': '/drive/v3/files', 'method': 'POST', 'body': JSON.stringify(__reqData)});
    return __ret.result.id;
  }else{
    return __fileID;
  }
}

/*
 * const __fileID = makeFile2GAPIDiver("/level01/level02/level03/test.txt");
 */
async function makeFile2GAPIDriver(_absFile){
  const __folders = _absFile.split('/');
  __folders.shift();
  const __theFile = __folders.pop();
  var __parent = "root";
  for(var __folder of __folders){ __parent = await makeIfNotExist(__folder, "folder", __parent); }
  return await makeIfNotExist(__theFile, "document", __parent);
}

/*
 * const __fileID = makeFolder2GAPIDiver("/level01/level02/level03");
 */
async function makeFolder2GAPIDiver(_folder){
  const __folders = _folder.split('/');
  __folders.shift();
  var __parent = "root";
  for(var __folder of __folders){ __parent = await makeIfNotExist(__folder, "folder", __parent); }
  return __parent;
}

/*
 * writeToFile("/level01/level02/level03/test.txt", "This is the test message to file");
 */
async function writeToFile(_absFile, _content){
  const __fileID = await searchAbsFile(_absFile);

  const __ret = await gapi.client.request({
      'path': '/upload/drive/v3/files/' + __fileID 
    , 'method': 'PATCH'
    , 'params': {fileId: __fileID , 'uploadType': 'media'},
      'body': _content});
}

/*
 * grantFileToUser("/level01/level02/level03/test.txt", "user", "reader", "test@gmail.com")
 */
async function grantFileToUser(_absFile, _type, _role, _emailAddress){
  const __fileID = await searchAbsFile(_absFile);
  const __ret = await gapi.client.request({
      'path': '/drive/v3/files/' + __fileID + "/permissions"
    , 'method': 'POST'
    , 'body' : JSON.stringify({type:_type , role: _role, emailAddress: _emailAddress})});
}

async function listFilePermission(_absFile){
  const __fileID = await searchAbsFile(_absFile);
  const __ret = await gapi.client.request({
      'path': '/drive/v3/files/' + __fileID + "/permissions"
    , 'method': 'GET' });
  return __ret.result.permissions;
}

/*
 * revokeFilePermission("/level01/level02/level03/test.txt", "reader"|"writer")
 */
async function revokeFilePermission(_absFile, _role){
  const __fileID = await searchAbsFile(_absFile);
  const __ret = await gapi.client.request({
      'path': '/drive/v3/files/' + __fileID + "/permissions"
    , 'method': 'GET' });
  for(var _permission of __ret.result.permissions){
    if(_permission.role === _role){
      const __retDtl = await gapi.client.request({
        'path': '/drive/v3/files/' + __fileID + "/permissions/" + _permission.id 
      , 'method': 'DELETE' });
    }
  }
}

/*
 * rm("/level01/level02/level03/test.txt");
 */
async function rm(_absFile){
  const __fileID = await searchAbsFile(_absFile);
  const __ret = await gapi.client.request({'path': '/drive/v3/files/'+__fileID, 'method': 'DELETE'});
  return __ret.result.id;
}

function revokeAccess() {
  gapi.auth2.getAuthInstance().disconnect();
}

