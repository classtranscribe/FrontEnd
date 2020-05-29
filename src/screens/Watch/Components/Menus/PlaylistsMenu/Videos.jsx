import React, { useEffect } from 'react';
import { VideoCard, PlaceHolder } from 'components';
import { api, util, links } from 'utils';
import { connectWithRedux } from '../../../Utils';

function Videos({
  // playlist,
  currMediaId = '',
  currPlaylist = {},
}) {
  let { medias } = currPlaylist;

  useEffect(() => {
    util.elem.scrollIntoCenter(currMediaId, {
      focus: true,
      alternate: () => util.elem.scrollIntoView('watch-videos-list'),
    });
  }, [currPlaylist]);

  return (
    <div id="watch-videos-list" className="watch-videos-list">
      <div className="watch-list-title" type="pl-name">
        <p>
          <i className="material-icons">video_library</i>
          {currPlaylist.name}
        </p>
      </div>
      <ul className="w-100 d-flex flex-column p-0">
        {!medias ? (
          <PlaceHolder />
        ) : medias.length === 0 ? (
          <div className="w-100 d-flex justify-content-center align-items-center m-5">NO VIDEO</div>
        ) : (
          medias.map((media) => <Video key={media.id} media={media} currMediaId={currMediaId} />)
        )}
      </ul>
    </div>
  );
}

function Video({ media = null, currMediaId = '' }) {
  media = api.parseMedia(media);
  const { id, mediaName, watchHistory } = media;
  return (
    <li className="watch-video-item">
      <VideoCard
        row
        dark
        id={id}
        name={mediaName}
        ratio={watchHistory.ratio}
        posterSize="100px"
        listitem={false}
        current={currMediaId === id}
        description={currMediaId === id ? 'Now Playing' : ''}
        link={links.watch(id)}
      />
    </li>
  );
}

export default connectWithRedux(Videos, ['playlist']);
