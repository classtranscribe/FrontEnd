import React from 'react'
import { VideoCard } from '../../../../../components'
import { util } from '../../../../../utils'
import { OfferingListHolder } from '../PlaceHolder'

export default function HistorySection({ offerings, watchHistory }) {
  return (
    <div className="offerings" id="starred-offerings">
      {
        watchHistory[0] === 'unloaded' ? 
        <OfferingListHolder row={1} title={false} width="220px" />
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
  const { fullNumber, courseName } = offering
  return fullNumber ? (
    <VideoCard square
      name={mediaName}
      link={util.links.watch(mediaId, { begin: timeStamp })}
      ratio={ratio}
      description={`${fullNumber} • ${courseName}`}
      descriptionLink={util.links.offeringDetail(offeringId)}
    />
  ) : null
}