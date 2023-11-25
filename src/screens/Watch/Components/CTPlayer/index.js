/* eslint-disable no-console */
/**
 * The Player which supports different screen modes
 */

 import React, { useEffect, useState } from 'react';
 // import Draggable from 'react-draggable';
 import { useSpeechSynthesis } from 'react-speech-kit';

 import { connect } from 'dva'
 import { isMobile } from 'react-device-detect';
 
 import PlayerData from '../../player'
 import Video from './player'
 import VideoHls from './player_hls'
 import {
   PRIMARY,
   SECONDARY,
   PS_MODE,
   NESTED_MODE,
   // ASL_CORNER_MODE,
   ASL_PRIMARY,
   getVideoStyle,
   // THEATRE_MODE,
   // NORMAL_MODE
 } from '../../Utils';
 import './index.scss';
 import './playerModes.css';
 
 const videoRef1 = (node) => { PlayerData.video1 = node; };
 const videoRef2 = (node) => { PlayerData.video2 = node; };
 const videoRef3 = (node) => { PlayerData.aslVideo = node; };
 
 
 const ClassTranscribePlayerNew = (props) => {
   const { dispatch } = props;
   const { aslCorner, transView, muted, volume, playbackrate, openCC, brightness, contrast, rotateColor, invert, scale,magnifyX, magnifyY } = props;
   const { media = {}, mode, isSwitched, isFullscreen, embedded } = props;
   const { videos = [], isTwoScreen } = media;
   const { srcPath1, srcPath2, aslPath, useHls = false } = videos[0] || {};
   const [videoPlaybackReady, setPlaybackReady] = useState(0); // dont need redux for this state
   const bumpPlayerReady = () => { setPlaybackReady(videoPlaybackReady + 1); }
   const { speak, supported, voices } = useSpeechSynthesis()

   
   // Mute Handler
   useEffect(() => {
     PlayerData.video1 && (PlayerData.video1.muted = muted);
     PlayerData.video2 && (PlayerData.video2.muted = true);
   }, [muted,videoPlaybackReady]);
   // Volume Handler
   useEffect(() => {
     PlayerData.video1 && (PlayerData.video1.volume = volume);
     PlayerData.video2 && (PlayerData.video2.volume = volume);
   }, [volume,videoPlaybackReady]);
   // Playbackrate Handler
   useEffect(() => {
     PlayerData.video1 && (PlayerData.video1.playbackRate = playbackrate);
     PlayerData.video2 && (PlayerData.video2.playbackRate = playbackrate);
     PlayerData.aslVideo && (PlayerData.aslVideo.playbackRate = playbackrate);
   }, [playbackrate,videoPlaybackReady]);
 
   // liveMode speed
   useEffect(() => {
     PlayerData.param = {};
     if (PlayerData.video1) {
       PlayerData.video1.pause()
       PlayerData.video1.load()
     }
     if (PlayerData.video2) {
       PlayerData.video2.pause();
       PlayerData.video2.load()
     }
     if (PlayerData.aslVideo) {
      PlayerData.aslVideo.pause();
      PlayerData.aslVideo.load()
    }
   }, [srcPath1, srcPath2, aslPath]);
   const player1Position = isSwitched ? SECONDARY : PRIMARY;
   const player2Position = isSwitched ? PRIMARY : SECONDARY;
   const player3Position = ASL_PRIMARY;
   
   const { videoStyle } = getVideoStyle({brightness, contrast, rotateColor, invert, scale, magnifyX, magnifyY});
 
   useEffect(() => {
     if (isTwoScreen && !isMobile) {
       dispatch({ type: 'watch/setMode', payload: window.innerWidth <= 900 ? NESTED_MODE : PS_MODE })
     }
   }, [isTwoScreen])
 
   const media1Prop = {
     id: 1,
     videoRef: videoRef1,
     dispatch,
     path: srcPath1,
     isSwitched,
     embedded,
     openCC,
     videoStyle,
     playerReady: bumpPlayerReady
   }
   useEffect(() => {
     if(window.hls) {
         window.hls.subtitleTrack = openCC ? 0: -1
     }
 }, [openCC,videoPlaybackReady])
   return (
     <>
       <div
         id='ct-video-con-div'
         className={embedded ? 'ctp ct-video-con' : `ct-video-row ${player1Position}`}
         mode={mode}
         data-trans-view={transView}
         data-fullscreen={isFullscreen}
        //  style={videoStyle}
       >
         {
           useHls ? <VideoHls
             {...media1Prop}
           /> : <Video
             {...media1Prop}
           />
         }
         {/* <Video
             id={1}
             videoRef={videoRef1}
             dispatch={dispatch}
             path={srcPath1}
             isSwitched={isSwitched}
             embedded={embedded}
             style={videoStyle}
           /> */}
         <div
           id='ct-video-con-div'
           className={embedded ? 'ctp ct-video-con' : `ct-video-row ${player3Position+aslCorner}`}
         >
           {aslPath && <Video
             id={3}
             videoRef={videoRef3}
             dispatch={dispatch}
             path={aslPath}
             embedded={embedded}
             muted='true'
             playerReady={bumpPlayerReady}
           />}
         </div>
       </div>
       {isTwoScreen && (
         <div
           id='ct-video-con-div'
           className={embedded ? 'ctp ct-video-con' : `ct-video-row ${player2Position}`}
           mode={mode}
           data-trans-view={transView}
           data-fullscreen={isFullscreen}
          //  style={videoStyle}

         >
           <Video
             id={2}
             videoRef={videoRef2}
             dispatch={dispatch}
             path={srcPath2}
             isSwitched={isSwitched}
             embedded={embedded}
             playerReady={bumpPlayerReady}
           />
         </div>
       )}
       {/* see playerModes.css */}
       
       
       
     </>
   );
 };
 
 export const ClassTranscribePlayer = connect(({ watch: {
   media, mode, isSwitched, isFullscreen, embedded
 }, playerpref: {
   transView, muted, volume, playbackrate, openCC,
   brightness, contrast, rotateColor, invert,

   scale, magnifyX, magnifyY, aslCorner,
   description, ADVolume, ADSpeed
 }, loading }) => ({
   media, mode, isSwitched, isFullscreen, embedded, transView, muted, volume, playbackrate, openCC, 
   brightness, contrast, rotateColor, invert,
   scale, magnifyX, magnifyY,aslCorner,
   description, ADVolume, ADSpeed
 }))(ClassTranscribePlayerNew);