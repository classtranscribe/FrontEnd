import React from 'react';
import { Link } from 'dva/router';
import { CTFragment } from 'layout';
import { links } from 'utils/links';

function PlaylistItem({
  isInstMode,
  playlist,
  offering
}) {
  const { id, name } = playlist;

  const linkToInstPl = {
    pathname: links.playlist(id),
    state: { playlist, offering }
  };

  return (
    <Link
      id={id}
      to={isInstMode ? linkToInstPl : `#plid=${id}`}
    >
      <CTFragment alignItCenter className="pl-name">
        <i className="material-icons">video_library</i>
        <span>{name}</span>
      </CTFragment>
      <i aria-hidden="true" className="material-icons pl-icon">chevron_right</i>
    </Link>
  );
}

export default PlaylistItem;
