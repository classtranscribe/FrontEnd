import React from 'react'
import $ from 'jquery'
import { Link, withRouter } from 'react-router-dom'
import { Poster } from '../../Poster'
import { DismissButton } from './VideoCard.Overlays'
import { util } from '../../../utils'
import './index.css'

function VideoCardWithOutRouter({ 
  square=false,
  row=false,
  name='Loading...', 

  history,
  link=window.location.pathname,  
  mediaState=null,

  ratio=0,
  timeStamp=0,
  isUnavailable=false,
  description=null,
  descriptionLink=null,
  descriptionState=null,
  posterSize="",
  // buttons
  dismissable=false,
  handleDismiss,
  dismissPrompt,
}) {
  const fittedName = util.getFittedName(name, 56)

  const handleClick = () => {
    if ($('.description-link:focus').length > 0) return;
    history.push(link, mediaState)
  }

  if (square) return (
    <div className="video-card-container-square" unavailable={isUnavailable.toString()}>
      <button 
        className="video-card plain-btn" 
        onClick={handleClick}
        aria-label={`Watch video ${name}`}
      >
        <Poster progress={ratio} width="220px" />
        <div className="media-info">
          <p className="video-name">{fittedName}</p>
          {!descriptionLink && <p className="description text-muted">{description}</p>}
          {descriptionLink && <Link className="description-link plain-btn" to={{pathname: descriptionLink, state: descriptionState}}>{description}</Link>}
        </div>
      </button>
    </div>
  )

  if (row) return (
    <div className="video-card-container-row" unavailable={isUnavailable.toString()}>
      <button
        className="video-card plain-btn" 
        onClick={handleClick}
        aria-label={`Watch video ${name}`}
      >
        <Poster progress={ratio} width={posterSize} />
        <div className="media-info">
          <p className="media-name">{name}</p>
          {isUnavailable && <p className="description text-muted">Sorry this video is currently unavailable.</p>}
          {!descriptionLink && <p className="description text-muted">{description}</p>}
          {descriptionLink && <Link className="description-link plain-btn" to={{pathname: descriptionLink, state: descriptionState}}>{description}</Link>}
        </div>
      </button>
      {dismissable && <DismissButton handleDismiss={handleDismiss} dismissPrompt={dismissPrompt} />}
    </div>
  )
}



export const VideoCard = withRouter(VideoCardWithOutRouter)