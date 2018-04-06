function RunPOST( e ) {
  var script_props = PropertiesService.getScriptProperties();
   
  var output_obj = { "ProofOfWorkNeeded": false };
  
  var req_json_raw = e.postData.contents;
  var req_json = JSON.parse( req_json_raw );
  
  var ctx = GetServerContext( script_props, req_json );
  
  if( "IsReply" in req_json ) {
    output_obj["Success"] = ProcessProofOfWorkReply( ctx, req_json );
  } else {
    var server_stats = ProcessServer( ctx, req_json );
    
    if( server_stats.Success && server_stats.IsNew ) {
      output_obj["Hash"] = BeginProofOfWork( ctx, req_json );
    }
    output_obj["ProofOfWorkNeeded"] = server_stats.Success && server_stats.IsNew;
    output_obj["Success"] = server_stats.Success;
  }
  
  return ContentService.createTextOutput( JSON.stringify(output_obj) );
}
