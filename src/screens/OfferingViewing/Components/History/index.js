import React from 'react'
import { Link } from 'react-router-dom'
import { Poster, ClassTranscribeFooter } from 'components'
import { util, api } from 'utils'
import './index.css'

export function History({ watchHistory, state }) {
  const { offerings } = state

  return (
    <div className="watch-history">
      <h1 className="watch-history-title">Watch History</h1>
      {watchHistory.length === 0 ?
        <div>None</div> :
        watchHistory[0] === 'unloaded' ?
        <div>Loading...</div> :
        watchHistory.map(media => (
          <MediaItem key={'watchhistory-' + media.mediaId} media={media} offerings={offerings} />
        ))
      }
      <ClassTranscribeFooter />
    </div>
  )
}

function MediaItem({ media, offerings }) {
  const { offeringId, mediaName, ratio, mediaId, timeStamp } = media
  const offering = offerings.filter(offering => offering.id === offeringId)[0] || { courses: [] }
  var fullNumber = 'loading...'
  var courseName = 'loading...'
  if (offering.courses && offering.courses.length) {
    fullNumber = api.getFullNumber(offering.courses)
    courseName = offering.courses[0].courseName
  }
  return (
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
  )
}