import React from 'react'
import { VideoCard } from 'components'
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
  var fullNumber = null
  var courseName = 'loading...'
  if (offering.courses && offering.courses.length) {
    fullNumber = api.getFullNumber(offering.courses)
    courseName = offering.courses[0].courseName
  }
  return fullNumber ? (
    <VideoCard row dismissable
      name={mediaName}
      ratio={ratio}
      link={util.links.watch(fullNumber, mediaId, timeStamp)}
      description={<>{fullNumber}<br/>{courseName}</>}
      descriptionLink={util.links.offeringDetail(offeringId)}
      handleDismiss={() => removeWatchHistory(mediaId)}
      dismissPrompt="Remove from watch history"
    />
  ) : null
}