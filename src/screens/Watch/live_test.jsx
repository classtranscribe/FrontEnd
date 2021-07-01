import React from 'react';
// import { useEffect } from 'react';
import CTPlayer from 'components/CTPlayer';
import { uurl } from 'utils/use-url';
import { Transcriptions } from './Components';

function LiveTest(_props) {
    // const {}
    const { videosrc, iframesrc = null } = uurl.useSearch();
    if (!videosrc) {
        return <>Need videosrc, iframesrc params</>
    }
    const media = {
        isLive: true, // if this source is live
        videos: [{
            useHls: true,
            srcPath1: videosrc,
            // srcPath1: 'https://klive.kaltura.com/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8?__hdnea__=st=1618984738~exp=1619071138~acl=/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8*~hmac=f2462a504f3b020d2be1862aaab876b93a77b1f8f682a757215e6a93cea8b898'
        }],
        mediaName: 'Live Meeting Cast', /* TODO: Pull out titles from somewhere, hls doesn't have titles */
    };
    // https://hls-js.netlify.app/demo/
    return (
      <>
        <Transcriptions style={{zIndex: 2, height: '100%', position: "absolute"}} />
        <div style={{width: '100%', height: iframesrc ? '75%' : '100%', zIndex: 1, position: "absolute"}}>

          <CTPlayer
            fill
            defaultOpenCC
            hideWrapperOnMouseLeave
            allowTwoScreen
            // allowScreenshot
            // onScreenshotCaptured={alert}
            media={media}
          />
        </div>
        {iframesrc && <iframe title="Embedded frame" src={iframesrc} style={{ border: 0, width: '25%', height: '25%' }} />}

      </>
    );
}

export default LiveTest;