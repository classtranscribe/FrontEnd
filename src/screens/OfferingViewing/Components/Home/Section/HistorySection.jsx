import React from 'react'
import { Poster } from 'components'

export default function HistorySection({ offerings, state }) {
  const { watchHistory } = state
  return (
    <div className={`offerings ${showAll ? 'offerings-show-all' : ''}`} id="starred-offerings">
      {watchHistory.map( media =>  (
        <MediaCard media={media} offerings={offerings} />
      ))}
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
  return <div></div>
}