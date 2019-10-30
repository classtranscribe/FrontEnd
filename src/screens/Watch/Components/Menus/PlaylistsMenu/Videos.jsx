import React, { useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { VideoCard } from 'components'
import { api, util } from 'utils'

function Videos({
  medias=[],
  currMediaId='',
  playlists=[],
  watchHistory=[],
  selectedPlaylist={},
}) {
  useEffect(() => {
    util.scrollToCenter(currMediaId, false, util.scrollToTop('.watch-videos-list'))
  }, [medias])
  return (
    <div className="watch-videos-list">
      <div className="watch-list-title" type="pl-name">
        <p><i className="material-icons">video_library</i>{selectedPlaylist.name}</p>
      </div>
      {
        medias.length === 0 ?
        <div className="w-100 d-flex justify-content-center align-items-center m-5">
          NO VIDEO
        </div>
        :
        medias.map( media => (
          <Video 
            key={media.id}
            media={media} 
            playlist={selectedPlaylist}
            playlists={playlists}
            currMediaId={currMediaId} 
            watchHistory={watchHistory} 
          />
        ))
      }
    </div>
  );
}

function Video({ 
  media=null, 
  currMediaId='',
  watchHistory=[],

  playlist={},
  playlists=[]
}) {
  const courseNumber = util.parseURLFullNumber()
  const { id, mediaName } = api.parseMedia(media)
  const mediaHistory = watchHistory.filter(mh => mh.mediaId === id)[0] || {}
  const { ratio, timeStamp } = mediaHistory
  return (
    <div className="watch-video-item">
      <VideoCard row dark
        id={id}
        name={mediaName}
        ratio={ratio}
        posterSize={'100px'}
        fittedNameSize={40}
        description={ currMediaId === id ? 'Now Playing' : ''}
        mediaState={{ media, playlist, playlists }}
        //handleLinkClick={() => window.location.search = util.createSearchQuery({ courseNumber, id, timeStamp })}
        handleLinkClick={() => util.refresh()}
        link={util.links.watch(courseNumber, id, timeStamp)}
      />
    </div>
  )
}

export default withRouter(Videos);