const setPause = (state, action) => {
  state.paused = action.payload;
}

const setTime = (state, action) => {
  state.time = action.payload;
}

const setLiveMode = (state, action) => {
  state.liveMode = action.payload;
}

const setFullscreenTwo = (state, action) => {
  state.isFullscreenTwo = action.payload;
}

const toggleFullScreen = (state, action) => {
  state.isFullscreen = action.payload;
}

const switchScreen = (state, action) => {
  state.isSwitched = action.payload;
}

const setMode = (state, action) => {
  state.mode = action.payload;
}

const setPrevmode = (state, action) => {
  state.prevmode = action.payload;
}

const setCTPEvent = (state, action) => {
  state.ctpPriEvent = action.payload.event;
}

const setFlashAcknowledged = (state, action) => {
  state.media.flashAcknowledged = action.payload;
}

export default {
  setPause,
  setTime,
  setLiveMode,
  setFullscreenTwo,
  toggleFullScreen,
  switchScreen,
  setMode,
  setPrevmode,
  setCTPEvent,
  setFlashAcknowledged
};