import React from 'react';
import { connectWithRedux } from '../../controllers';

function MediaListWithRedux({
  playlist,
  medias,
}) {
  return (
    <div />
  );
}

export const MediaList = connectWithRedux(
  MediaListWithRedux,
  ['playlist', 'medias']
);
