/**
 * The Content of the Watch page
 * - including Players, settingbar, and transcription window
 */

import React, { useState, useEffect } from 'react'
// UI
import ClassTranscribePlayer from './ClassTranscribePlayer'
import SubHeader from './SubHeader'
import './index.css'
// Vars
import { NORMAL_MODE, PS_MODE, /* EQUAL_MODE, NESTED_MODE */ } from './constants'


export function WatchContent({ media, playlist, courseNumber }) {
  /** The state for switch primary-secondary screens used as a className */
  const [orderClassName, setOrderClassName] = useState('') // '' or 'switch-player' only
  /** True if the first player is the primary player */
  const [primary, setPrimary] = useState(true)
  /** Current screen mode */ 
  const [mode, setMode] = useState(NORMAL_MODE)

  /**
   * Change the mode based on the # of videos
   */
  useEffect(() => {
    console.log('media', media) 
  }, [media])

  /**
   * Change the order of videos if primary player switched
   */
  useEffect(() => {
    const name = primary ? '' : 'switch-player'
    setOrderClassName(() => name)
  }, [primary])

  /**
   * Set mode to PS_MODE if is two-screen
   */
  useEffect(() => {
    if (media.isTwoScreen) setMode(() => PS_MODE)
  }, [media])

  /** Values for synchronizing two players */
  const [play, setPlay] = useState(false)
  const [currTime, setCurrTime] = useState(-1)
  const [playbackRate, setPlaybackRate] = useState(-1)
  const [trackSrc, setTrackSrc] = useState('')

  /** Functions for handle two-player events */
  const handleFunctions = {
    // Switching events
    switchScreen: () => setPrimary(() => !primary),
    switchToPrimary: () => setPrimary(() => true),
    switchToSecondary: () => setPrimary(() => false),
    // Sync events
    syncPlay: () => setPlay(() => true),
    syncPause: () => setPlay(() => false),
    setCurrTime: currTime => setCurrTime(() => currTime),
    setPlaybackRate: rate => setPlaybackRate(() => rate),
    setTrackSrc: src => setTrackSrc(() => src),
    setMode: mode => setMode(() => mode),
  }

  // Variables that will pass into the video setting bar
  const propsForSettingBar = {
    ...handleFunctions,
    mode: mode,
    show: media.isTwoScreen,
  }

  return (
    <div className="watch-content">
      <SubHeader 
        media={media} 
        playlist={playlist} 
        courseNumber={courseNumber} 
        propsForSettingBar={propsForSettingBar}
      />

      <div className={`player-container ${orderClassName}`}>
        <div className="video-col">
          <ClassTranscribePlayer 
            {...handleFunctions}
            media={media} 
            mode={mode}
            primary={primary} 
            play={play} 
            currTime={currTime} 
            trackSrc={trackSrc} 
            playbackRate={playbackRate}
            video1
          />
        </div>

        <div className="video-col" >
          <ClassTranscribePlayer 
            {...handleFunctions}
            media={media}
            mode={mode}
            primary={!primary}  
            play={play} 
            currTime={currTime} 
            trackSrc={trackSrc} 
            playbackRate={playbackRate}
          />
        </div>
      </div>
    </div>
  )
}