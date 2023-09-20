import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { Button } from 'pico-ui';
import { CTFragment, CTFilterInput } from 'layout';
import { SelectCtrlButton } from 'components';

import UploadButton from './UploadButton';

function ActionBar({
  playlist,
  result,
  selecting,
  selectAll,
  removeAll,
  selectedVideos,
  filterValue,
  handleFilterChange,
  dispatch
}) {
  const handleSelectAll = () => {
    selectAll(result);
  };

  const padded = Boolean(filterValue) || isMobile;
  const showUploadBtn = !padded && playlist.sourceType === 2;
  const isSelectedAll = selectedVideos.length > 0 
                      && selectedVideos.length === result.length;

  useEffect(() => {
    if (selectedVideos.length > 0) {
      removeAll();
    }
  }, [result]);

  const handleDeleteVideos = () => {
    const mediaIds = selectedVideos.map(video => video.id);
    const confirm = {
      text: `Are you sure to delete the selected ${mediaIds.length} `
            + `video${mediaIds.length > 1 ? 's' : ''}? `
            + '(This acrion cannot be undone)',
      onConfirm: () => dispatch({type: 'instplaylist/deleteMedias', payload: mediaIds})
    };
    dispatch({type: 'instplaylist/setConfirmation', payload: confirm});
  }
  
  return (
    <CTFragment
      alignItCenter 
      sticky
      id="ipl-media-actions" 
      padding={[10, 10, 10, (padded ? 0 : 23)]}
    >
      <SelectCtrlButton
        selecting={selecting}
        isSelectedAll={isSelectedAll}
        selectAll={handleSelectAll}
        removeAll={removeAll}
      />
      
      {
        selecting
        &&
        <Button
          uppercase
          icon="delete"
          color="red transparent"
          text="Delete"
          classNames="mr-2"
          onClick={handleDeleteVideos}
        />
      }

      {
        !isMobile
        &&
        <CTFilterInput
          grey
          debounce
          value={filterValue}
          padding={[0]}
          placeholder="Filter videos ..."
          onInputChange={handleFilterChange}
        />
      }

      {showUploadBtn && <UploadButton playlistId={playlist.id} />}

    </CTFragment>
  );
}

export default ActionBar;