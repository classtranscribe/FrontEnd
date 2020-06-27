import React from 'react';
import { CTDNDList } from 'layout';
import { isMobile } from 'react-device-detect';
import { mediaControl } from '../../controllers';
import MediaItem from './MediaItem';

function MediaDNDList({
  medias,
  filtering,
  loading,
  error,
  handleSelect,
  isSelected,
  handleExpand,
  isExpanded,
  setFilterResult
}) {
  const onDragEnd = (res) => {
    mediaControl.onDragEnd(res, setFilterResult);
  };

  let dndItems = [];

  if (!loading && !error) {
    const mediaProps = {
      handleSelect,
      isSelected,
      handleExpand,
      isExpanded
    };

    dndItems = medias.map(media => ({
      id: `media-${media.id}-${media.name}`,
      node: <MediaItem media={media} {...mediaProps} />
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
