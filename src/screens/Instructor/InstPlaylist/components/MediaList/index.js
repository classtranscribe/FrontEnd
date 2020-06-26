import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';
import './index.scss';

function MediaListWithRedux({
  playlist,
  medias,
}) {
  return (
    <CTFragment fade padding={[10, 30]} className="ipl-media-li-con">
      <CTFragment list role="list" className="ipl-media-li">
        {medias.map(media => <div>{media.name}</div>)}
      </CTFragment>
    </CTFragment>
  );
}

export const MediaList = connectWithRedux(
  MediaListWithRedux,
  ['playlist', 'medias']
);