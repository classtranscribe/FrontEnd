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
  dark=false,
  id=null,
  name='Loading...', 

  history,
  link=window.location.pathname,  
  mediaState=null,
  handleLinkClick=null,

  ratio=0,
  timeStamp=0,
  isUnavailable=false,
  description=null,
  descriptionLink=null,
  descriptionState=null,
  posterSize="",
  fittedNameSize=56,
  // buttons
  dismissable=false,
  handleDismiss,
  dismissPrompt,
}) {
  const fittedName = util.getFittedName(name, fittedNameSize)

  const handleClick = () => {
      if ($('.description-link:focus').length > 0) return;
      history.push(link, mediaState)
      if (Boolean(handleLinkClick)) {
        handleLinkClick()
      } 
    }

  if (square) return (
    <div className="video-card-container-square" unavailable={isUnavailable.toString()} dark={dark.toString()}>
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
    <div className="video-card-container-row" unavailable={isUnavailable.toString()} dark={dark.toString()}>
      <button
        id={id}
        className="video-card plain-btn" 
        onClick={handleClick}
        aria-label={`Watch video ${name}`}
      >
        <Poster progress={ratio} width={posterSize} />
        <div className="media-info">
          <p className="media-name">{fittedNameSize === 56 ? name : fittedName}</p>
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