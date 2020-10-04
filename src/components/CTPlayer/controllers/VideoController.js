import { v4 as uuid } from 'uuid';
import { prompt } from 'utils/prompt';
import SourceTypes from 'entities/SourceTypes';
import VideoNode from './structs/VideoNode';
import PConstants from './constants/PlayerConstants';
import PPrefer from './PlayerPreference';
import {
  _captureVideoImage,
  _downloadScreenshotByBlob,
  _copyScreenshotLink
} from './helpers';

/**
 * The video event controller for the player
 */
class VideoController {
  /**
   * Create a Video Controller for CTPlayer
   * @param {Any} stateManager - a state manager for video controller
   * @param {String} id - an unique id for the video
   */
  constructor(stateManager, id) {
    this.state = stateManager;
    // Player IDs
    this.id = id || uuid();

    // video nodes
    this.video1 = null;
    this.video2 = null;

    // ready states
    this.video1Ready = false;
    this.video2Ready = true;
    
    // video attributes
    this.beginAt = 0;
    this.endAt = null;

    // range
    this.__isPlayingRange = false;

    // screenshot attrs
    this.__screenshotSourceType = SourceTypes.Media;
    this.__screenshotSourceId = this.id;
    this.__isScreenshotAllowed = false;
    this.__onScreenshotCaptured = null; // callback when screenshot is captured

    // binding functions
    this.bindFuncs();
  }

  bindFuncs() {
    this.registerVideo1 = this.registerVideo1.bind(this);
    this.registerVideo2 = this.registerVideo2.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.replay = this.replay.bind(this);
    this.setCurrentTime = this.setCurrentTime.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setPlaybackRate = this.setPlaybackRate.bind(this);
    this.setRange = this.setRange.bind(this);
    this.toggleRange = this.toggleRange.bind(this);
    this.playRange = this.playRange.bind(this);

    // video event handlers
    this.onDurationChange = this.onDurationChange.bind(this);
    this.onVideo1CanPlay = this.onVideo1CanPlay.bind(this);
    this.onVideo2CanPlay = this.onVideo2CanPlay.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onSeeking = this.onSeeking.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  // -----------------------------------------------------------------
  // Register Video Nodes
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  /**
   * 
   * @param {HTMLVideoElement} node 
   */
  registerVideo1(node) {
    if (!node) {
      console.error('Failed to register node for video1.')
      return;
    }

    this.video1 = new VideoNode(node);
    // initialize preferences
    this.video1.setVolume(PPrefer.volume);
    this.video1.setPlaybackRate(PPrefer.playbackRate);
    if (PPrefer.muted) this.video1.mute();
    // add event listeners
    node.addEventListener('durationchange', this.onDurationChange);
    node.addEventListener('progress', this.onProgress);
    node.addEventListener('timeupdate', this.onTimeUpdate);
    node.addEventListener('seeking', this.onSeeking);
    node.addEventListener('ended', this.onEnded);
    node.addEventListener('pause', this.onPause);
    node.addEventListener('play', this.onPlay);
    node.addEventListener('canplay', this.onVideo1CanPlay);
  }

  registerVideo2(node) {
    if (!node) {
      console.error('Failed to register node for video2.')
      return;
    }

    this.video2 = new VideoNode(node);
    this.video2Ready = false;
    // initialize preferences
    this.video2.setVolume(PPrefer.volume);
    this.video2.setPlaybackRate(PPrefer.playbackRate);
    // add event listeners
    node.addEventListener('canplay', this.onVideo2CanPlay);
  }

  // -----------------------------------------------------------------
  // Player Property/Status Initializer
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  setBeginAt(beginAt) {
    if (typeof beginAt === 'number') {
      this.beginAt = beginAt;
    }
  }

  setEndAt(endAt) {
    if (typeof endAt === 'number') {
      this.endAt = endAt;
    }
  }

  videoIsReady() {
    if (this.video1Ready && (this.video2Ready || !this.video2)) {
      this.state.setVideoReady(true);

      if (this.beginAt > 0) {
        this.setCurrentTime(this.beginAt);
      }
    }
  }

  // Screenshot Attributes Handlers
  // -----------------------------------------------------------------

  setScreenshotSource(sourceType, sourceId) {
    this.__screenshotSourceType = sourceType;
    this.__screenshotSourceId = sourceId;
  }

  get screenshotSourceType() { return this.__screenshotSourceType; }
  get screenshotSourceId() { return this.__screenshotSourceId; }

  set isScreenshotAllowed(isAllowed) {
    this.__isScreenshotAllowed = isAllowed;
  }

  get isScreenshotAllowed() { return this.__isScreenshotAllowed; }

  set onScreenshotCaptured(onScreenshotCaptured) {
    if (typeof onScreenshotCaptured === 'function') {
      this.__isScreenshotAllowed = true;
      this.__onScreenshotCaptured = onScreenshotCaptured;
    }
  }

  // -----------------------------------------------------------------
  // Video Attributes Handlers
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  setEvent(event) {
    this.state.setEvent(event);
  }

  eventTimer = null;
  toggleEvent(event) {
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
    }

    this.setEvent(null);
    this.setEvent(event);
    this.eventTimer = setTimeout(() => {
      this.setEvent(null);
    }, 600);
  }

  captureImage(video1 = true, callback) {
    if (!this.isScreenshotAllowed) {
      console.error('Build-in screenshot is not allowed.');
      return;
    }

    this.pause();
    const video = video1 ? this.video1 : this.video2;
    _captureVideoImage(video.node, (url, blob) => {
      if (typeof callback === 'function') {
        callback(url, blob);
      }
      if (typeof this.__onScreenshotCaptured === 'function') {
        this.__onScreenshotCaptured(url, blob);
      }
    });
  }

  downloadScreenshot(imgBlob) {
    _downloadScreenshotByBlob(imgBlob, this.state.time, this.state.media.mediaName);
  }

  async copyScreenshotLink(imgBlob) {
    const successed = await _copyScreenshotLink(
      imgBlob, 
      this.screenshotSourceType, 
      this.screenshotSourceId);
    return successed;
  }


  // Play/Pause
  // -----------------------------------------------------------------
  pause() {
    if (!this.video1 || this.video1.paused) return;
    this.video1.pause();
    if (this.video2) this.video2.pause();
    this.toggleEvent(PConstants.PlayerEventPause);
  }

  play() {
    if (!this.video1 || !this.video1.paused) return;
    this.video1.play();
    if (this.video2) this.video2.play();
    this.toggleEvent(PConstants.PlayerEventPlay);
  }

  togglePause() {
    if (!this.video1) return;
    if (this.video1.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  replay() {
    // reset progress values
    this.state.setTime(0);
    if (this.isEnded) {
      this.state.setIsEnded(false);
    }
    // play the video
    this.play();
  }

  // Timing/Progress
  // -----------------------------------------------------------------
  setCurrentTime(time) {
    if (!this.video1) return;
    if (typeof time !== 'number') return;
  
    if (time < 0) {
      time = 0;
    } else if (time > this.state.duration) {
      time = this.state.duration;
    }

    this.video1.setCurrentTime(time);
    this.state.setTime(time);
    if (this.video2) {
      this.video2.setCurrentTime(time);
    }
    this.updateCurrCaption(time);
  }

  forward() {
    this.setCurrentTime(this.state.time + 5);
    this.toggleEvent(PConstants.PlayerEventForward);
  }

  rewind() {
    this.setCurrentTime(this.state.time - 5);
    this.toggleEvent(PConstants.PlayerEventRewind);
  }

  // Volume
  // -----------------------------------------------------------------
  mute() {
    if (!this.video1) return;
    this.video1.mute();
    this.state.setMuted(true);
    this.toggleEvent(PConstants.PlayerEventMute);
    PPrefer.setMuted(true);
  }

  unmute() {
    if (!this.video1) return;
    this.video1.unmute();
    this.state.setMuted(false);
    this.toggleEvent(PConstants.PlayerEventVolumeUp);
    PPrefer.setMuted(false);
  }

  toggleMute() {
    if (this.state.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  setVolume(volume) {
    if (!this.video1) return;
    const realVolume = volume > 1 ? 1 : (volume < 0 ? 0 : volume);
    this.video1.setVolume(realVolume);
    this.state.setVolume(realVolume);
    PPrefer.setVolume(realVolume);
    if (volume > 0 && this.state.muted) {
      this.unmute();
    }
  }

  volumeUp() {
    this.setVolume(this.state.volume + 0.05);
    this.toggleEvent(PConstants.PlayerEventVolumeUp);
  }

  volumeDown() {
    this.setVolume(this.state.volume - 0.05);
    this.toggleEvent(PConstants.PlayerEventVolumeDown);
  }

  // Playback Rate
  // -----------------------------------------------------------------
  setPlaybackRate(playbackRate) {
    if (!this.video1) return;
    this.video1.setPlaybackRate(playbackRate);
    this.state.setPlaybackRate(playbackRate);
    PPrefer.setPlaybackRate(playbackRate)
  }

  // -----------------------------------------------------------------
  // Range
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  toggleRange() {
    this.state.setOpenRange(!this.state.openRange);
    this.__isPlayingRange = false;
  }

  setRange(range) {
    this.state.setRange(range);
    this.__isPlayingRange = false;
  }

  playRange() {
    if (Array.isArray(this.state.range) && this.state.openRange) {
      this.play();
      this.setCurrentTime(this.state.range[0]);
      this.__isPlayingRange = true;
    }
  }

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // Native Video Events Handlers
  // -----------------------------------------------------------------
  onDurationChange({ target: { duration } }) {
    this.state.setDuration(duration);

    if (this.state.openRange && !this.state.range) {
      this.setRange([0, duration]);
    }
  }

  onVideo1CanPlay({ target: { readyState } }) {
    if (readyState > 0 && !this.state.videoReady) {
      this.video1Ready = true;
      this.videoIsReady();
    }
  }

  onVideo2CanPlay({ target: { readyState } }) {
    if (readyState > 0 && !this.state.videoReady) {
      this.video2Ready = true;
      this.videoIsReady();
    }
  }

  onProgress({ target: { buffered, currentTime, duration } }) {
    if (duration > 0) {
      for (let i = 0; i < buffered.length; i += 1) {
        if (buffered.start(buffered.length - 1 - i) < currentTime) {
          this.state.setBufferedTime(buffered.end(buffered.length - 1 - i));
          break;
        }
      }
    }
  }

  updateCurrCaption() {/** Abstract function */}

  lastCCUpdatedTime = 0;
  shouldPauseOnEndAt = false;
  onTimeUpdate({ target: { currentTime } }) {
    if (Math.abs(this.state.time - currentTime) > 0.3) {
      this.state.setTime(currentTime);
      this.updateCurrCaption(currentTime);
    }

    if (this.__isPlayingRange) {
      if (this.state.range[1] <= currentTime) {
        this.pause();
        this.__isPlayingRange = false;
      }
    }

    // Pause the video automatically at the endAt timestamp
    if (typeof this.endAt === 'number') {
      if (currentTime < this.endAt && !this.shouldPauseOnEndAt) {
        this.shouldPauseOnEndAt = true;
        // console.log('1 this.shouldPauseOnEndAt = true;')
      } else if (this.shouldPauseOnEndAt 
                && currentTime >= this.endAt 
                && currentTime <= this.endAt + 1) {
        this.pause();
        this.shouldPauseOnEndAt = false;
        prompt.addOne({ text: 'Video paused at the breakpoint.', timeout: 3000 });
        // console.log('2 this.shouldPauseOnEndAt = false;')
      } else if (this.shouldPauseOnEndAt && currentTime > this.endAt) {
        this.shouldPauseOnEndAt = false;
        // console.log('3 this.shouldPauseOnEndAt = false;')
      }
    }
  }

  onPause() {
    this.state.setIsPaused(true);
  }

  onPlay() {
    this.state.setIsPaused(false);
  }

  onSeeking() {
    if (this.isEnded) this.state.setIsEnded(false);
  }

  onEnded() {
    this.state.setIsEnded(true);
  }
}

export default VideoController;