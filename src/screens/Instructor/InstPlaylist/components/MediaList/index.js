import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';
import './index.scss';

function MediaListWithRedux({
  playlist,
  medias,
}) {
  return (
    <CTFragment padding={[10, 30]} className="ipl-media-li-con">
      {medias.map(media => <div>{media.name}</div>)}
    </CTFragment>
  );
}

export const MediaList = connectWithRedux(
  MediaListWithRedux,
  ['playlist', 'medias']
);
