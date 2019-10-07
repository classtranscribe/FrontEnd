import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon, Popup, Button } from 'semantic-ui-react'
import { Poster, ClassTranscribeFooter } from 'components'
import { util, api } from 'utils'
import './index.css'

export function History({ watchHistory, state, removeWatchHistory }) {
  useEffect(() => {
    util.scrollToTop('.sp-content')
    util.links.title('History')
  }, [])
  
  const { offerings } = state

  return (
    <div className="watch-history">
      <div className="goback-container">
        <Link className="del-icon" to={util.links.home()}>
          <Icon name="chevron left" /> Back to Courses
        </Link>
      </div>
      <h1 className="watch-history-title">Watch History</h1>
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
      <ClassTranscribeFooter />
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