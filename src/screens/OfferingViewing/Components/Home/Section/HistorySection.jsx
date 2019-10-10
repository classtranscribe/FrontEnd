import React from 'react'
import { Link } from 'react-router-dom'
import { Poster } from 'components'
import { util, api } from 'utils'
import { OfferingListHolder } from '../PlaceHolder'

export default function HistorySection({ offerings, watchHistory }) {
  return (
    <div className="offerings" id="starred-offerings">
      {
        watchHistory[0] === 'unloaded' ? 
        <OfferingListHolder row={1} />
        :
        watchHistory.map( (media, index) =>  (
          <MediaCard key={media.mediaId + index} media={media} offerings={offerings} />
        ))
      }
    </div>
  )
}

function MediaCard({ media, offerings }) {
  const { offeringId, mediaName, ratio, mediaId, timeStamp } = media
  const offering = offerings.filter(offering => offering.id === offeringId)[0] || { courses: [] }
  var fullNumber = 'loading...'
  var courseName = 'loading...'
  if (offering.courses && offering.courses.length) {
    fullNumber = api.getFullNumber(offering.courses)
    courseName = offering.courses[0].courseName
  }
  return (
    <div className="media-card-container">
      <Link 
        className="media-card" 
        to={util.links.watch(fullNumber, mediaId, timeStamp)} 
        aria-label={`Continue watch video ${mediaName}`}
      >
        <Poster progress={ratio} width="220px" />
        <div className="media-info">
          <p className="media-name">{mediaName}</p>
          <p className="offering-num text-muted">{fullNumber} • {courseName}</p>
        </div>
      </Link>
    </div>
  )
}