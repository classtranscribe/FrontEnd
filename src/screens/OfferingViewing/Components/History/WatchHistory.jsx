import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Popup, Button } from 'semantic-ui-react'
import { Poster } from 'components'
import { util, api } from 'utils'

export default function WatchHistory({ watchHistory, offerings, removeWatchHistory }) {

  return (
    <div className="watch-history">
      <h1 className="history-title">Watch History</h1>
      {watchHistory.length === 0 ?
        <div>None</div> :
        watchHistory[0] === 'unloaded' ?
        <div>Loading...</div> :
        watchHistory.map(media => (
          <MediaItem 
            key={'watchhistory-' + media.mediaId} 
            media={media} 
            offerings={offerings} 
            removeWatchHistory={removeWatchHistory}
          />
        ))
      }
    </div>
  )
}

function MediaItem({ media, offerings, removeWatchHistory }) {
  const { offeringId, mediaName, ratio, mediaId, timeStamp } = media
  const offering = offerings.filter(offering => offering.id === offeringId)[0] || { courses: [] }
  var fullNumber = 'loading...'
  var courseName = 'loading...'
  if (offering.courses && offering.courses.length) {
    fullNumber = api.getFullNumber(offering.courses)
    courseName = offering.courses[0].courseName
  }
  return (
    <div className="watch-history-item-con">
      <Link className="watch-history-item" to={util.links.watch(fullNumber, mediaId, timeStamp)}>
        <Poster progress={ratio} />
        <div className="media-info">
          <p className="media-name">{mediaName}</p>
          <p className="offering-num">
            {fullNumber}<br/>
            {courseName}
          </p>
        </div>
      </Link>
      <WatchHistoryCloseButton handleClose={() => removeWatchHistory(mediaId)} />
    </div>
  )
}

function WatchHistoryCloseButton({ handleClose }) {
  return (
    <Popup 
      content="Remove from watch history"
      position="left center"
      inverted
      openOnTriggerFocus
      closeOnTriggerBlur
      trigger={
        <Button type="remove-history" compact onClick={handleClose} aria-label="Remove from watch history">
          <span tabIndex="-1">
            <i className="material-icons">close</i>
          </span>
        </Button>
      }
    />
  )
}