//base64 -d /tmp/encryptedTest.txt | openssl rsautl -decrypt -inkey ./id_rsa.sbisec
//openssl enc -d -base64 -in /tmp/encryptedTest.txt | openssl rsautl -decrypt -inkey ./id_rsa.sbisec
//https://www.czeskis.com/random/openssl-encrypt-file.html

// Not used here. But could use the below command to get one user's public key
/*
  $.ajax({ url: '/ssh-pub-key/' + _userName,
    method: "GET",
    async: false,
    success: function(_data){
      console.log("Success + <%s>",_data);
      //const encrypted = cryptoPublic.publicEncrypt(_data, _content);
      console.log("The key is <%s>", __$pubKey);
      const encrypted = cryptoPublic.publicEncrypt(__$pubKey, _content);
      $("#div-en_data").handsontable("setDataAtRowProp", 0, "encrypted_data", encrypted);
      $("#div-de_data").handsontable("setDataAtRowProp", 0, "encrypted_data", encrypted);
    },
    error: function(_data){
      console.log("Error+ <%s>", JSON.stringify(_data));
    }
  });
 */

function encryptData (_content) {
  const encrypted = cryptoPublic.publicEncrypt(__$pubKey, _content);

  console.log("The encrypted data is <%s>", encrypted);
  $("#div-en_data").handsontable("setDataAtRowProp", 0, "encrypted_data", encrypted);
  $("#div-de_data").handsontable("setDataAtRowProp", 0, "encrypted_data", encrypted);
}

function onEncrypt(){
  const __userName = $("#div-en_data").handsontable("getDataAtRowProp", 0, "user_name");
  const __content = $("#div-en_data").handsontable("getDataAtRowProp", 0, "content");

  console.log("The user name is <%s> and contents is <%s>", __userName, __content);

  encryptData(__content);
}

function onDecrypt(){
  console.log("Come to the onDecrypt function");
  const __decryptedData = $("#div-de_data").handsontable("getDataAtRowProp", 0, "encrypted_data");
  const __passphrase    = $("#div-de_data").handsontable("getDataAtRowProp", 0, "passphrase");
  console.log("The private key is <%s>", __$priKey );
  const __decrypted = cryptoPublic.privateDecrypt({key: __$priKey  , passphrase: "passphrase"}, __decryptedData);
  console.log("The is the decrypted data ", __decrypted);
  $("#div-de_data").handsontable("setDataAtRowProp", 0, "decrypted_data", __decrypted);
}

function onImpPubKeyClick(){
  console.log("To import the public key from the local machine");
  var file    = document.querySelector('input[id=btn-pubKey]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    __$pubKey = reader.result.replace(/\n$/, "");
    console.log("The result is <%s>", __$pubKey);
  }, false);

  if (file) {
    reader.readAsText(file);
  }
}

function onImpPriKeyClick(){
  console.log("To import the prrivate key from the local machine");
  var file    = document.querySelector('input[id=btn-priKey]').files[0];
  var reader  = new FileReader();

  reader.addEventListener("load", function () {
    __$priKey = reader.result.replace(/\n$/, "");
    console.log("The result is <%s>", __$priKey);
  }, false);

  if (file) {
    reader.readAsText(file);
  }
}

const __$pubKey = "-----BEGIN PUBLIC KEY-----\n\
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA232NgwcNTjlZf1DXHh2I\n\
Ly8hF2bld2uCT4CUTioY8pGejntf+84d/Votev8XLsn6p79dJnjG9UQGXLgw32CK\n\
+hQ5+RXbHiOASnxF75bo6+LnPpxHymWCiKNCZbHpTwMuTJy1AGbtTy1OQ7GMwwyt\n\
jZA/NnpKgN0wxc6+2StPnI6wwuC5Q78iTWfLiiLk0iYoh+iXj7Sb8nE5ODj1O+K4\n\
OT5FyLFMMn8LTPnIeaUirPQ3md1mTUEvEF56527rH9LhAXthNixCWma+DDqacY6u\n\
2Hbkqtt4uxIlGO6jWJt3LAaaYVKGjiGXNm4dgp82rxUf5YGmlE4VXha98mh0+k7T\n\
MGgKHZmTY/++KX9uMHi0/c3ti27kWUFlVdjCyJS9ngXK+GD1ewHsrb6zvB6Mo5sL\n\
S94ZxzyRSyboW7+kyXR1bsJGXL72+PHElNgdawLEXrpnNpdC+yHPey9M5LSxzPzC\n\
cFVpElDcbO1q3vRJOFJfjmIf6xmP8/tWfN7LDnx7v0xj0GtTm+BRDjBrQcsPAWRU\n\
MjWfKd8Du/v8XbRRfmbprHcyJ83MFbzIjNSCRCkL/4siaugLpk/q6QEdUygGAQCA\n\
bwbTt5PVlNj4v3JEhm9rPIpqlzFbn9rFK/H5MOxov9j7zdtom9TIymbFYs4neNh0\n\
aVuJJV9dHgAoTYMztggUcMkCAwEAAQ==\n\
-----END PUBLIC KEY-----";

const __$priKey = "-----BEGIN RSA PRIVATE KEY-----\n\
Proc-Type: 4,ENCRYPTED\n\
DEK-Info: AES-128-CBC,3A59C2E502F456CA0D7EEDDAE60EFA68\n\
\n\
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\n\
-----END RSA PRIVATE KEY-----";
