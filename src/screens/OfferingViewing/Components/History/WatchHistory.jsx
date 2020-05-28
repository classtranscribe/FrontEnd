import React, { useState, useEffect, Fragment } from 'react';
import { VideoCard, PlaceHolder } from 'components';
import { util, api, prompt } from 'utils';

export default function WatchHistory({ offerings }) {
  const [watchHistory, setWatchHistory] = useState(['unloaded']);

  const getUserWatchHistories = async () => {
    try {
      let { data } = await api.getUserWatchHistories();
      setWatchHistory((data || []).slice(0, 50));
    } catch (error) {
      setWatchHistory([]);
      prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
    }
  };

  useEffect(() => {
    getUserWatchHistories();
  }, []);

  return (
    <>
      <h2 className="history-title ct-a-fade-in">
        <i className="material-icons">history</i>
        <span>Watch History</span>
      </h2>
      <div className="watch-history-ul">
        {
          watchHistory.length === 0 || offerings[0] === 'retry' 
          ? (
            <div>None</div>
          ) : watchHistory[0] === 'unloaded' || offerings[0] === 'Unloaded' ? (
            <PlaceHolder />
          ) : (
            <div role="list" className="ct-list-col ct-a-fade-in">
              {watchHistory.map((media, index) => (
                <MediaItem key={`wh-${index}-${media.id}`} media={media} offerings={offerings} />
              ))}
            </div>
          )
        }
      </div>
    </>
  );
}

function MediaItem({ media }) {
  const { mediaName, watchHistory, id } = api.parseMedia(media);
  return id ? (
    <VideoCard
      row
      name={mediaName}
      ratio={watchHistory.ratio}
      role="listitem"
      posterSize="200px"
      link={util.links.watch(id)}
      fittedNameSize={-1}
    />
  ) : null;
}
