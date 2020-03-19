import React from 'react'
import { Icon } from 'semantic-ui-react'

function MediaName({
  nameRef,
  mediaName='',
  isEditing=false,
  isSelected=false,
  isSelectingVideos=false,

  onClick,
}) {
  return (
    <div 
      className="plain-btn ip-video" 
      tabIndex={ (isSelectingVideos || isEditing) ? -1 : 0 }
      onClick={ (isSelectingVideos || isEditing) ? null : onClick }
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
          onKeyDown={e => e.keyCode === 13 ? e.preventDefault() : null}
        >
          {mediaName}
        </div>
      </div>
    </div>
  )
}

export default MediaName