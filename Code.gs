function doGet( e ) {
  Utilities.sleep( 1000 );
  
  return RunGET( e );
}


function doPost( e ) {
  if( typeof e === "undefined" ) {
    return;
  }
  
  Utilities.sleep( 1000 );
  
  return RunPOST( e );
}


////

/*function RunHammeringGuard( script_props ) {
  if( script_props === null ) {
    script_props = PropertiesService.getScriptProperties();
  }
  
  var now = Date.now();
  
  var prev = script_props.getProperty( "_PREV_REQ_TIME" );
  if( prev != null ) {
    prev = parseInt( prev, 10 );
    
    var delta = now - prev;
    if( delta < 2000 ) {
      Utilities.sleep( 2000 );
    }
  }
  
  script_props.setProperty( "_PREV_REQ_TIME", Date.now()+"" );
}*/
