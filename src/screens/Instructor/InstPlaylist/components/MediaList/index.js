import React, { useState, useCallback } from 'react';
import { CTFragment, CTFilter, CTText } from 'layout';
import { ARRAY_INIT, NOT_FOUND_404 } from 'utils/constants';
import { connectWithRedux } from '../../controllers';
import './index.scss';
import MediaDNDList from './MediaDNDList';
import ActionBar from './ActionBar';

function MediaListWithRedux({
  playlist,
  medias,
}) {
  const loading = medias === ARRAY_INIT;
  const error = medias === NOT_FOUND_404;

  const [filterValue, setFilterValue] = useState('');
  const [selectedVideos, setSelectedVideos] = useState([]);
  const selecting = selectedVideos.length > 0;
  const filtering = Boolean(filterValue);


  const handleFilterChange = ({ target: { value } }) => {
    setFilterValue(value);
  }

  const selectAll = () => {
    setSelectedVideos(medias);
  };

  const removeAll = () => {
    setSelectedVideos([]);
  };

  const handleSelect = (media, checked) => {
    if (checked) {
      setSelectedVideos([...selectedVideos, media]);
    } else {
      setSelectedVideos(selectedVideos.filter(vi => vi !== media));
    }
  };

  const isSelected = useCallback((media) => {
    return selectedVideos.includes(media);
  }, [selectedVideos]);

  const isSelectedAll = medias.length === selectedVideos.length;

  return (
    <div className="ipl-media-li-con">
      <CTFragment list role="list" className="ipl-media-li">
        <ActionBar
          selecting={selecting}
          isSelectedAll={isSelectedAll}
          selectAll={selectAll}
          removeAll={removeAll}
          filterValue={filterValue}
          handleFilterChange={handleFilterChange}
        />

        <CTFilter
          data={medias}
          value={filterValue}
          keys={['mediaName']}
        >
          {(result) => (
            result.length > 0 
            ?
              <MediaDNDList 
                medias={result} 
                error={error} 
                loading={loading}
                filtering={filtering}
                handleSelect={handleSelect}
                isSelected={isSelected}
              />
            :
              <CTText muted center margin={[30, 0]}>No Result</CTText>
          )}
        </CTFilter>
      </CTFragment>
    </div>
  );
}

export const MediaList = connectWithRedux(
  MediaListWithRedux,
  ['playlist', 'medias']
);
