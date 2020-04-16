import React from 'react'
import { VideoCard } from '../../../../../components'
import { util } from '../../../../../utils'
import { OfferingListHolder } from '../PlaceHolder'


function HistorySection({ 
  offerings,
  watchHistory
}) {

  return (
    <div className="offerings" id="starred-offerings">
      {
        watchHistory[0] === 'unload' ? 
        <OfferingListHolder row={1} title={false} width="220px" />
        :
        watchHistory.map( media =>  (
          <MediaCard key={`wh-${media.id}`} media={media} offerings={offerings} />
        ))
      }
    </div>
  )
}

function MediaCard({ media }) {
  const { mediaName, watchHistory, id } = media

  return (
    <VideoCard square
      name={mediaName}
      link={util.links.watch(id)}
      ratio={watchHistory.ratio}
    />
  )
}

export default HistorySection