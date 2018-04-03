/*function ValidateClientData( json ) {
  if( !("SteamID" in json) ) {
    console.warn( "Invalid client data: No client SteamID - "+JSON.stringify(json) );
    return false;
  }
  if( !("ClientIP" in json) ) {
    console.warn( "Invalid client data: No ClientIP - "+JSON.stringify(json) );
    return false;
  }
  if( !("ServerIP" in json) ) {
    console.warn( "Invalid client data: No ServerIP - "+JSON.stringify(json) );
    return false;
  }
  if( !("Port" in json) ) {
    console.warn( "Invalid client data: No Port - "+JSON.stringify(json) );
    return false;
  }
  if( !("WorldName" in json) ) {
    console.warn( "Invalid client data: No WorldName - "+JSON.stringify(json) );
    return false;
  }
  if( !("Ping" in json) ) {
    console.warn( "Invalid client data: No Ping - "+JSON.stringify(json) );
    return false;
  }
  if( !("IsPassworded" in json) ) {
    console.warn( "Invalid client data: No IsPassworded - "+JSON.stringify(json) );
    return false;
  }
  if( !("HelpersVersion" in json) ) {
    console.warn( "Invalid client data: No HelpersVersion - "+JSON.stringify(json) );
    return false;
  }
  
  if( json["ServerIP"] == "127.0.0.1" || json["ServerIP"].substring(0, 7) == "192.168" ) {
    console.warn( "Invalid client data: Local IP server invalid - "+JSON.stringify(json) );
    return;
  }
  //if( json["ClientIP"] == "127.0.0.1" || json["ClientIP"].substring(0, 7) == "192.168" ) {
  //  console.warn( "Invalid client data: Local IP client invalid - "+JSON.stringify(json) );
  //  return;
  //}
  
  return true;
}



function ValidateServerWithClient( client_steam_id ) {
  var url = "http://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=B7EBA5B5AFB01BFCDC02A01E15C87C95&steamids="+client_steam_id;
  var resp = UrlFetchApp.fetch( url );
  var resp_str, resp_json;
  
  var resp_code = parseInt( resp.getResponseCode(), 10 );
  if( resp_code < 200 || resp_code >= 300 ) {
    console.warn( "  Could not validate steam ID "+client_steam_id );
    return false;
  }
  
  // Validate client's steam status (must be playing Terraria)
  try {
    resp_str = resp.getContentText();
    resp_json = JSON.parse( resp_str );
    if( !resp_json ) {
      console.warn( "  Invalid steam response JSON for steam ID "+client_steam_id+": "+resp_json );
      return false;
    }
  } catch( e ) {
      console.warn( "  Invalid steam response JSON for steam ID "+client_steam_id );
      return false;
  }
  
  if( "gameextrainfo" in resp_json ) {//gameid
    return resp_json["gameextrainfo"].toLowerCase() == "terraria";
  } else {
    console.log( "  Steam user cannot be used to validate server" );
  }
  
  return false;
}


////

function ProcessClient( client_data ) {
  if( !ValidateClientData( client_data ) ) {
    return;
  }
  
  var machine_id = GetServerMachineId( client_data );
  var server_id = GetServerId( machine_id, client_data );
  var server_update_id = GetServerUpdateId( server_id );
  var server_valid_id = GetServerValidationId( server_id );
  
  var script_props = PropertiesService.getScriptProperties();
  
  var server_data_raw = script_props.getProperty( server_id );
  if( server_data_raw === null ) {
    console.warn( "Invalid client data: Server non-existent for "+server_id+" - "+JSON.stringify(client_data) );
    return;
  }
  
  var server_data = JSON.parse( server_data_raw );
  
  var is_server_valid = script_props.getProperty( server_valid_id ) === "true";
  var is_client_valid = ValidateServerWithClient( client_data["SteamID"] );
  
  if( !is_server_valid && is_client_valid ) {
    is_server_valid = true;
  }
  
  if( is_server_valid ) {
    if( is_client_valid ) {
      server_data["AveragePing"] = ComputeServerPing( server_data["AveragePing"], client_data["Ping"] );
    }
    
    script_props.setProperty( server_id, JSON.stringify(server_data) );
    script_props.setProperty( server_update_id, ComputeNowSec() );
    script_props.setProperty( server_valid_id, "true" );
    
    console.log( "Client data processed - "+JSON.stringify(client_data) );
  } else {
    script_props.setProperty( server_valid_id, "false" );
    
    console.log( "Client data rejected - Invalid server - "+JSON.stringify(client_data) );
  }
}*/

