function RunCron() {
   GarbageCollectServers();
}


function GarbageCollectServers() {
  ClearOldServers( ComputeServerRefreshTime() );
}
