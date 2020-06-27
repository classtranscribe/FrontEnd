import React, { useState, useCallback, useEffect } from 'react';
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
  const [expandedVideo, setExpandedVideo] = useState(null);

  const selecting = selectedVideos.length > 0;
  const filtering = Boolean(filterValue);

  useEffect(() => {
    if (filtering && Boolean(expandedVideo)) {
      setExpandedVideo(null);
    }
  }, [filterValue]);

  const handleFilterChange = ({ target: { value } }) => {
    setFilterValue(value);
  }

  const selectAll = (result) => {
    setSelectedVideos(result);
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

  const handleExpand = (media, expand) => {
    if (expand) {
      setExpandedVideo(media);
    } else {
      setExpandedVideo(null);
    }
  }

  const isExpanded = useCallback((media) => {
    return expandedVideo === media;
  }, [expandedVideo]);

  const isSelectedAll = medias.length === selectedVideos.length;

  return (
    <div className="ipl-media-li-con">
      <CTFragment list role="list" className="ipl-media-li">
        <CTFilter
          data={medias}
          value={filterValue}
          keys={['mediaName']}
        >
          {(result, setResult) => (
            <>
              <ActionBar
                playlist={playlist}
                result={result}
                selecting={selecting}
                selectedVideos={selectedVideos}
                selectAll={selectAll}
                removeAll={removeAll}
                filterValue={filterValue}
                handleFilterChange={handleFilterChange}
              />
              {
                result.length > 0 ? (
                  <MediaDNDList 
                    medias={result} 
                    error={error} 
                    loading={loading}
                    filtering={filtering}
                    handleSelect={handleSelect}
                    isSelected={isSelected}
                    handleExpand={handleExpand}
                    isExpanded={isExpanded}
                    setFilterResult={setResult}
                  />
                ) : (
                  <CTText muted center margin={[30, 0]}>No Result</CTText>
                )
              }
            </>
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
