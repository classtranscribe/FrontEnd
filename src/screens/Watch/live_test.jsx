import React, { useEffect } from 'react';
import CTPlayer from 'components/CTPlayer';

function LiveTest() {
    const media = {
        // isLive: true, // if this source is live
        videos: [{
            useHls: true,
            srcPath1: 'https://klive.kaltura.com/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8?__hdnea__=st=1619386746~exp=1619473146~acl=/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8*~hmac=7cc6ceb5708c7a3bdff5026c36a1e2cd4fe120f49158fe7152d0477688b7f550'
            // srcPath1: 'https://klive.kaltura.com/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8?__hdnea__=st=1618984738~exp=1619071138~acl=/s/dc-1/live/hls/p/1359391/e/1_23mx1syi/sd/6000/t/5cWuUSMATwMSDUQSIdCbnw/index-s32.m3u8*~hmac=f2462a504f3b020d2be1862aaab876b93a77b1f8f682a757215e6a93cea8b898'
        }]
    };
    // https://hls-js.netlify.app/demo/
    return <>
        <CTPlayer
            fill
            defaultOpenCC
            hideWrapperOnMouseLeave
            allowTwoScreen
            allowScreenshot
            // onScreenshotCaptured={alert}
            media={media}
        />
    </>
}

export default LiveTest;