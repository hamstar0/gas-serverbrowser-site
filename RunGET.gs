function RunGET() {
  var now = Date.now();
  var cache_timeout = ComputeCacheExpireMilliseconds();
  var cache = CacheService.getScriptCache();
  
  var output = GetCachedOutput( cache, cache_timeout, now );
  
  if( output === null ) {
    var script_props = PropertiesService.getScriptProperties();
    
    output = GetOutput( cache, script_props, cache_timeout, now );
  }
  
//ContentService.MimeType = "JSON" in MimeType ? MimeType.JSON : MimeType.JAVASCRIPT;
  return ContentService.createTextOutput( output );
}



function GetCachedOutput( cache, cache_timeout, now ) {
  var output = "";
   
  var get_anew = false;
  
  var output_chunks = cache.get( "server_list_chunks" );
  if( output_chunks != null ) {
    var last_cache_time_raw = cache.get( "last_cache_time" );
    var last_cache_time = parseInt( last_cache_time_raw, 10 );
    
    if( last_cache_time == null || (last_cache_time+cache_timeout) < now ) {
      get_anew = true;
    }
  } else {
    get_anew = true;
  }
  
  if( !get_anew ) {
    for( var i=0; i<output_chunks; i++ ) {
      output += cache.get( "server_list_"+i );
    }
    
    return output;
  }
  
  return null;
}


function GetOutput( cache, script_props, cache_timeout, now ) {
  var output = GetServerListOutput( script_props );
  var output_chunks = Math.ceil( output.length / 100000 );
  
  cache.put( "last_cache_time", now );
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
  
  return output;
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

