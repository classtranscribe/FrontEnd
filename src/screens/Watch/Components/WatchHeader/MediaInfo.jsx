import React, { useEffect } from 'react'
import { connectWithRedux } from '../../../../_redux/watch'
import { util } from '../../../../utils'
// import { Popup } from 'semantic-ui-react'

function MediaInfo({
  media={},
  // playlist={}
}) {

  const { mediaName } = media
  // const { name } = playlist
  const courseNumber = util.parseURLFullNumber()

  useEffect(() => {
    if (mediaName) {
      util.links.title(`${mediaName} | ${courseNumber}`)
    }
  }, [media])

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
      <p className="watch-header-course-num">{courseNumber}</p>
      <h1 className="watch-header-media-name">{mediaName}</h1>
    </div>
  )
}

export default connectWithRedux(
  MediaInfo,
  ['media', 'playlist'],
  []
)
