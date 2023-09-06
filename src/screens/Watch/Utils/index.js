import { connect } from 'dva'
import _, { filter, transform } from 'lodash'
import { 
  // timeStrToSec, 
  colorMap } from './helpers';
import {
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_OPACITY_75,
  CC_POSITION_BOTTOM,
  CC_FONT_SANS_SERIF,
  CC_SIZE_100,
  CC_SPACING_DEFAULT,
  SCREEN_OPACITY_100,
  SCREEN_ZOOM_100,
  ROTATE_COLOR_0,
  INVERT_0,
  // WEBVTT_SUBTITLES,
  // WEBVTT_DESCRIPTIONS,
  // ENGLISH,
  // ARRAY_EMPTY,
  // PROFANITY_LIST,
  // TRANSCRIPT_VIEW,
  // LINE_VIEW,
  // HIDE_TRANS,
  // CO_CHANGE_VIDEO,
  // BULK_EDIT_MODE,
} from './constants.util';

export * from './constants.util';
export * from './data';
export * from './helpers';

export { generateWatchUserGuide } from './user-guide';
export { keydownControl } from './keydown.control';
export { transControl } from './trans.control';
export { promptControl } from './prompt.control';
export { downloadControl } from './download.control';
export { uEvent } from './UserEventController';
export function findTransByLanguage(language, trans) {
  return _.find(trans, { language });
}
export const connectWithRedux = (Component, property) => {
  return connect(({ watch, loading, history }) => {
    if (!property) {
      return {};
    }
    const props = {};
    property.map((key) => {
      props[key] = watch[key];
      return false;
    })
    return props;
  })(Component);
}
export const getCCStyle = (options) => {
  const {
    cc_color = CC_COLOR_WHITE,
    cc_bg = CC_COLOR_BLACK,
    cc_size = CC_SIZE_100,
    cc_opacity = CC_OPACITY_75,
    cc_font = CC_FONT_SANS_SERIF,
    cc_position = CC_POSITION_BOTTOM,
    cc_spacing = CC_SPACING_DEFAULT
  } = options;

  const ccStyle = {
    backgroundColor: colorMap(cc_bg, cc_opacity),
    color: cc_color,
    fontSize: `${cc_size + 0.25}rem`, // +.25 to get a larger default font size
    fontFamily: cc_font,
    'word-spacing': `${cc_spacing}rem`,
  };

  const ccContainerStyle = {};

  if (cc_position === 'top') {
    ccContainerStyle.top = '.7em';
  } else {
    // cc_position === 'bottom'
    ccContainerStyle.bottom = '.7em';
  }

  return { ccStyle , ccContainerStyle };
}

export const getVideoStyle = (options) => {
  const {
    brightness = SCREEN_OPACITY_100,
    contrast = 1,
    rotateColor = ROTATE_COLOR_0,
    invert = INVERT_0,
    scale = SCREEN_ZOOM_100,
    magnifyX = 0,
    magnifyY = 0,

  } = options;
  const threshold = 0.001;
  let filter_string = ``;
  let transform_string = ``;

  if (Math.abs(brightness - SCREEN_OPACITY_100) > threshold) {
    filter_string += `brightness(${brightness})`
  }
  if (Math.abs(contrast - 1) > threshold) {
    filter_string += ` contrast(${contrast})`
  }
  if (rotateColor !== ROTATE_COLOR_0) {
    filter_string += ` hue-rotate(${rotateColor})`
  }
  if (invert !== INVERT_0) {
    filter_string += ` invert(${invert})`
  }

  if (scale !== SCREEN_ZOOM_100) {
    transform_string += `scale(${scale})`
  }
  if (magnifyX !== 0 || magnifyY !== 0) {
    transform_string += ` translate(${magnifyX}px,${magnifyY}px)`
  }
  const videoStyle = {
    
    filter: filter_string,
    transform: transform_string,
  };
  return { videoStyle };
}
/**
* Function that scrolls the captions
*/
export const scrollTransToView = (id, smoothScroll = true, isTwoScreen) => {
  let capId = id;
  if (!capId) return;
  const capElem = document.getElementById(`caption-line-${capId}`);
  if (!capElem || !capElem.offsetTop) return;

  const tranBox = document.getElementById('watch-trans-container');

  const shouldSmoothScroll = smoothScroll && tranBox.scrollTop - capElem.offsetTop < 0;

  if (!shouldSmoothScroll) tranBox.style.scrollBehavior = 'auto';
  capElem.classList.add('curr-line');
  const scrollTop =
      window.innerWidth < 900 || !isTwoScreen ? capElem.offsetTop - 50 : capElem.offsetTop - 80;
  // if (preferControl.defaultTransView() === TRANSCRIPT_VIEW) scrollTop -= 400 NOT IMPLEMENTED
  tranBox.scrollTop = scrollTop;
  if (!shouldSmoothScroll) tranBox.style.scrollBehavior = 'smooth';
}