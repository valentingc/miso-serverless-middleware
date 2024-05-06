export interface MdnsOverlayNodeDiscoveryInstance {
  timestampRegistered: number;
  timestampLastSeen: number;
  timerTimeout?: NodeJS.Timer;
  timerHeartbeat?: NodeJS.Timer;
  initCompleted: boolean;
}
