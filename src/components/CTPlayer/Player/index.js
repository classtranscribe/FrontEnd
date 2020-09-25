import React from 'react';
import cx from 'classnames';
import { altEl, makeEl } from 'layout';
import {
  CTPlayerIDs,
  CTPlayerConstants as PConstants,
  initialState,
  PlayerStateManager,
  CTPlayerController
} from '../controllers';
import { _getPlayerSize } from '../controllers/helpers';
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

    // Initialize player states
    this.state = initialState;

    // Initialize player state manager
    this.setPlayerState = this.setPlayerState.bind(this);
    const stateManager = new PlayerStateManager(this.setPlayerState);

    // Initialize the player controller
    const { id } = props;
    this.player = new CTPlayerController(stateManager, id);
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
      endAt,
      defaultOpenCC,
      defaultPlaybackRate,
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

    if (endAt) {
      this.player.setEndAt(endAt);
    }

    // Set default open CC
    if (defaultOpenCC) {
      this.player.toggleCC();
    }

    if (typeof defaultPlaybackRate === 'number') {
      this.player.setPlaybackRate(defaultPlaybackRate);
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
      defaultLanguage,
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
            this.setState({ screenMode: PConstants.ScreenModeNested });
          }
        }

        this.player.setupTranscriptions(media, defaultLanguage);
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
    const { src2, isFullscreen, openRange, error } = this.state;

    const display2Screen = allowTwoScreen && Boolean(src2);
    const playerSize = _getPlayerSize({ width, height, fill, isFullscreen });

    const video1Element = altEl(Video, !error, this.getVideo1Props());
    const video2Element = altEl(Video, !error && display2Screen, this.getVideo2Props());
    const wrapperElement = makeEl(Wrapper, this.getWrapperProps(display2Screen));
    const rangeElement = altEl(Range, openRange, this.getRangeProps());
    
    return (
      <div {...this.getContainerProps(playerSize)}>
        <div {...this.getPlayerProps(playerSize)}>
          {video1Element}
          {video2Element}
          {wrapperElement}
        </div>

        {
          openRange
          &&
          <div {...this.getExtraProps(playerSize)}>
            {rangeElement}
          </div>
        }
      </div>
    );
  }

  /**
   * @returns {Object} the props for player's container
   */
  getContainerProps(playerSize) {
    const { fill } = this.props;
    return {
      id: CTPlayerIDs.playerOuterContainerID(this.player.id),
      className: 'ctp ct-player-con',
      style: {
        width: playerSize.width,
        height: fill ? '100%' : 'auto'
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
      id: CTPlayerIDs.playerInnerContainerID(this.player.id),
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
      id: CTPlayerIDs.video1ID(this.player.id),
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
      id: CTPlayerIDs.video2ID(this.player.id),
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
    const { 
      beginAt,
      endAt,
      hideWrapperOnMouseLeave 
    } = this.props;
    const {
      error,
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
      ccStyle,
      language,
      currCaption,
    } = this.state;

    return {
      error,
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
      beginAt,
      endAt,
      duration,
      time,
      bufferedTime,
      muted,
      volume,
      playbackRate,
      openCC,
      ccStyle,
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
      id: CTPlayerIDs.rangeContainerID(this.player.id),
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
      id: CTPlayerIDs.extraPanelID(this.player.id),
      className: 'ctp ct-player-extra',
      style: {
        width: playerSize.width,
        height: 'auto'
      }
    };
  }
}

export default Player;