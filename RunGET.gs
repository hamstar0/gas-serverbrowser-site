function RunGET() {
  var output = "";
  var script_props = PropertiesService.getScriptProperties();
   
  var cache_timeout = ComputeCacheExpireTime();
  var cache = CacheService.getScriptCache();
  
  var output_chunks = cache.get( "server_list_chunks" );
  if( output_chunks != null ) {
     for( var i=0; i<output_chunks; i++ ) {
       output += cache.get( "server_list_"+i );
     }
  } else {
    output = GetServerListOutput( script_props );
    output_chunks = Math.ceil( output.length / 100000 );
    
    cache.put( "server_list_chunks", output_chunks, cache_timeout );
    
    for( var i=0; i<output_chunks-1; i++ ) {
      var chunk = output.substring( i*100000, (i+1)*100000 );
      cache.put( "server_list_"+i, chunk, cache_timeout );
    }
    
    if( output_chunks > 0 ) {
      var chunk = output.substring( i*100000, output.length );
      cache.put( "server_list_"+(output_chunks-1), chunk, cache_timeout );
    }
    
    console.log( "Cache refreshed." );
  }
  
//ContentService.MimeType = "JSON" in MimeType ? MimeType.JSON : MimeType.JAVASCRIPT;
  return ContentService.createTextOutput( output );
}


////

function GetServerListOutput( script_props ) {
  var output_str = "{";
  
  var first = true;
  var keys = script_props.getKeys();
  
  for( var i=0; i < keys.length; i++ ) {
    var my_key = keys[i];
    if( my_key[0] != '!' ) { continue; }
    
    var server_id = script_props.getProperty( my_key );
    var server_valid_id = GetServerValidationId( server_id );
    var valid_state = script_props.getProperty( server_valid_id );
    
    if( valid_state === "true" ) {
      var raw_data = script_props.getProperty( server_id );
      
      if( first ) {
        first = false;
      } else {
        output_str += ", ";
      }
      output_str += '"'+server_id+'"'+": "+raw_data;
    }
  }
  
  output_str += "}";
  
  return output_str;
}

