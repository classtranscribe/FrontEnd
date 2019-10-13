import React from 'react'
import $ from 'jquery'
import { Link, withRouter } from 'react-router-dom'
import { Poster } from '../Poster'
import { Button, Popup } from 'semantic-ui-react'
import { util } from '../../utils'
import './VideoCard.css'

function VideoCardWithOutRouter({ 
  square=false,
  row=false,
  name='Loading...', 
  history,
  link=window.location.pathname,  
  mediaState={},
  ratio=0,
  timeStamp=0,
  description=null,
  descriptionLink=null,
  descriptionState=null,
  posterSize="",
  // buttons
  dismissable=false,
  handleDismiss,
  dismissPrompt
}) {
  const fittedName = util.getFittedName(name, 56)

  const handleClick = () => {
    if ($('.description-link:focus').length > 0) return;
    history.push(link, mediaState)
  }

  if (square) return (
    <div className="video-card-container-square">
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
    <div className="video-card-container-row">
      <button
        className="video-card plain-btn" 
        onClick={handleClick}
        aria-label={`Watch video ${name}`}
      >
        <Poster progress={ratio} width={posterSize} />
        <div className="media-info">
          <p className="media-name">{name}</p>
          {!descriptionLink && <p className="description text-muted">{description}</p>}
          {descriptionLink && <Link className="description-link plain-btn" to={{pathname: descriptionLink, state: descriptionState}}>{description}</Link>}
        </div>
      </button>
      {dismissable && <DismissButton handleDismiss={handleDismiss} dismissPrompt={dismissPrompt} />}
    </div>
  )
}

function DismissButton({ handleDismiss, dismissPrompt }) {
  return (
    <Popup 
      content={dismissPrompt}
      position="left center"
      inverted
      openOnTriggerFocus
      closeOnTriggerBlur
      trigger={
        <Button type="dismiss" compact onClick={handleDismiss} aria-label={dismissPrompt}>
          <span tabIndex="-1">
            <i className="material-icons">close</i>
          </span>
        </Button>
      }
    />
  )
}

export const VideoCard = withRouter(VideoCardWithOutRouter)