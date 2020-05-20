import _ from 'lodash';
import classNames from 'classnames';
import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'pico-ui';
import { api } from 'utils';
import { connectWithRedux, mediaControl } from '../../../Utils';
import './index.scss';

import MediaName from './MediaName';
import InlineButtons from './InlineButtons';

function VideoItemWithRedux({
  media = null,
  current = false,
  openMedia = null,
  isSelectingVideos = false,
  selectedVideos = {},
}) {
  const { id, mediaName, isUnavailable } = api.parseMedia(media);

  const [newName, setNewName] = useState('');
  const nameRef = useRef();

  const isEditing = Boolean(newName) && !isSelectingVideos;
  const isSelected = Boolean(selectedVideos[id]);

  useEffect(() => {
    if (isEditing) nameRef.current.focus();
  }, [newName]);

  const handleSelect = () => {
    if (isSelectingVideos) {
      if (isSelected) {
        mediaControl.handleRemove(media);
      } else {
        mediaControl.handleSelect(media);
      }
    }
  };

  const handleKeydownSelect = ({ keyCode }) => {
    if (keyCode === 13) {
      handleSelect();
    }
  };

  const handleRename = async () => {
    const text = nameRef.current.innerText;
    if (isEditing && text && text !== mediaName) {
      // console.log(nameRef.current.innerText)
      await mediaControl.renameMedia(media, text);
    }
    setNewName(isEditing ? '' : mediaName);
  };

  const classes = classNames('ip-video-card', {
    current,
    edit: isEditing,
    selecting: isSelectingVideos,
  });

  return (
    <div
      id={`media-${id}`}
      className={classes}
      tabIndex={isSelectingVideos ? 0 : -1}
      role="button"
      onClick={handleSelect}
      onKeyDown={handleKeydownSelect}
    >
      <MediaName
        nameRef={nameRef}
        mediaName={mediaName}
        isEditing={isEditing}
        isSelected={isSelected}
        isSelectingVideos={isSelectingVideos}
        onClick={openMedia(media)}
        handleRename={handleRename}
      />

      <InlineButtons
        show={!isSelectingVideos && !isEditing}
        media={media}
        mediaName={mediaName}
        isUnavailable={isUnavailable}
        handleRename={handleRename}
      />

      {isEditing && (
        <div className="ip-video-opts ct-btn-group">
          <Button compact uppercase text="Save" color="teal transparent" onClick={handleRename} />
        </div>
      )}
    </div>
  );
}

export default connectWithRedux(VideoItemWithRedux, ['isSelectingVideos', 'selectedVideos']);
