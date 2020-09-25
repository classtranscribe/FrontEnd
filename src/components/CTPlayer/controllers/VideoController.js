import { prompt } from 'utils/prompt'
import VideoNode from './structs/VideoNode';
import PConstants from './constants/PlayerConstants';
import { _captureVideoImage } from './helpers';

/**
 * The video event controller for the player
 */
class VideoController {
  /**
   * Create a Video Controller for CTPlayer
   * @param {Any} stateManager - a state manager for video controller
   */
  constructor(stateManager) {
    this.state = stateManager;

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
    this.isPlayingRange = false;

    // binding functions
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
    this.video1 = new VideoNode(node);
    if (node) {
      node.addEventListener('durationchange', this.onDurationChange);
      node.addEventListener('progress', this.onProgress);
      node.addEventListener('timeupdate', this.onTimeUpdate);
      node.addEventListener('seeking', this.onSeeking);
      node.addEventListener('ended', this.onEnded);
      node.addEventListener('pause', this.onPause);
      node.addEventListener('play', this.onPlay);
      node.addEventListener('canplay', this.onVideo1CanPlay);
    }
  }

  registerVideo2(node) {
    this.video2 = new VideoNode(node);
    if (node) {
      this.video2Ready = false;
      node.addEventListener('canplay', this.onVideo2CanPlay);
    }
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

  userIsReady() {
    this.state.setUserReady(true);
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

  captureImage(callback, video1 = true) {
    this.pause();
    const video = video1 ? this.video1 : this.video2;
    _captureVideoImage(video.node, callback);
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
  }

  unmute() {
    if (!this.video1) return;
    this.video1.unmute();
    this.state.setMuted(false);
    this.toggleEvent(PConstants.PlayerEventVolumeUp);
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
    if (volume > 1 || volume < 0) return;
    this.video1.setVolume(volume);
    this.state.setVolume(volume);
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
  }

  // -----------------------------------------------------------------
  // Range
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  toggleRange() {
    this.state.setOpenRange(!this.state.openRange);
    this.isPlayingRange = false;
  }

  setRange(range) {
    this.state.setRange(range);
    this.isPlayingRange = false;
  }

  playRange() {
    if (Array.isArray(this.state.range) && this.state.openRange) {
      this.play();
      this.setCurrentTime(this.state.range[0]);
      this.isPlayingRange = true;
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

    if (this.isPlayingRange) {
      if (this.state.range[1] <= currentTime) {
        this.pause();
        this.isPlayingRange = false;
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
    if (!this.state.userReady) this.userIsReady();
  }

  onSeeking() {
    if (this.isEnded) this.state.setIsEnded(false);
  }

  onEnded() {
    this.state.setIsEnded(true);
  }
}

export default VideoController;