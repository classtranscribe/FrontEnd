import _ from 'lodash'
import React, { useState } from 'react'
import { connectWithRedux } from '_redux/instructor'
import { withRouter } from 'react-router'
import { Poster, CTButton } from 'components'
import { api, util } from 'utils'
import { mediaControl } from '../../Utils'
import { PlaylistIcon } from '../PlaylistIcon'
import { Icon } from 'semantic-ui-react'


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

  const handleSelect = () => {
    if (isSelectingVideos) {
      if (isSelected) {
        mediaControl.handleRemove(media)
      } else {
        mediaControl.handleSelect(media)
      }
    } 
  }

  const handleKeydownSelect = ({ keyCode }) => {
    if (keyCode === 13) {
      handleSelect()
    }
  }

  return (
    <div 
      id={`media-${id}`} 
      className="ip-video-card" 
      data-select={isSelectingVideos}
      tabIndex={ isSelectingVideos ? 0 : -1}
      onClick={handleSelect}
      onKeyDown={handleKeydownSelect}
    >
      <div className="plain-btn ip-video">
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
            <div className="ip-v-file-icon">
              <Icon name="file video outline" size="big"/>
            </div>
          }
          <div className="ip-video-name">
            {mediaName}
          </div>
        </div>
      </div>

      {
        !isSelectingVideos
        &&
        <div className="ip-video-opts ct-btn-group">
          <CTButton //circle
            icon="play_circle_filled"
            text="Watch"
            color="green"
            onClick={watchVideo}
          />

          <CTButton //circle
            popup="Edit"
            icon="edit"
            color="text-green"
            onClick={null}
          />

          <CTButton //circle
            popup="Delete"
            icon="delete"
            color="light"
            onClick={null}
          />
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

