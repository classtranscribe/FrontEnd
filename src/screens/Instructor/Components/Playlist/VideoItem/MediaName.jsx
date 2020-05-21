import React from 'react';
import { Icon } from 'semantic-ui-react';

function MediaName({
  nameRef,
  mediaName = '',
  isEditing = false,
  isSelected = false,
  isSelectingVideos = false,

  onClick,
  handleRename,
}) {
  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleRename();
    }
  };

  return (
    <div
      className="plain-btn ip-video"
      tabIndex={isSelectingVideos || isEditing ? -1 : 0}
      onClick={isSelectingVideos || isEditing ? null : onClick}
    >
      <div tabIndex="-1" className="ip-video-con">
        {/* Icon */}
        {isSelectingVideos ? (
          <div className="ip-v-file-icon">
            {isSelected ? (
              <i className="material-icons">check_box</i>
            ) : (
              <i className="material-icons">check_box_outline_blank</i>
            )}
          </div>
        ) : (
          <div className="ip-v-file-icon">
            <Icon name="file video" size="big" />
          </div>
        )}

        {/* Media Name */}
        <div
          ref={nameRef}
          className="ip-video-name"
          contentEditable={isEditing}
          onKeyDown={handleKeyDown}
        >
          {mediaName}
        </div>
      </div>
    </div>
  );
}

export default MediaName;
