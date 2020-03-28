import React, { useEffect } from 'react'
import { connectWithRedux } from '../../../Utils'
import { VideoCard, PlaceHolder } from '../../../../../components'
import { api, util } from '../../../../../utils'

function Videos({
  playlist,
  currMediaId='',
  watchHistory=[],
  currPlaylist={},
}) {

  let { medias } = currPlaylist

  useEffect(() => {
    util.scrollToCenter(
      '#'+currMediaId, 
      true, 
      util.scrollToTop('.watch-videos-list')
    )
  }, [currPlaylist])

  return (
    <div className="watch-videos-list">
      <div className="watch-list-title" type="pl-name">
        <p><i className="material-icons">video_library</i>{currPlaylist.name}</p>
      </div>
      <ul className="w-100 d-flex flex-column p-0">
        {
          !medias ?
          <PlaceHolder />
          :
          medias.length === 0 ?
          <div className="w-100 d-flex justify-content-center align-items-center m-5">
            NO VIDEO
          </div>
          :
          medias.map( media => (
            <Video 
              key={media.id}
              media={media} 
              currMediaId={currMediaId} 
              watchHistory={watchHistory} 
            />
          ))
        }
      </ul>
    </div>
  )
}

function Video({ 
  media=null, 
  currMediaId='',
  watchHistory=[],
}) {
  media = api.parseMedia(media)
  const { id, mediaName } = media
  const mediaHistory = watchHistory.filter(mh => mh.mediaId === id)[0] || {}
  const { ratio, timeStamp } = mediaHistory
  return (
    <li className="watch-video-item" >
      <VideoCard row dark
        id={id}
        name={mediaName}
        ratio={ratio}
        posterSize={'100px'}
        //fittedNameSize={40}
        listitem={false}
        current={currMediaId === id}
        description={ currMediaId === id ? 'Now Playing' : ''}
        link={util.links.watch(id, { begin: timeStamp })}
      />
    </li>
  )
}

export default connectWithRedux(
  Videos,
  ['playlist'],
  []
);