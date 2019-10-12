import React from 'react'
import { VideoCard } from 'components'
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
  var fullNumber = null
  var courseName = 'loading...'
  if (offering.courses && offering.courses.length) {
    fullNumber = api.getFullNumber(offering.courses)
    courseName = offering.courses[0].courseName
  }
  return fullNumber ? (
    <VideoCard square
      name={mediaName}
      link={util.links.watch(fullNumber, mediaId, timeStamp)}
      ratio={ratio}
      description={`${fullNumber} • ${courseName}`}
    />
  ) : null
}