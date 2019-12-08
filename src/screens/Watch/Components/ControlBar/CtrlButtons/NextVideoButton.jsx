import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { VideoCard } from 'components'
import {
  videoControl,
  findUpNextMedia
} from '../../../Utils'
import { api, util } from 'utils'

export function NextVideoWithRedux({
  media,
  playlists,
}) {

  let upNext = api.parseMedia( findUpNextMedia({ currMediaId: media.id, playlists }) )
  let canPlayNext = Boolean(upNext.id)
  const handlePlayNext = () => {
    const { courseNumber } = util.parseSearchQuery()
    window.location.search = util.createSearchQuery({ courseNumber, id: upNext.id })
  }

  const watchNext = (
    <Video media={upNext} />
  )

  return (
    <WatchCtrlButton 
      onClick={handlePlayNext}
      label={ canPlayNext ? watchNext : 'End of the course' }
      id="next-video-btn"
      disabled={!canPlayNext}
      popupStyle={{padding: '0'}}
      popupPosition="0,0"
      ariaTags={{
        'aria-label': 'Next Video',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">skip_next</i>       
      </span>
    </WatchCtrlButton>
  )
}

function Video({ 
  media=null, 
  watchHistory=[],
}) {
  const courseNumber = util.parseURLFullNumber()
  const { id, mediaName } = media
  const mediaHistory = watchHistory.filter(mh => mh.mediaId === id)[0] || {}
  const { ratio, timeStamp } = mediaHistory
  return (
    <div role="listitem"  className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard row dark
        id={id}
        name={`<span>Next Video</span> | ${mediaName}`}
        ratio={ratio}
        posterSize={'100px'}
        fittedNameSize={-1}
        //mediaState={{ media }}
        //handleLinkClick={() => window.location.search = util.createSearchQuery({ courseNumber, id, timeStamp })}
        handleLinkClick={() => util.refresh()}
        link={util.links.watch(courseNumber, id, timeStamp)}
      />
    </div>
  )
}

export const NextVideoButton = connectWithRedux(
  NextVideoWithRedux,
  ['media', 'playlists'],
  []
)