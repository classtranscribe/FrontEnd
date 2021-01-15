/**
 * The Player which supports different screen modes
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { uurl } from 'utils/use-url';
import PlayerData from '../../player'
import Video from './player'
import { connect } from 'dva'
import {
  videoControl as control,
  PRIMARY,
  SECONDARY,
  PS_MODE,
  NESTED_MODE,
} from '../../Utils';
import './index.css';
import './playerModes.css';
const videoRef1 = (node) => PlayerData.video1 = node;
const videoRef2 = (node) => PlayerData.video2 = node;
const ClassTranscribePlayerNew = (props) => {
  const { watch, playerpref, dispatch } = props;
  const { transView } = playerpref;
  const { media, mode, isSwitched, isFullscreen } = watch;
  const { videos, isTwoScreen } = media;
  const { srcPath1, srcPath2 } = videos[0] || {};
  console.log('CT Player, render');
  useEffect(() => {
    PlayerData.param = {};
    console.log('PlayerData Updated')
  }, [srcPath1, srcPath2]);
  const player1Position = isSwitched ? SECONDARY : PRIMARY;
  const player2Position = isSwitched ? PRIMARY : SECONDARY;
  const handlePause = (position) => () => {
    if (position === PRIMARY) {
      control.handlePause();
    }
  };
  if (isTwoScreen && !isMobile) {
    // setMode(window.innerWidth <= 900 ? NESTED_MODE : PS_MODE);
  }

  return (
    <>
      <div
        className={`ct-video-row ${player1Position}`}
        mode={mode}
        data-trans-view={transView}
        data-fullscreen={isFullscreen}
      >
        <Video id={1} videoRef={videoRef1} dispatch={dispatch} path={srcPath1} />
      </div>
      {isTwoScreen && (
        <div
          className={`ct-video-row ${player2Position}`}
          mode={mode}
          data-trans-view={transView}
          data-fullscreen={isFullscreen}
        >
          <Video id={2} videoRef={videoRef2} dispatch={dispatch} path={srcPath2} />
        </div>
      )}
    </>
  );
};

export const ClassTranscribePlayer = connect(({ watch, playerpref, loading }) => ({
  watch, playerpref
}))(ClassTranscribePlayerNew);
