import React from 'react';
import { Link } from 'react-router-dom';
import { CTFragment, CTFooter, CTText } from 'layout';
import { InfoAndListLayout, MediaCard } from 'components';
import { NOT_FOUND_404 } from 'utils';

function VideosView({
  playlist,
}) {
  const { name = '', medias = [] } = playlist || {};

  const loading = playlist === null;
  const error = playlist === NOT_FOUND_404;
  const empty = medias.length === 0;

  const vListProps = {
    dFlexCol: true,
    role: 'list',
    className: 'pl-1 pr-1',
    alt: empty,
    altElement: <CTText justConCenter muted padding={[20, 0]}>No video posted</CTText>
  };

  return error ? null : (
    <InfoAndListLayout.List fadeIn loading={loading} id="cp-pls-view">
      <CTFragment 
        sticky 
        alignItCenter 
        className="title link" 
        as={Link} 
        to={window.location.pathname}
      >
        <i className="material-icons" aria-hidden="true">arrow_back</i>
        <span>{name}</span>
      </CTFragment>

      <CTFragment {...vListProps}>
        {medias.map((me) => <MediaCard row posterSize='normal' {...MediaCard.parse(me)} /> )}
      </CTFragment>

      <CTFooter />
    </InfoAndListLayout.List>
  );
}

export default VideosView;
