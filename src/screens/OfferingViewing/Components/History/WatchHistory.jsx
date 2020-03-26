import React from 'react'
import { VideoCard, VideoCardPlaceHolder } from '../../../../components'
import { util } from '../../../../utils'

export default function WatchHistory({ watchHistory, offerings, removeWatchHistory }) {

  return (
    <div className="watch-history">
      <h2 className="history-title">Watch History</h2>
      {watchHistory.length === 0 || offerings[0] === 'retry'  ?
        <div>None</div> :
        watchHistory[0] === 'unloaded' || offerings[0] === 'Unloaded' ?
        <VideoCardPlaceHolder row={4} posterSize="10px" /> :
        <div role="list" className="ct-list-col">
          {watchHistory.map(media => (
            <MediaItem 
              key={'watchhistory-' + media.mediaId} 
              media={media} 
              offerings={offerings} 
              removeWatchHistory={removeWatchHistory}
            />
          ))}
        </div>
      }
    </div>
  )
}

function MediaItem({ media, offerings, removeWatchHistory }) {
  const { offeringId, mediaName, ratio, mediaId, timeStamp } = media
  const offering = offerings.filter(offering => offering.id === offeringId)[0] || { }
  const { fullNumber, courseName } = offering
  return fullNumber ? (
    <VideoCard row dismissable
      name={mediaName}
      ratio={ratio}
      role="listitem"
      link={util.links.watch(mediaId, { begin: timeStamp })}
      description={`${fullNumber} • ${courseName}`}
      descriptionLink={util.links.offeringDetail(offeringId)}
      descriptionState={{ from: 'history' }}
      handleDismiss={() => removeWatchHistory(mediaId)}
      dismissPrompt="Remove from watch history"
    />
  ) : null
}