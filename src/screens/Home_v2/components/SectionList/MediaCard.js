import React from 'react';
import { VideoCard } from 'components';
import { links, api } from 'utils';

function MediaCard({ media }) {
  const { mediaName, watchHistory, id } = api.parseMedia(media);

  return id ? (
    <VideoCard square name={mediaName} link={links.watch(id)} ratio={watchHistory.ratio} />
  ) : null;
}

export default MediaCard;