/* eslint-disable complexity */
import { isMobile } from 'react-device-detect';
import { api, user, uurl, links, timestr } from 'utils';
import { createAsyncThunk } from '@reduxjs/toolkit';
import PlayerData from '../player'
import { uEvent } from '../Utils/UserEventController';
import {
  NORMAL_MODE,
  PS_MODE,
  NESTED_MODE /** THEATRE_MODE, */,
  CTP_PLAYING,
  // CTP_LOADING,
  CTP_ENDED,
  CTP_UP_NEXT,
  //  CTP_ERROR,
  // HIDE_TRANS,
} from '../Utils/constants.util';

import {
  setPause, setLiveMode, setTime, switchScreen, setFullscreenTwo,
  toggleFullScreen, setCTPEvent, setMode, setFlashAcknowledged
} from '../watchSlice';

const LIVE_BUFFER_TIME = 20;
let hasRestored = false;
function handleRestoreTime(watch) {
  const { media, embedded } = watch;
  const search = uurl.useSearch();
  const begin = embedded ? embedded?.beginAt : (search.begin || media.watchHistory.timestamp);
  if (begin > timestr.toSeconds(media.duration) - 1) {
    // Do not restore if we're approaching the end
    return false;
  }
  if (!embedded && hasRestored) {
    return false;
  }
  if (begin) {
    if (!embedded) {
      hasRestored = true;
      window.history.replaceState(null, null, links.watch(media.id));
    }
    return Number(begin);
  }
  return false;
}

function enterFullScreen(watch) {
  try {
    let elem = document.getElementById('ct-video-con-div') || {};
    if (isMobile) {
      elem = document.getElementById(watch.isSwitched ? 'ct-video-2' : 'ct-video-1') || {};
    }
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.webkitEnterFullscreen) {
      /* Safari IOS Mobile */
      elem.webkitEnterFullscreen();
    } else if (elem.msRequestFullscreen) {
      /* IE/Edge */
      elem.msRequestFullscreen();
    }
    uEvent.fullscreenchange(watch.time, true);
  } catch (error) {
    console.error('Failed to enter fullscreen.');
  }
}
function exitFullScreen(watch) {
  try {
    if (isMobile) {
      // const elem = document.getElementById(watch.isSwitched ? 'ct-video-2' : 'ct-video-1') || {};
      // console.log(elem.webkitExitFullscreen)
    }
    if (!PlayerData.video1) return;
    if (document.fullscreenElement == null) return;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
    uEvent.fullscreenchange(watch.time, false);
  } catch (error) {
    console.error('Failed to exit fullscreen.');
  }
}

export const sendMediaHistories = createAsyncThunk('watch/sendMediaHistories',
  async (_arg, { getState }) => {
    const { watch } = getState();
    const { id } = watch.media;
    if (id && user.isLoggedIn) {
      try {
        await api.sendMediaWatchHistories(
          id,
          watch.time,
          (watch.time / watch.duration) * 100,
        );
      } catch (e) {
        // handle error if needed
      }
    }
  });

export const media_play = createAsyncThunk(
  'watch/media_play',
  async (_unused, { dispatch }) => {
    try {
      if (PlayerData.video1) await PlayerData.video1.play();
      if (PlayerData.video2) await PlayerData.video2.play();
      if (PlayerData.aslVideo) await PlayerData.aslVideo.play();
      dispatch(setPause(false));
      if (PlayerData.video1) uEvent.play(PlayerData.video1.currentTime);
    } catch {
      dispatch(setPause(true));
    }
  });


export const media_forward = createAsyncThunk('watch/media_forward',
  async (sec = 10, { dispatch, getState }) => {
    const { watch } = getState();
    const now = watch.time;
    const max_time = watch.duration - (watch.liveMode ? LIVE_BUFFER_TIME : 0);
    if (watch.liveMode === 1) return;
    if (watch.liveMode === 2 && now + sec > max_time) {
      dispatch(setLiveMode(1));
    }
    dispatch(setTime(Math.min(now + sec, max_time)));
  });

export const media_backward = createAsyncThunk('watch/media_backward',
  async (sec = 10, { dispatch, getState }) => {
    const { watch } = getState();
    const now = watch.time;
    if (watch.liveMode === 1) {
      dispatch(setLiveMode(2));
    }
    dispatch(setTime(Math.max(now - sec, 0)));
  });

export const media_pause = createAsyncThunk('watch/media_pause',
  async (_arg, { dispatch }) => {
    try {
      if (PlayerData.video1) PlayerData.video1.pause();
      if (PlayerData.video2) PlayerData.video2.pause();
      if (PlayerData.aslVideo) PlayerData.aslVideo.pause();
    } catch {
      // do nothing
    }
    dispatch(setPause(true));
    if (PlayerData.video1) uEvent.pause(PlayerData.video1.currentTime);
    dispatch(sendMediaHistories());
  });

export const media_mute = createAsyncThunk('watch/media_mute',
  async (toSet, { dispatch, getState }) => {
    if (toSet === undefined) {
      const { playerpref } = getState();
      toSet = !playerpref.muted;
    }
    dispatch({
      type: 'playerpref/setPreference',
      payload: { muted: toSet },
    });
  });

export const media_volume = createAsyncThunk('watch/media_volume',
  async (toSet, { dispatch }) => {
    dispatch({
      type: 'playerpref/setPreference',
      payload: { volume: toSet },
    });
  });

export const media_brightness = createAsyncThunk('watch/media_brightness',
  async (toSet, { dispatch }) => {
    dispatch({
      type: 'playerpref/setPreference',
      payload: { brightness: toSet },
    });
  });

export const media_setCurrTime = createAsyncThunk('watch/media_setCurrTime',
  async (payload, { dispatch, getState }) => {
    let time;
    let realTime;
    if (typeof payload === 'object' && payload !== null) {
      ({ time, realTime } = payload); // destructure safely
    } else {
      time = payload;
      realTime = false;
    }

    const { watch } = getState();
    if (watch.liveMode && !realTime) {
      dispatch(setLiveMode(time > -5 ? 1 : 2));
      time = watch.duration + time;
    }
    if (PlayerData.video1) PlayerData.video1.currentTime = time;
    if (PlayerData.video2) PlayerData.video2.currentTime = time;
    if (PlayerData.aslVideo) PlayerData.aslVideo.currentTime = time;

    dispatch(setTime(time));
    dispatch(sendMediaHistories());
  });

export const media_replay = createAsyncThunk('watch/media_replay',
  async (_arg, { dispatch }) => {
    await dispatch(media_setCurrTime(0));
    dispatch(media_play());
  });

export const media_playbackrate = createAsyncThunk('watch/media_playbackrate',
  async (playbackrate, { dispatch, getState }) => {
    const { watch } = getState();
    dispatch({
      type: 'playerpref/setPreference',
      payload: { playbackrate },
    });
    uEvent.changespeed(watch.time, playbackrate);
  });

export const seekToPercentage = createAsyncThunk('watch/seekToPercentage',
  async (p = 0, { dispatch, getState }) => {
    if (typeof p !== 'number' || p > 1 || p < 0) return;
    const { watch } = getState();
    const seekTo = watch.duration * p;
    dispatch(media_setCurrTime({ time: seekTo, realTime: true }));
  });

export const onPlayPauseClick = createAsyncThunk('watch/onPlayPauseClick',
  async (_arg, { dispatch, getState }) => {
    const { watch } = getState();
    if (watch.paused) {
      dispatch(media_play());
    } else {
      dispatch(media_pause());
    }
  });

export const toggleFullScreenTwo = createAsyncThunk('watch/toggleFullScreenTwo',
  async (bool, { dispatch, getState }) => {
    const { watch } = getState();
    const newState = bool === undefined ? !watch.isFullscreenTwo : bool;
    if (!PlayerData.video1) return;

    if (newState) {
      enterFullScreen(watch);
    } else {
      exitFullScreen(watch);
    }
    dispatch(setFullscreenTwo(newState));
  });

export const switchVideo = createAsyncThunk('watch/switchVideo',
  async (bool, { dispatch, getState }) => {
    if (!PlayerData.video2) return;
    const { watch } = getState();
    const toSet = bool === undefined ? !watch.isSwitched : bool;
    dispatch(switchScreen(toSet));
  });

export const onPlayerReady = createAsyncThunk('watch/onPlayerReady',
  async ({ isPrimary }, { dispatch, getState }) => {
    const { playerpref, watch } = getState();

    const flashWarning = watch.media.flashWarning ?? false;
    const playbackrate = playerpref.playbackrate ?? 1;

    if (PlayerData.param.canPlayDone) return;

    if (PlayerData.aslVideo) PlayerData.aslVideo.playbackRate = playbackrate;

    if (isPrimary) {
      PlayerData.param.video1CanPlay = true;
      if (PlayerData.param.video2CanPlay || !PlayerData.video2) {
        PlayerData.param.canPlayDone = true;
        PlayerData.video1.playbackRate = playbackrate;

        const start_time = handleRestoreTime(watch);
        // eslint-disable-next-line no-console
        console.log("SETCURRTIME", start_time)
        if (start_time) {
          dispatch(media_setCurrTime(start_time));
        }
        if (playerpref.autoPlay && !flashWarning) {
          dispatch(media_play());
        }
      }
    } else {
      PlayerData.param.video2CanPlay = true;
      if (PlayerData.param.video1CanPlay) {
        PlayerData.param.canPlayDone = true;
        PlayerData.video2.playbackRate = playbackrate;

        const start_time = handleRestoreTime(watch);
        if (start_time) {
          dispatch(media_setCurrTime(start_time));
        }
        if (playerpref.autoPlay && !flashWarning) {
          dispatch(media_play());
        }
      }
    }
  });

export const onSeekingPri = createAsyncThunk('watch/onSeekingPri',
  async ({ seeked, priVideo }, { dispatch, getState }) => {
    const { watch } = getState();

    if (!seeked) {
      if (watch.ctpPriEvent === CTP_ENDED || watch.ctpPriEvent === CTP_UP_NEXT) {
        dispatch(setCTPEvent({ event: CTP_PLAYING, priVideo }));
      }
    }
    uEvent.seeking(watch.time);
  });

export const onFullScreenChange = createAsyncThunk('watch/onFullScreenChange',
  async (_arg, { dispatch, getState }) => {
    const isFullscreen = !!document.fullscreenElement;
    const { watch } = getState();
    if (isFullscreen !== watch.isFullscreen) {
      dispatch(toggleFullScreen(isFullscreen));
    }
  });

export const setWatchMode = createAsyncThunk('watch/setWatchMode',
  async ({ mode, config = {} }, { dispatch, getState }) => {
    let { sendUserAction = true, restore = false } = config;
    const { watch } = getState();

    if (window.innerWidth <= 900 && mode === PS_MODE) {
      mode = NESTED_MODE;
    } else if (restore) {
      mode = watch.prevmode || NORMAL_MODE;
    }

    dispatch(setMode(mode));
    if (sendUserAction) {
      uEvent.screenmodechange(watch.time, mode);
    }
  });

export const acknowledgeFlashWarning = createAsyncThunk('watch/acknowledgeFlashWarning',
  async (_arg, { dispatch }) => {
    dispatch(setFlashAcknowledged(true));
  });

export const allPlayerThunks = {
  sendMediaHistories,
  media_play,
  media_forward,
  media_backward,
  media_pause,
  media_mute,
  media_volume,
  media_brightness,
  media_setCurrTime,
  media_replay,
  media_playbackrate,
  seekToPercentage,
  onPlayPauseClick,
  toggleFullScreenTwo,
  switchVideo,
  onPlayerReady,
  onSeekingPri,
  onFullScreenChange,
  setWatchMode,
  acknowledgeFlashWarning
}

