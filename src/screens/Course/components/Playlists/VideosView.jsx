import React from 'react';
import { Link } from 'react-router-dom';
import { CTFragment, CTFooter } from 'layout';
import { InfoAndListLayout, MediaCard } from 'components';
import { NOT_FOUND_404 } from 'utils';

function VideosView({
  playlist,
}) {
  const { name = '', medias = [] } = playlist || {};

  const loading = playlist === null;
  const error = playlist === NOT_FOUND_404;

  return error ? null : (
    <InfoAndListLayout.List fade loading={loading} id="cp-pls-view">
      <CTFragment sticky vCenter className="title link" as={Link} to={window.location.pathname}>
        <i className="material-icons" aria-hidden="true">arrow_back</i>
        <span>{name}</span>
      </CTFragment>

      <CTFragment list role="list" className="pl-4">
        {medias.map((me) => <MediaCard row posterSize='normal' {...MediaCard.parse(me)} /> )}
      </CTFragment>

      <CTFooter />
    </InfoAndListLayout.List>
  );
}

export default VideosView;
