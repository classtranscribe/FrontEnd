import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { initialState, CTPlayerController } from '../controllers';
import Video from '../Video';
import Wrapper from '../Wrapper';
import './index.scss';

export class Player extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
    this.setPlayerState = this.setPlayerState.bind(this);

    this.player = new CTPlayerController(this.setPlayerState);
  }

  setPlayerState(key, value) {
    this.setState({ [key]: value });
  }

  componentDidMount() {
    const { mediaId, media } = this.props;
    if (media && media.id) {
      this.player.setMedia(media);
    } else {
      this.player.setupMedia(mediaId);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    let { media, mediaId } = this.props;

    if (media !== prevProps.media && media.id) {
      this.player.setMedia(media);
    } else if (mediaId !== prevProps.mediaId) {
      this.player.setupMedia(mediaId);
    }

    media = this.state.media;
    if (prevState.media !== media && media.id) {
      const { videos, isTwoScreen, isUnavailable } = media;
      if (!isUnavailable) {
        this.setState({ src1: videos[0].srcPath1 });
        if (isTwoScreen) {
          this.setState({ src2: videos[0].srcPath2 });
        }

        this.player.setupTranscriptions(media);
      }
    }

    const { currTranscription } = this.state;
    if (prevState.currTranscription !== currTranscription) {
      this.player.setupCaptions(currTranscription);
    }
  }

  render() {
    let {
      id,
      mediaId,
      media,
      fill = false,
      width,
      height,
      beginAt,
      //
      allowTwoScreen = false,
      // Range picker
      allowRangePicker = false,
      defaultRange,
      range,
      onRangePicked,
    } = this.props;

    const {
      src1,
      isEnded,
      isPaused,
      isFullscreen,
      isSwitchedScreen,
      openCC,
      duration,
      time,
      bufferedTime,
      muted,
      volume,
      playbackRate,
    } = this.state;

    const playerProps = {
      id,
      style: {
        width: width || '560px',
        height: height || 'max-content'
      },
      className: cx('ctp', 'ct-player', { fill })
    };

    const video1Props = {
      id: id ? `v1-${id}` : null,
      src: src1,
      className: isSwitchedScreen ? 'secondary' : 'primary',
      player: this.player,
      getVideoNode: this.player.registerVideo1
    };

    const wrapperProps = {
      media: this.state.media,
      player: this.player,
      isEnded,
      isPaused,
      isFullscreen,
      openCC,
      duration,
      time,
      bufferedTime,
      muted,
      volume,
      playbackRate,
      allowRangePicker,
      range,
      defaultRange,
      onRangePicked,
    };
  
    return (
      <div {...playerProps}>
        <Video {...video1Props} />
        <Wrapper {...wrapperProps} />
      </div>
    );
  }
}

const numOrStr = PropTypes.oneOfType(PropTypes.string, PropTypes.number);
Player.propTypes = {
  id: PropTypes.string,
  mediaId: PropTypes.string,
  media: PropTypes.object,
  fill: PropTypes.bool,
  width: numOrStr,
  height: numOrStr,
  allowTwoScreen: PropTypes.bool,
  beginAt: numOrStr,
  // Range picker
  allowRangePicker: PropTypes.bool,
  defaultRange: PropTypes.arrayOf(numOrStr),
  range: PropTypes.arrayOf(numOrStr),
  onRangePicked: PropTypes.func,
};

