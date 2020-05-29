import React from 'react';
import { VideoCard } from 'components';
import { links, api } from 'utils';

function MediaItem({ media }) {
  const { mediaName, watchHistory, id } = api.parseMedia(media);

  return id ? (
    <VideoCard
      row
      name={mediaName}
      ratio={watchHistory.ratio}
      role="listitem"
      posterSize="200px"
      link={links.watch(id)}
      fittedNameSize={-1}
    />
  ) : null;
}

export default MediaItem;