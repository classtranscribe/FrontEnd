/**
 * The Player which supports different screen modes
 */

 import React, { useCallback, useRef, useEffect } from 'react';
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
   getVideoStyle
 } from '../../Utils';
 import './index.scss';
 import './playerModes.css';
 
 const videoRef1 = (node) => { PlayerData.video1 = node };
 const videoRef2 = (node) => { PlayerData.video2 = node };
 const ClassTranscribePlayerNew = (props) => {
   const { dispatch } = props;
   const { transView, muted, volume, playbackrate, openCC, brightness, contrast, rotateColor, invert, scale,magnifyX, magnifyY } = props;
   const { media = {}, mode, isSwitched, isFullscreen, embedded } = props;
   const { videos = [], isTwoScreen } = media;
   const { srcPath1, srcPath2, useHls = false } = videos[0] || {};
   // Mute Handler
   useEffect(() => {
     PlayerData.video1 && (PlayerData.video1.muted = muted);
     PlayerData.video2 && (PlayerData.video2.muted = true);
   }, [muted]);
   // Volume Handler
   useEffect(() => {
     PlayerData.video1 && (PlayerData.video1.volume = volume);
     PlayerData.video2 && (PlayerData.video2.volume = volume);
   }, [volume]);
   // Playbackrate Handler
   useEffect(() => {
     PlayerData.video1 && (PlayerData.video1.playbackRate = playbackrate);
     PlayerData.video2 && (PlayerData.video2.playbackRate = playbackrate);
   }, [playbackrate]);
 
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
   }, [srcPath1, srcPath2]);
   const player1Position = isSwitched ? SECONDARY : PRIMARY;
   const player2Position = isSwitched ? PRIMARY : SECONDARY;
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
     videoStyle
   }
   useEffect(() => {
     if(window.hls) {
         window.hls.subtitleTrack = openCC ? 0: -1
     }
 }, [openCC])
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
           />
         </div>
       )}
     </>
   );
 };
 
 export const ClassTranscribePlayer = connect(({ watch: {
   media, mode, isSwitched, isFullscreen, embedded
 }, playerpref: {
   transView, muted, volume, playbackrate, openCC,
   brightness, contrast, rotateColor, invert,
   scale, magnifyX, magnifyY
 }, loading }) => ({
   media, mode, isSwitched, isFullscreen, embedded, transView, muted, volume, playbackrate, openCC, 
   brightness, contrast, rotateColor, invert,
   scale, magnifyX, magnifyY
 }))(ClassTranscribePlayerNew);