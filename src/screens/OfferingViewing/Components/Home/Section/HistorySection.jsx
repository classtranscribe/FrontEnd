import React from 'react';
import { VideoCard } from 'components';
import { util, api } from 'utils';
import { OfferingListHolder } from '../PlaceHolder';

function HistorySection({ offerings, watchHistory }) {
  return (
    <div className="offerings" id="starred-offerings">
      {watchHistory[0] === 'unload' ? (
        <OfferingListHolder row={1} title={false} width="220px" />
      ) : (
        watchHistory.map((media, index) => (
          <MediaCard key={`wh-${index}-${media.id}`} media={media} offerings={offerings} />
        ))
      )}
    </div>
  );
}

function MediaCard({ media }) {
  const { mediaName, watchHistory, id } = api.parseMedia(media);

  return id ? (
    <VideoCard square name={mediaName} link={util.links.watch(id)} ratio={watchHistory.ratio} />
  ) : null;
}

export default HistorySection;
