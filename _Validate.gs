function DebugValidate() {
  var output = ValidateServerActive( {"WorldName":"blah", "ServerIP":"174.216.19.195", "Port":7777} );
  Logger.log( "DebugValidate: "+output );
}




function ValidateServerActive( server_data ) {
  /*var data = {
    "WorldName": server_data["WorldName"],
    "ServerIP": server_data["ServerIP"],
    "Port": server_data["Port"]
  };
  var options = {
    "method" : "post",
    "contentType": "application/json",
    "payload": JSON.stringify( data )
  };
  
  var resp, resp_str;
  
  try {
    var resp = UrlFetchApp.fetch( "http://hamstar.pw/hamstarhelpers/validate_server/", options );
  } catch( err ) {
    console.warn( "ValidateServerActive connection failed - "+err );
    return false;
  }
  
  try {
    var resp_str = resp.getContentText();
    var resp_json = JSON.parse( resp_str );
    
    if( "Success" in resp_json && resp_json["Success"] ) {
      return true;
    }
    
    if( "Msg" in resp_json ) {
      console.log( "ValidateServerActive connection unsuccessful - "+resp_json.Msg );
    }
  } catch( err ) {
    console.warn( "ValidateServerActive failed - "+err );
    return false;
  }*/
  
  return true;
}
