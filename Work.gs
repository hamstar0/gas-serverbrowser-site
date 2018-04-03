function ValidateWorkReplyData( json ) {
  if( !("IsReply" in json) ) {
    console.warn( "Invalid proof-of-work reply: No IsReply - "+JSON.stringify(json) );
    return false;
  }
  if( !("ServerIP" in json) ) {
    console.warn( "Invalid proof-of-work reply: No ServerIP - "+JSON.stringify(json) );
    return false;
  }
  if( !("Port" in json) ) {
    console.warn( "Invalid proof-of-work reply: No Port - "+JSON.stringify(json) );
    return false;
  }
  if( !("WorldName" in json) ) {
    console.warn( "Invalid proof-of-work reply data: No WorldName - "+JSON.stringify(json) );
    return false;
  }
  if( !("HashBase" in json) ) {
    console.warn( "Invalid proof-of-work reply: No hash" );
    return false;
  }
  
  return true;
}


////

function BeginProofOfWork( ctx, server_data ) {
  var rand_num = Math.floor( Math.random() * 1000000 );
  var hash_base = rand_num.toString();
  var raw_hash = Utilities.computeDigest( Utilities.DigestAlgorithm.SHA_256, hash_base, Utilities.Charset.US_ASCII );
  var hash = Utilities.base64Encode( raw_hash );
  
  ctx.Props.setProperty( ctx.WorkId, hash_base );
  
  return hash;
}


function ProcessProofOfWorkReply( ctx, reply_data ) {
  if( !ValidateWorkReplyData( reply_data ) ) {
    return false;
  }
  
  var reply_hash_base = reply_data["HashBase"];
  var real_hash_base = ctx.Props.getProperty( ctx.WorkId );
  var is_valid = real_hash_base !== null && reply_hash_base === real_hash_base;
  
  ctx.Props.deleteProperty( ctx.WorkId );
  
  if( is_valid ) {
    ctx.Props.setProperty( ctx.ValidId, "true" );
    
    console.log( "Proof of work for \""+ctx.ServerId+"\" is valid!" );
  } else {
    console.log( "Proof of work for \""+ctx.ServerId+"\" invalid." );
  }
  
  return is_valid;
}

