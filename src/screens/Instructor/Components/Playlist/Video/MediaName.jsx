import React from 'react'
import { Icon } from 'semantic-ui-react'

function MediaName({
  nameRef,
  mediaName='',
  isEditing=false,
  isSelected=false,
  isSelectingVideos=false,
}) {
  return (
    <div 
      className="plain-btn ip-video" 
      tabIndex={isSelectingVideos ? -1 : 0}
    >
      <div tabIndex="-1" className="ip-video-con">
        {/* Icon */}
        {
          isSelectingVideos 
          ?
          <div className="ip-v-check">
            <div className="ip-v-check-box" data-checked={isSelected}>
              {
                isSelected
                &&
                <i className="material-icons">check</i>
              }
            </div>
          </div>
          :
          <div className="ip-v-file-icon">
            <Icon name="file video" size="big"/>
          </div>
        }


        {/* Media Name */}
        <div 
          ref={nameRef}
          className="ip-video-name"
          contentEditable={isEditing}
        >
          {mediaName}
        </div>
      </div>
    </div>
  )
}

export default MediaName