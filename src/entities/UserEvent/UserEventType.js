class UserEventType {
  static SelectCourseEvent = 'selectcourse';
  static SelectVideoEvent = 'selectvideo';

  // video events
  static VTimeUpdateEvent = 'timeupdate';
  static VPlayEvent = 'play';
  static VPauseEvent = 'pause';
  static VSeekingEvent = 'seeking';
  static VSeekedEvent = 'seeked';
  static VChangeSpeedEvent = 'changedspeed';
  static VFullscreenChangeEvent = 'fullscreenchange';
  static VScreenModeChangeEvent = 'screenmodechange';
  static VUserInactiveEvent = 'userinactive';

  // trans event
  static VLanguageChangeEvent = 'langchange';
  static VFilterTransEvent = 'filtertrans';
  static VEditTransEvent = 'edittrans';
  static VTransViewChangeEvent = 'transviewchange';
  static VTransAutoScrollChangeEvent = 'autoScrollChange';
  static VPauseWhenEditTransChangeEvent = 'pauseWhenEdit';
  static VPauseWhenADStartsChangeEvent = 'pauseWhenADStarts';
  static VShareLinkEvent = 'sharelink';
  static VChangeVideoEvent = 'changevideo';
}

export default UserEventType;