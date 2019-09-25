import React from 'react'
import './index.css'
const defaultImg = require('../../images/Video-Placeholder.jpg')

export function Poster({ src=defaultImg, progress=0, borderRadius=false, width }) {
  return (
    <div className="video-poster" style={{width}}>
      <img 
        className={`poster-img ${borderRadius ? 'with-br' : ''}`} 
        style={{width}}
        src={src} 
        alt="video poster"
      />
      <div className="progress-bar">
        <div className="progress" style={{width: `${progress}%`}}></div>
      </div>
    </div>
  )
}