import React from 'react'
import { withRouter } from 'react-router'

import WatchCtrlButton from '../../WatchCtrlButton'
import { VideoCard } from '../../../../../components'

import { setup, connectWithRedux } from '../../../Utils'
import { api } from '../../../../../utils'

export function NextVideoWithRedux({
  nextBtn=true,
  media,
  playlist={},
}) {

  let { prev, next } = setup.findNeighbors(media.id, playlist)
  prev = api.parseMedia( prev )
  next = api.parseMedia( next )
  let canPlayPrev = Boolean(prev.id)
  let canPlayNext = Boolean(next.id)

  const handleChangeVideo = toWatch => {
    setup.changeVideo(toWatch)
  }

  const handlePlayNext = () => {
    handleChangeVideo(next)
  }

  const handlePlayPrev = () => {
    handleChangeVideo(prev)
  }

  const watchPrev = <Video media={prev} />
  const watchNext = <Video media={next} nextVideo />

  if (nextBtn) {
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

  else {
    return (
      <WatchCtrlButton 
        onClick={handlePlayPrev}
        label={ canPlayPrev ? watchPrev : 'End of the course' }
        id="prev-video-btn"
        disabled={!canPlayPrev}
        popupStyle={{padding: '0'}}
        popupPosition="0,0"
        ariaTags={{
          'aria-label': 'Previous Video',
        }}
      >
        <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
          <i className="material-icons">skip_previous</i>       
        </span>
      </WatchCtrlButton>
    )
  }
}

function Video({ 
  media=null, 
  nextVideo=false
}) {
  const { id, mediaName } = media
  let name = nextVideo ? 'Next' : 'Previous'
  return (
    <div role="listitem"  className="watch-video-item search-result-listitem search-result-videos">
      <VideoCard row dark
        id={id}
        name={`<span>${name} Video</span> | ${mediaName}`}
        ratio={0}
        posterSize={'100px'}
        fittedNameSize={-1}
        listitem={false}
      />
    </div>
  )
}

export const NextVideoButton = withRouter(
  connectWithRedux(
    NextVideoWithRedux,
    ['media', 'playlist'],
    []
))