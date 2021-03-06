import React from 'react';
import { Link } from 'dva/router';
import ErrorTypes from 'entities/ErrorTypes';
import { CTFragment, CTFooter, CTText } from 'layout';
import { InfoAndListLayout, MediaCard } from 'components';


function VideosView({
  playlist,
}) {
  const { name = '', medias = [] } = playlist || {};

  const loading = playlist === null;
  const error = ErrorTypes.isError(playlist);
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
        to={{ pathname: window.location.pathname, search: '', hash: ''}}
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
