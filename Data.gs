function GetServerMachineId( server_data ) {
  return server_data["ServerIP"]+":"+server_data["Port"];
}

function GetServerId( machine_id, server_data ) {
  return machine_id+"|"+server_data["WorldName"];
}

function GetServerUpdateId( server_id ) {
  return "updated_"+server_id;
}

function GetServerValidationId( server_id ) {
  return "valid_"+server_id;
}

function GetServerWorkId( server_id ) {
  return "work_"+server_id;
}


////

function ComputeCacheExpireMilliseconds() {
  return 60 * 1000;  // 1 minute
}

function ComputeServerRefreshSeconds() {
  return 60 * 15;  // 15 minutes
}

function ComputeNowSec() {
  return Math.floor( (new Date().getTime()) / 1000 );
}

/*function ComputeServerPing( avg_ping, client_ping ) {
  if( avg_ping == -1 ) {
    return client_data["Ping"];
  }
  return ((avg_ping * 2) + client_ping) / 3;
}*/

function ComputeVersionAsNumber( major, minor, build, revision ) {
  return ( major * 1000000 ) + ( minor * 10000 ) + ( build * 100 ) + revision;
}


////

function ClearOldServers( timeout_duration ) {
  var script_props = PropertiesService.getScriptProperties();
  var keys = script_props.getKeys();
  
  var now_sec = ComputeNowSec();
  var expired_count = 0;
  var unexpired = [];
  
  for( var i=0; i<keys.length; i++ ) {
    var my_key = keys[i];
    if( my_key[0] != '!' ) { continue; }
    
    var machine_id = my_key.substring( 1 );
    var server_id = script_props.getProperty( my_key );
    var server_update_id = GetServerUpdateId( server_id );
    var server_valid_id = GetServerValidationId( server_id );
    var server_work_id = GetServerWorkId( server_id );
    
    var last_update_raw = script_props.getProperty( server_update_id );
    var last_update_sec = parseInt( last_update_raw, 10 );
    
    if( (now_sec - last_update_sec) > timeout_duration ) {
      expired_count++;
      
      if( script_props.getProperty(server_valid_id) === "false" ) {
        script_props.deleteProperty( server_work_id );
      }
      script_props.deleteProperty( '!'+machine_id );
      script_props.deleteProperty( server_id );
      script_props.deleteProperty( server_update_id );
      script_props.deleteProperty( server_valid_id );
      
      console.log( "- Server expired: "+server_id+" ("+(now_sec - last_update_sec)+")" );
    } else {
      unexpired.push( server_id+"="+(now_sec - last_update_sec) );
    }
  }
  console.log( "Servers Unexpired: "+unexpired.length );
}

