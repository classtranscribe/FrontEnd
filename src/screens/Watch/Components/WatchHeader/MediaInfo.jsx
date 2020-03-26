import React, { useEffect } from 'react'
import { connectWithRedux } from '../../Utils'
import { util } from '../../../../utils'
// import { Popup } from 'semantic-ui-react'

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

  // return (
  //   <Popup inverted basic wide hoverable
  //     position="bottom left"
  //     mouseEnterDelay={700}
  //     content={
  //       <>
  //         <p className="watch-header-course-num">{courseNumber}</p>
  //         <p className="watch-header-media-name">{mediaName}</p>
  //       </>
  //     }
  //     trigger={
  //       <div className="watch-media-info">
  //         <p className="watch-header-course-num">{courseNumber}</p>
  //         <h1 className="watch-header-media-name">{mediaName}</h1>
  //       </div>
  //     }
  //   />
  // )

  return (
    <div className="watch-media-info" title={mediaName}>
      <div className="watch-header-course-num">
        {fullNumber}
        <span>{playlist.name}</span>
      </div>
      <h1 className="watch-header-media-name">{mediaName}</h1>
    </div>
  )
}

export default connectWithRedux(
  MediaInfo,
  ['media', 'playlist', 'offering'],
  []
)
