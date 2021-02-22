import React from 'react';
import PropTypes from 'prop-types';
import Player from './Player';

export {
  /** Constants */
  CTPlayerIDs,
  CTPlayerConstants,
  LanguageConstants,
  _createImage,
  _decodeScreenshotPath,
  _encodeScreenshotPath
} from './controllers';

function CTPlayer(props) {
  return <Player {...props} />;
}

const NumOrStr = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
CTPlayer.propTypes = {
  /** An unique id for the player */
  id: PropTypes.string,

  /** The media's id used to get media data */
  mediaId: PropTypes.string,

  /** The media object */
  media: PropTypes.object,

  /** The player can fill it's container */
  fill: PropTypes.bool,

  /** The width of the player in pixel */
  width: NumOrStr,

  /** The width of the player in pixel */
  height: NumOrStr,

  /** Set true if you don't want the control bars to overlay on the video */
  padded: PropTypes.bool,

  /** The player supports two screen mode */
  allowTwoScreen: PropTypes.bool,

  /** Set the default begin time for the video */
  beginAt: PropTypes.number,

  /** Set the default begin time for the video */
  endAt: PropTypes.number,

  /** Set the current time of the video */
  triggerTime: PropTypes.number,

  /** The player supports the closed captions */
  defaultOpenCC: PropTypes.bool,

  /** The lang code */
  defaultLanguage: PropTypes.string,

  /** Set the default playback rate */
  defaultPlaybackRate: PropTypes.number,

  /** Hide the overlayed wrapper when mouse leaving */
  hideWrapperOnMouseLeave: PropTypes.bool,

  /** Allow build-in screenshot function */
  allowScreenshot: PropTypes.bool,

  /** A function that returns Action Element for screenshot window, will be passed in ({ blob, url }) */
  screenshotActionElement: PropTypes.func,

  /** Source for the captured image, default as `{ type: Media, id: mediaId }` */
  screenshotSource: PropTypes.shape({
    id: PropTypes.string,
    type: PropTypes.number
  }),

  /** Callback when screenshot is generated, will pass in the screenshot blob's url */
  onScreenshotCaptured: PropTypes.func,

  // Range picker
  /** The player supports time range picker */
  allowRangePicker: PropTypes.bool,

  /** Open the range picker when the player rendered */
  defaultOpenRangePicker: PropTypes.bool,

  /** Set the default time range */
  defaultRange: PropTypes.arrayOf(NumOrStr),

  /** Set the current range */
  range: PropTypes.arrayOf(NumOrStr),

  /** Callback function when the range changes */
  onRangePicked: PropTypes.func
};

export default CTPlayer;