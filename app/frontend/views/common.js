function gapiLogout (_apiKey, _clientId, _scope, _discoveryDocs){

  (gapi.auth2 === undefined)?gapi.load('client', initClient):redirectIndex();

  function initClient() {
    gapi.client.init({
      apiKey       : _apiKey,
      discoveryDocs: _discoveryDocs,
      clientId     : _clientId,
      scope        : _scope
      // The ux_mode/redirect_uri are used for the redirect feature
      //ux_mode: 'redirect',
      //redirect_uri: 'https://d5-docker-dba01.openstack.jp.sbibits.com:8088/test.html'
    }).then(redirectIndex);
  }

  function redirectIndex(){
    console.log(gapi.auth2.getAuthInstance().isSignedIn.get());
    if( gapi.auth2.getAuthInstance().isSignedIn.get()) {
      gapi.auth2.getAuthInstance().signOut();
      gapi.auth2.getAuthInstance().disconnect();
      document.cookie = "idtoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
      console.log("/" + window.location.href.split("/")[3] + "/index");
      window.location.replace("/" + window.location.href.split("/")[3] + "/index").reload();
    }else{
      gapi.auth2.getAuthInstance().signOut();
      gapi.auth2.getAuthInstance().disconnect();
      document.cookie = "idtoken=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
      window.location.replace("/" + window.location.href.split("/")[3] + "/index").reload();
    }
  }
}


