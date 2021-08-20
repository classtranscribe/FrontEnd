import React, { useEffect } from 'react';
// import { Route } from 'react';
import CTPlayer from 'components/CTPlayer';
import { uurl } from 'utils/use-url';
import { connect } from 'dva'
import { isIOS } from "react-device-detect";
import { Transcriptions } from './Components';
import {
  keydownControl, 
  // MENU_HIDE,
  // ERR_INVALID_MEDIA_ID,
} from './Utils';

function LiveTestWithRedux(props) {
    const { 
      dispatch, 
      isFullscreen,
      // menu,
      // openCC, 
      } = props
    const { videosrc, iframesrc = null, updating = false, captionSpeedUp = 0} = uurl.useSearch();

    dispatch({ type: 'watch/setUpdating', payload: updating});
    dispatch({ type: 'watch/setCaptionSpeedUp', payload: captionSpeedUp});

    const media = {
      isLive: true, 
      videos: [{
          useHls: true,
          srcPath1: videosrc,
          // srcPath1: 'https://klive.kaltura.com/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8?__hdnea__=st=1618984738~exp=1619071138~acl=/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8*~hmac=f2462a504f3b020d2be1862aaab876b93a77b1f8f682a757215e6a93cea8b898'
      }],
      mediaName: 'Live Meeting Cast', /* TODO: Pull out titles from somewhere, hls doesn't have titles */
  };

    useEffect(() => {
      keydownControl.addKeyDownListener(dispatch);
    }, [])

    useEffect(() => {
      if (media.isLive) {
        document.title = "BOT Meeting Live Stream";
      }
    }, [media])

    if (!videosrc) {
        return <>Need videosrc, iframesrc params</>
    }

    return (
      <div>
        {isFullscreen || isIOS  ? (<></>) : (<Transcriptions style={{zIndex: 2, height: '100%', position: "absolute"}} />)}
        <div style={{width: '100%', height: iframesrc ? '75%' : '100%', position: "absolute"}}>
          {isIOS ? 
        window.location.href = videosrc
          : <CTPlayer
              fill
              defaultOpenCC
              hideWrapperOnMouseLeave
              allowTwoScreen
              media={media}
          />
        }
        </div>
        {iframesrc && <iframe title="Embedded frame" src={iframesrc} style={{ border: 0, width: '25%', height: '25%' }} />}
      </div>
    );
}

export const LiveHLSPlayer = connect(({ loading, watch: { menu, error, isFullscreen } }) => ({
  menu, error, isFullscreen
}))(LiveTestWithRedux);
