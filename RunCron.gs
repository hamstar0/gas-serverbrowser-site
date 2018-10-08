function RunCron() {
  Utilities.sleep( 1000 );
  
  ClearOldServers( ComputeServerRefreshSeconds() );
}

