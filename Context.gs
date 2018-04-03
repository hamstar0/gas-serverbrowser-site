function GetServerContext( props, server_data ) {
  var machine_id = GetServerMachineId( server_data );
  var server_id = GetServerId( machine_id, server_data );
  
  var context = {
    "Props": props,
    "Now": ComputeNowSec(),
    "MachineId": machine_id,
    "ServerId": server_id,
    "ValidId": GetServerValidationId( server_id ),
    "UpdateId": GetServerUpdateId( server_id ),
    "WorkId": GetServerWorkId( server_id )
  };
  
  return context;
}
