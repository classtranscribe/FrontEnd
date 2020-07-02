import React, { useState, useCallback, useEffect } from 'react';
import { CTFilter, CTText, CTFooter } from 'layout';
import { InfoAndListLayout } from 'components';
import { ARRAY_INIT, NOT_FOUND_404 } from 'utils/constants';
import { connectWithRedux } from '../../controllers';
import './index.scss';
import MediaDNDList from './MediaDNDList';
import ActionBar from './ActionBar';
import NoVideoHolder from './NoVideoHolder';

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

  const actionProps = {
    playlist,
    selecting,
    selectedVideos,
    filterValue,
    handleFilterChange,
    selectAll,
    removeAll,
  };

  const dndListProps = {
    error,
    loading,
    selecting,
    filtering,
    isSelected,
    handleSelect,
    isExpanded,
    handleExpand
  };

  return (
    <InfoAndListLayout.List id="ipl-media-li">
      <CTFilter
        data={medias}
        value={filterValue}
        keys={['mediaName']}
      >
        {(result, setResult) => (
          <>
            <ActionBar
              result={result}
              {...actionProps}
            />
            {
              medias.length === 0 ? (
                <NoVideoHolder type={playlist.sourceType} />
              ) : result.length > 0 ? (
                <MediaDNDList 
                  medias={result}
                  setFilterResult={setResult}
                  {...dndListProps}
                />
              ) : (
                <CTText muted center margin={[30, 0]}>
                  No Result
                </CTText>
              )
            }
          </>
        )}
      </CTFilter>

      <CTFooter />
    </InfoAndListLayout.List>
  );
}

export const MediaList = connectWithRedux(
  MediaListWithRedux,
  ['playlist', 'medias']
);
