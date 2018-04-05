function ValidateServerData( json ) {
  if( !("ServerIP" in json) ) {
    console.warn( "Invalid TML server data: No ServerIP" );
    return false;
  }
  if( !("Port" in json) ) {
    console.warn( "Invalid TML server data: No Port - "+JSON.stringify(json) );
    return false;
  }
  //if( !("IsPassworded" in json) ) {
  //  console.warn( "Invalid TML server data: No IsPassworded - "+JSON.stringify(json) );
  //  return false;
  //}
  if( !("Motd" in json) ) {
    console.warn( "Invalid TML server data: No Motd - "+JSON.stringify(json) );
    return false;
  }
  if( !("WorldName" in json) ) {
    console.warn( "Invalid TML server data: No WorldName - "+JSON.stringify(json) );
    return false;
  }
  if( !("WorldProgress" in json) ) {
    console.warn( "Invalid TML server data: No WorldProgress - "+JSON.stringify(json) );
    return false;
  }
  if( !("WorldEvent" in json) ) {
    console.warn( "Invalid TML server data: No WorldEvent - "+JSON.stringify(json) );
    return false;
  }
  if( !("MaxPlayerCount" in json) ) {
    console.warn( "Invalid TML server data: No MaxPlayerCount - "+JSON.stringify(json) );
    return false;
  }
  if( !("PlayerCount" in json) ) {
    console.warn( "Invalid TML server data: No PlayerCount - "+JSON.stringify(json) );
    return false;
  }
  if( !("PlayerPvpCount" in json) ) {
    console.warn( "Invalid TML server data: No PlayerPvpCount - "+JSON.stringify(json) );
    return false;
  }
  if( !("TeamsCount" in json) ) {
    console.warn( "Invalid TML server data: No TeamsCount - "+JSON.stringify(json) );
    return false;
  }
  if( !("AveragePing" in json) ) {
    console.warn( "Invalid TML server data: No AveragePing - "+JSON.stringify(json) );
    return false;
  }
  if( !("Mods" in json) ) {
    console.warn( "Invalid TML server data: No Mods - "+JSON.stringify(json) );
    return false;
  }
  if( !("Version" in json) ) {
    console.warn( "Invalid TML server data: No Version - "+JSON.stringify(json) );
    return false;
  }
  
  var curr_version = ComputeVersionAsNumber(1, 4, 2, 7);
  if( json.Version < curr_version ) {
    console.warn( "Invalid TML server data: Version "+json.Version+" < "+curr_version+" - "+JSON.stringify(json) );
    return false;
  }
  
  for( var key in json ) {
    switch( key ) {
      case "ServerIP":
      case "Port":
      case "IsPassworded":
      case "Motd":
      case "WorldName":
      case "WorldProgress":
      case "WorldEvent":
      case "MaxPlayerCount":
      case "PlayerCount":
      case "PlayerPvpCount":
      case "TeamsCount":
      case "AveragePing":
      case "Mods":
      case "Version":
        break;
      default:
        console.warn("Invalid TML server data: Unrecognized field "+key);
        return false;
    }
  }
  
  if( json["ServerIP"] == "127.0.0.1" || json["ServerIP"].substring(0, 7) == "192.168" ) {
    console.warn( "Invalid TML server data: Local IP server invalid - "+JSON.stringify(json) );
    return false;
  }
  
  return true;
}


////

function ProcessServer( ctx, server_data ) {
  if( !ValidateServerData( server_data ) ) {
    return {"Success":false, "IsNew":false};
  }
  
  var old_server_id = ctx.Props.getProperty( '!'+ctx.MachineId );
  
  if( old_server_id !== null ) {
    if( ctx.Props.getProperty( ctx.ServerId ) === null ) {
      console.log( "New server ("+ctx.ServerId+") found for IP "+ctx.MachineId+"; old one ("+old_server_id+") must expire first." );
      
      return {"Success":false, "IsNew":false};
    }
  }
  
  var is_new = RegisterServer( ctx, server_data );
  
  return {"Success":true, "IsNew":is_new};
}

////

function RegisterServer( ctx, server_data ) {
  var is_new_server = false;
  var valid_state = ctx.Props.getProperty( ctx.ValidId );
  
  // Existing server
  if( valid_state === "true" ) {
    var server_data_str = JSON.stringify( server_data );
    
    console.log( "Updating server "+ctx.ServerId+" - "+server_data_str );
  }
  // Still being validated
  else if( valid_state === "false" ) {
    return false;
  }
  // New server
  else {
    is_new_server = true;
    server_data["Created"] = ctx.Now;
    
    var server_data_str = JSON.stringify( server_data );
    
    ctx.Props.setProperty( '!'+ctx.MachineId, ctx.ServerId );
    ctx.Props.setProperty( ctx.ServerId, server_data_str );
    ctx.Props.setProperty( ctx.ValidId, "false" );
    
    console.log( "Adding server "+ctx.ServerId+" - "+server_data_str );
  }
  
  ctx.Props.setProperty( ctx.UpdateId, ctx.Now+"" );
  
  return is_new_server;
}
