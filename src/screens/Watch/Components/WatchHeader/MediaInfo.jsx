import React, { useEffect } from 'react'
import { connectWithRedux } from '../../Utils'
import { util } from '../../../../utils'
import { Link } from 'react-router-dom'
import { Popup } from 'semantic-ui-react'

function MediaInfo({
  media={},
  playlist={},
  offering={},
}) {

  const { mediaName } = media
  const { fullNumber } = offering

  useEffect(() => {
    if (mediaName && fullNumber) {
      util.links.title(`${mediaName} | ${fullNumber}`)
    }
  }, [media, offering])

  return (
    <Popup inverted basic wide hoverable
      position="bottom left"
      mouseEnterDelay={700}
      content="Back to the course page"
      trigger={
        <Link 
          className="watch-media-info" 
          to={util.links.offeringDetail(playlist.offeringId, playlist.id, media.id)}
        >
          <span className="watch-header-course-num">
            {fullNumber}
            <span>{playlist.name}</span>
          </span>
          <span className="watch-header-media-name">{mediaName}</span>
        </Link>
      }
    />
  )
}

export default connectWithRedux(
  MediaInfo,
  ['media', 'playlist', 'offering'],
  []
)
