import React from 'react';
import { Link } from 'react-router-dom';
import { CTFragment, VideoCard, CTFooter } from 'components';
import { NOT_FOUND_404, links, api } from 'utils';

function Video({ media }) {
  const { mediaName, id, isUnavailable, watchHistory } = api.parseMedia(media);

  return (
    <VideoCard
      row
      id={id}
      name={mediaName}
      link={links.watch(id)}
      ratio={watchHistory.ratio}
      posterSize="150px"
      isUnavailable={isUnavailable}
    />
  );
}

function VideosView({
  playlist,
}) {
  const { name = '', medias = [] } = playlist || {};

  const loading = playlist === null;
  const error = playlist === NOT_FOUND_404;

  return error ? null : (
    <CTFragment fade loading={loading} id="cp-pls-view" data-scroll>
      <CTFragment sticky vCenter className="title link" as={Link} to={window.location.pathname}>
        <i className="material-icons">arrow_back_ios</i>
        <span>{name}</span>
      </CTFragment>

      <CTFragment list role="list" className="pl-4 pr-4">
        {medias.map( me => <Video media={me} /> )}
      </CTFragment>

      <CTFooter />
    </CTFragment>
  );
}

export default VideosView;
