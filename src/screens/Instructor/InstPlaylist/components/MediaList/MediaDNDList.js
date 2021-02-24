import React from 'react';
import { CTDNDList } from 'layout';
import { isMobile } from 'react-device-detect';
import MediaItem from './MediaItem';

function reorder(list, startIndex, endIndex) {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}
function MediaDNDList({
  medias,
  filtering,
  selecting,
  loading,
  error,
  handleSelect,
  isSelected,
  handleExpand,
  isExpanded,
  setFilterResult,
  dispatch
}) {
  const onDragEnd = (res) => {
    const result = res;
    const callback = setFilterResult;
    if (!result.destination) {
      return;
    }
    if (result.destination.index === result.source.index) {
      return;
    }

    const medias_ = reorder(
      medias,
      result.source.index,
      result.destination.index
    );
    dispatch({ type: 'instplaylist/reorderMedias', payload: { medias: medias_, callback } });
  };

  let dndItems = [];

  if (!loading && !error) {
    const mediaProps = {
      selecting,
      filtering,
      handleSelect,
      isSelected,
      handleExpand,
      isExpanded
    };

    dndItems = medias.map(media => ({
      id: `media-${media.id}-${media.name}`,
      node: <MediaItem media={media} {...mediaProps} dispatch={dispatch} />
    }));
  }

  let dndProps = {
    contextId: 'media-ord',
    onDragEnd,
    items: dndItems,
    itemClassName: 'media-item-con',
    disabled: isMobile || filtering
  };

  return <CTDNDList {...dndProps} />;
}

export default MediaDNDList;
