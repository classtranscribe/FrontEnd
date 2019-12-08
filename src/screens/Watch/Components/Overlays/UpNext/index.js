import React, { useEffect, useState } from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { VideoCard } from 'components'
import { 
  findUpNextMedia, 
  CTP_LOADING, CTP_UP_NEXT, CTP_ENDED 
} from '../../../Utils'
import { api, util } from 'utils'

function UpNextWithRedux({
  media,
  playlists,
  ctpPriEvent=CTP_LOADING
}) {

  const [show, setShow] = useState(false)

  const onClose = () => {
    setShow(false)
  }

  let upNext = api.parseMedia( findUpNextMedia({ currMediaId: media.id, playlists }) ) 
  useEffect(() => {
    let displayUpnext = (ctpPriEvent === CTP_UP_NEXT || ctpPriEvent === CTP_ENDED) && Boolean(upNext.id)
    if (displayUpnext) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [ctpPriEvent])

  return show ? (
    <div 
      className="watch-prompt watch-upn" 
      data-position="bottom left"
    >
      <div className="prompt-upnext" id="watch-upnext">
        <div className="wml-header watch-un-header">
          <h3>
            <i className="material-icons" aria-hidden="true">skip_next</i>
            Next Video
          </h3>
          <button className="plain-btn wml-close-btn" aria-label="Close" onClick={onClose}>
            <span tabIndex="-1">
              <i className="material-icons">close</i>
            </span>
          </button>
        </div>
        <Video 
          media={upNext}
        />
      </div>
    </div>
  ) : null
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
        name={mediaName}
        ratio={ratio}
        posterSize={'100px'}
        fittedNameSize={-1}
        //mediaState={{ media, playlist, playlists }}
        //handleLinkClick={() => window.location.search = util.createSearchQuery({ courseNumber, id, timeStamp })}
        handleLinkClick={() => util.refresh()}
        link={util.links.watch(courseNumber, id, timeStamp)}
      />
    </div>
  )
}

export const UpNext = connectWithRedux(
  UpNextWithRedux,
  ['media', 'playlists', 'ctpPriEvent'],
  []
)
