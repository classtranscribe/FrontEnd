import _ from 'lodash'
import React, { useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { Poster, CTButton } from 'components'
import { api, util } from 'utils'
import { mediaControl } from '../../Utils'


function VideoWithRedux({ 
  media=null, 
  playlist={},
  playlists=[],
  courseNumber='',
  isSelectingVideos=false,
  selectedVideos={},

  history,
}) {
  const { id, mediaName } = api.parseMedia(media)

  const watchVideo = () => {
    let pathname = util.links.watch(courseNumber, id)
    history.push(pathname, { media, playlist, playlists })
  }

  const isSelected = Boolean(selectedVideos[id])

  const handleClick = () => {
    if (isSelectingVideos) {
      if (isSelected) {
        mediaControl.handleRemove(media)
      } else {
        mediaControl.handleSelect(media)
      }
    } else {
      watchVideo()
    }
  }

  const [more, setMore] = useState(false)
  const handleSeeMore = () => setMore( !more )

  return (
    <div id={`media-${id}`} className="ip-video-card">
      <button className="plain-btn ip-video" onClick={handleClick} data-select={isSelectingVideos}>
        <div tabIndex="-1" className="ip-video-con">
          {
            isSelectingVideos ?
            <div className="ip-v-check">
              <div className="ip-v-check-box" data-checked={isSelected.toString()}>
                {
                  isSelected
                  &&
                  <i className="material-icons">check</i>
                }
              </div>
            </div>
            :
            <Poster round width="150px" />
          }
          <div className="ip-video-name">
            {mediaName}
          </div>
        </div>
      </button>

      {
        !isSelectingVideos
        &&
        <div className="ip-video-opts">
          <CTButton //circle
            icon="more_vert"
            color="light"
            onClick={handleSeeMore}
          />

          {
            more
            &&
            <div className="ip-v-menu">
              <button className="plain-btn ip-v-opt-btn">
                <div tabIndex="-1" className="ip-v-opt-con">
                  <span className="ip-v-opt-icon">
                    <i className="material-icons">edit</i>
                  </span>
                  <span className="ip-v-opt-text">Edit</span>
                </div>
              </button>

              <button className="plain-btn ip-v-opt-btn">
                <div tabIndex="-1" className="ip-v-opt-con">
                  <span className="ip-v-opt-icon">
                    <i className="material-icons">delete</i>
                  </span>
                  <span className="ip-v-opt-text">Delete</span>
                </div>
              </button>
            </div>
          }
        </div>
      }
    </div>
  )
}

export default withRouter(connectWithRedux(
  VideoWithRedux,
  [
    'playlist', 
    'playlists',
    'isSelectingVideos',
    'selectedVideos'
  ],
  []
))

