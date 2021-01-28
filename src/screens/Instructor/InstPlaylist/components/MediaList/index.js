import React, { useState, useCallback, useEffect } from 'react';
import { connect } from 'dva';
import ErrorTypes from 'entities/ErrorTypes';
import { CTFilter, CTText, CTFooter } from 'layout';
import { InfoAndListLayout } from 'components';
import { ARRAY_INIT } from 'utils/constants';
import './index.scss';
import MediaDNDList from './MediaDNDList';
import ActionBar from './ActionBar';
import NoVideoHolder from './NoVideoHolder';

function MediaListWithRedux(props) {
  const { dispatch, instplaylist } = props;
  const {
    playlist,
    medias,
  } = instplaylist;
  const loading = medias === ARRAY_INIT;
  const error = ErrorTypes.isError(medias);

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
    // console.log(target, target.value)
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
              dispatch={dispatch}
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
                  dispatch={dispatch}
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

export const MediaList = connect(({ instplaylist, loading }) => ({
  instplaylist
}))(MediaListWithRedux);
