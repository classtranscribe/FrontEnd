import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import {
  initialState,
  CTPlayerConstants as Constants,
  CTPlayerController
} from '../controllers';
import { getPlayerSize } from '../controllers/helpers';

import Video from '../Video';
import Wrapper from '../Wrapper';
import Range from '../Range';
import './index.scss';

/**
 * ClassTranscribe's light video player component
 */
class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setPlayerState = this.setPlayerState.bind(this);

    // Setup the player instance
    const { id } = props;
    this.player = new CTPlayerController(this.setPlayerState, id);
  }

  /**
   * Function used to set states by specifiying their name
   * @param {String} key - the state's name
   * @param {Any} value - the value to set
   */
  setPlayerState(key, value) {
    this.setState({ [key]: value });
  }

  /**
   * Function used to set the time range
   * @param {Number[]} range - the range object to set
   */
  setRange = (range) => {
    const { onRangePicked } = this.props;

    this.player.setRange(range);
    if (typeof onRangePicked === 'function') {
      onRangePicked(range);
    }
  }

  componentDidMount() {
    const {
      mediaId,
      media,
      beginAt,
      defaultOpenCC,
      allowRangePicker,
      defaultOpenRangePicker,
      range,
      defaultRange,
    } = this.props;

    // Setup media
    if (media && media.id) {
      this.player.setMedia(media);
    } else {
      this.player.setupMedia(mediaId);
    }

    // Set default begin time
    if (beginAt) {
      this.player.setBeginAt(beginAt);
    }

    // Set default open CC
    if (defaultOpenCC) {
      this.player.toggleCC();
    }

    // Setup the time range picker if it's allowed by user
    if (allowRangePicker && defaultOpenRangePicker) {
      this.player.toggleRange();
      if (range || defaultRange) {
        this.player.setRange(range || defaultRange);
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let {
      media,
      mediaId,
      triggerTime,
      allowTwoScreen,
      range
    } = this.props;

    // Setup media when the `media`/`mediaId` in props changes
    if (media !== prevProps.media && media.id) {
      this.player.setMedia(media);
    } else if (mediaId !== prevProps.mediaId) {
      this.player.setupMedia(mediaId);
    }

    // Setup media content when the `media` object was obtained
    media = this.state.media;
    if (prevState.media !== media && media.id) {
      const { videos, isTwoScreen, isUnavailable } = media;
      if (!isUnavailable) {
        this.setState({ src1: videos[0].srcPath1 });
        if (isTwoScreen) {
          this.setState({ src2: videos[0].srcPath2 });

          if (allowTwoScreen) {
            this.setState({ screenMode: Constants.SCREEN_NEST });
          }
        }

        this.player.setupTranscriptions(media);
      }
    }

    // Setup captions when the `currTranscription` changes
    const { currTranscription } = this.state;
    if (prevState.currTranscription !== currTranscription) {
      this.player.setupCaptions(currTranscription);
    }

    // Update current playback time when the `triggerTime` in props changes
    if (prevProps.triggerTime !== triggerTime) {
      this.player.setCurrentTime(triggerTime);
    }

    // Update time range when `range` in props changes
    if (prevProps.range !== range) {
      this.setRange(range);
    }
  }

  render() {
    const { fill, width, height, allowTwoScreen } = this.props;
    const { src2, isFullscreen, openRange } = this.state;

    const display2Screen = allowTwoScreen && Boolean(src2);
    const playerSize = getPlayerSize({ width, height, fill, isFullscreen });
    return (
      <div {...this.getContainerProps(playerSize)}>
        <div {...this.getPlayerProps(playerSize)}>
          <Video {...this.getVideo1Props()} />
          {
            display2Screen
            &&
            <Video {...this.getVideo2Props()} />
          }

          <Wrapper {...this.getWrapperProps(display2Screen)} />
        </div>

        {
          openRange
          &&
          <div {...this.getExtraProps(playerSize)}>
            <Range {...this.getRangeProps()} />
          </div>
        }
      </div>
    );
  }

  /**
   * @returns {Object} the props for player's container
   */
  getContainerProps(playerSize) {
    return {
      id: this.player.id,
      className: 'ctp ct-player-con',
      style: {
        width: playerSize.width,
        height: 'auto'
      },
    };
  }

  /**
   * @returns {Object} the props for player
   */
  getPlayerProps(playerSize) {
    const { fill, padded } = this.props;
    const { size } = this.state;
    return {
      id: `ct-player-${this.player.id}`,
      ref: this.player.registerPlayer,
      style: {
        width: playerSize.width,
        height: playerSize.height
      },
      className: cx('ctp', 'ct-player', size, { fill, padded }),
      tabIndex: '0'
    };
  }

  /**
   * @returns {Object} the props for video 1
   */
  getVideo1Props() {
    const { src1, screenMode, isSwappedScreen } = this.state;
    return {
      id: `v1-${this.player.id}`,
      src: src1,
      className: cx({ secondary: isSwappedScreen }, screenMode),
      getVideoNode: this.player.registerVideo1
    };
  }

  /**
   * @returns {Object} the props for video 2
   */
  getVideo2Props() {
    const { src2, screenMode, isSwappedScreen } = this.state;
    return {
      id: `v2-${this.player.id}`,
      src: src2,
      muted: true,
      className: cx({ secondary: !isSwappedScreen }, screenMode),
      getVideoNode: this.player.registerVideo2
    };
  }

  /**
   * @returns {Object} the props for wrapper component
   */
  getWrapperProps(display2Screen) {
    const { hideWrapperOnMouseLeave } = this.props;
    const {
      event,
      screenMode,
      videoReady,
      userReady,
      isEnded,
      isPaused,
      isFullscreen,
      duration,
      time,
      bufferedTime,
      muted,
      volume,
      playbackRate,
      openCC,
      ccFontSize,
      ccFontColor,
      ccOpacity,
      ccBackgroundColor,
      language,
      currCaption,
    } = this.state;

    return {
      media: this.state.media,
      player: this.player,
      event,
      isTwoScreen: display2Screen,
      screenMode,
      videoReady,
      userReady,
      isEnded,
      isPaused,
      isFullscreen,
      duration,
      time,
      bufferedTime,
      muted,
      volume,
      playbackRate,
      openCC,
      ccFontSize,
      ccFontColor,
      ccOpacity,
      ccBackgroundColor,
      language,
      currCaption,
      hideWrapperOnMouseLeave,
    };
  }

  /**
   * @returns {Object} the props for the time range picker
   */
  getRangeProps() {
    const { duration, time, range } = this.state;
    return {
      id: `range-${this.player.id}`,
      duration,
      time,
      range,
      onRangeChange: this.setRange,
      onPlayRange: this.player.playRange
    };
  }

  /**
   * @returns {Object} the props for the extra area
   */
  getExtraProps(playerSize) {
    return {
      id: `ct-player-extra-${this.player.id}`,
      className: 'ctp ct-player-extra',
      style: {
        width: playerSize.width,
        height: 'auto'
      }
    };
  }
}

const numOrStr = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);
Player.propTypes = {
  /** An unique id for the player */
  id: PropTypes.string,

  /** The media's id used to get media data */
  mediaId: PropTypes.string,

  /** The media object */
  media: PropTypes.object,

  /** The player can fill it's container */
  fill: PropTypes.bool,

  /** The width of the player in pixel */
  width: numOrStr,

  /** The width of the player in pixel */
  height: numOrStr,

  /** Set true if you don't want the control bars to overlay on the video */
  padded: PropTypes.bool,

  /** The player supports two screen mode */
  allowTwoScreen: PropTypes.bool,

  /** Set the default begin time for the video */
  beginAt: PropTypes.number,

  /** Set the current time of the video */
  triggerTime: PropTypes.number,

  /** The player supports the closed captions */
  defaultOpenCC: PropTypes.bool,

  /** Hide the overlayed wrapper when mouse leaving */
  hideWrapperOnMouseLeave: PropTypes.bool,

  // Range picker
  /** The player supports time range picker */
  allowRangePicker: PropTypes.bool,

  /** Open the range picker when the player rendered */
  defaultOpenRangePicker: PropTypes.bool,

  /** Set the default time range */
  defaultRange: PropTypes.arrayOf(numOrStr),

  /** Set the current range */
  range: PropTypes.arrayOf(numOrStr),

  /** Callback function when the range changes */
  onRangePicked: PropTypes.func
};

export default Player;