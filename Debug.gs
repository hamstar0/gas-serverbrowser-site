function DebugOutput() {
  var content = doGet();
  var raw_data = content.getContent();
  
  Logger.log( "Output: "+raw_data );
}


function DebugClearDeadServers() {
  ClearOldServers( ComputeServerRefreshTime() );
}


function DebugClearAllServers() {
  var cache = CacheService.getScriptCache();
  var script_props = PropertiesService.getScriptProperties();
  
  script_props.deleteAllProperties();
  
  var output_chunks = cache.get( "server_list_chunks" );
  if( output_chunks != null ) {
    for( var i=0; i<output_chunks; i++ ) {
      cache.remove( "server_list_"+i );
    }
  }
  
  cache.remove( "server_list_chunks" );
}


function DebugAddTestServerData() {
  var server_data = {
    "IsClient":false,
    "ServerIP":"123.45.6.78",
    "Port":7777,
    "Motd":"Hi diddly ho, neighborrr",
    "WorldName":"Test World OMG",
    "WorldProgress":"Begun boss killing",
    "WorldEvent":"Goblin invasion",
    "MaxPlayerCount":15,
    "PlayerCount":5,
    "PlayerPvpCount":2,
    "TeamsCount":2,
    "Mods":{"Hamstar's Helpers":"1.4.0","Stamina":"2.0.0"}
  };
  var client_data = {
    "IsClient":true,
    "SteamID":"5432154321",
    "ClientIP":"124.45.6.78",
    "ServerIP":"123.45.6.78",
    "Port":7777,
    "WorldName":"Test World OMG",
    "Ping":10,
    "IsPassworded":true,
    "HelpersVersion":"1.0.0"
  };
  
  doPost( {"postData":{"contents":JSON.stringify(server_data)}} );
  doPost( {"postData":{"contents":JSON.stringify(client_data)}} );
  
  var machine_id = GetServerMachineId( client_data );
  var server_id = GetServerId( machine_id, client_data );
  var server_update_id = GetServerUpdateId( server_id );
  var server_valid_id = GetServerValidationId( server_id );
  
  var script_props = PropertiesService.getScriptProperties();
  
  var server_data_raw = script_props.getProperty( server_id );
  var server_data = JSON.parse( server_data_raw );
  
  server_data["AveragePing"] = 14;
  
  script_props.setProperty( "!"+machine_id, server_id );
  script_props.setProperty( server_id, JSON.stringify(server_data) );
  script_props.setProperty( server_update_id, Date.now() );
  script_props.setProperty( server_valid_id, "true" );
}
