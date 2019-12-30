import React from 'react'
import './index.css'
import { videoPosterImg as defaultImg } from '../../images'

export function Poster({ 
  src=defaultImg, 
  progress=0, 
  borderRadius=false, 
  width, 
  round=false
}) {
  return (
    <div 
      className="video-poster" 
      style={{width}} 
      aria-hidden="true" 
      data-round={round.toString()}
    >
      <img 
        className={`poster-img ${borderRadius ? 'with-br' : ''}`} 
        style={{width}}
        src={src} 
        alt="video poster"
      />
      {
        progress > 0 && 
        <div className="progress-bar">
          <div className="progress" style={{width: `${progress}%`}} />
        </div>
      }
    </div>
  )
}