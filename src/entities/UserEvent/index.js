import { v4 as uuid } from 'uuid';
import UserEventType from './UserEventType';
import UserEvent from './UserEvent';

class UserEventManager {
  constructor() {
    this.__binge_id = uuid();
    this.shouldRefreshTUBingeId = false;
  }

  get bingeId() {
    if (this.shouldRefreshTUBingeId) {
      this.__binge_id = uuid();
      this.shouldRefreshTUBingeId = false;
    }

    return this.__binge_id;
  }

  // customizable function for extension classes
  buildEventData = (data) => {
    return data;
  }

  send(eventType, json) {
    if (eventType !== UserEventType.VTimeUpdateEvent) {
      this.shouldRefreshTUBingeId = true;
    }

    const event = new UserEvent(eventType, this.buildEventData({ json }));
    return event.send();
  }

  selectcourse(offeringId) {
    return this.send(UserEventType.SelectCourseEvent, { offeringId });
  }

  /** player events */
  play(timeStamp) {
    return this.send(UserEventType.VPlayEvent, { timeStamp });
  }

  pause(timeStamp) {
    return this.send(UserEventType.VPauseEvent, { timeStamp });
  }

  seeking(timeStamp) {
    return this.send(UserEventType.VSeekingEvent, { timeStamp });
  }

  seeked(timeStamp) {
    return this.send(UserEventType.VSeekedEvent, { timeStamp });
  }

  timeupdate(timeStamp) {
    return this.send(UserEventType.VTimeUpdateEvent, { timeStamp, bingeId: this.bingeId });
  }

  changespeed(timeStamp, playbackRate) {
    return this.send(UserEventType.VChangeSpeedEvent, { timeStamp, playbackRate });
  }

  fullscreenchange(timeStamp, enterFullscreen) {
    return this.send(UserEventType.VFullscreenChangeEvent, { timeStamp, enterFullscreen });
  }

  userinactive(timeStamp) {
    // unfinished
    return this.send(UserEventType.VUserInactiveEvent, { timeStamp });
  }

  screenmodechange(timeStamp, screenmode) {
    return this.send(UserEventType.VScreenModeChangeEvent, { timeStamp, screenmode });
  }

  /** Trans, CC, AD events */
  langchange(timeStamp, lang) {
    return this.send(UserEventType.VLanguageChangeEvent, { timeStamp, lang });
  }

  filtertrans(value) {
    return this.send(UserEventType.VFilterTransEvent, { value });
  }

  edittrans(timeStamp, prevText, newText) {
    return this.send(UserEventType.VEditTransEvent, { timeStamp, prevText, newText });
  }

  transviewchange(timeStamp, transview) {
    return this.send(UserEventType.VTransViewChangeEvent, { timeStamp, transview });
  }
  autoScrollChange(open) {
    return this.send(UserEventType.VTransAutoScrollChangeEvent, { open });
  }

  pauseWhenEdit(open) {
    return this.send(UserEventType.VPauseWhenEditTransChangeEvent, { open });
  }

  pauseWhenADStarts(open) {
    return this.send(UserEventType.VPauseWhenADStartsChangeEvent, { open });
  }

  sharelink(timeStamp, sharedUrl) {
    return this.send(UserEventType.VShareLinkEvent, { timeStamp, sharedUrl });
  }

  selectvideo(mediaId) {
    return this.send(UserEventType.SelectVideoEvent, { mediaId });
  }
}

export default UserEventManager;
export { default as UserEventType } from './UserEventType';
export { default as UserEvent } from './UserEvent';