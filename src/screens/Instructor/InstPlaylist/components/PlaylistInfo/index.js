import React from 'react';
import { connectWithRedux } from '../../controllers';

function PlaylistInfoWithRedux({
  offering,
  playlist
}) {
  return (
    <div />
  );
}

export const PlaylistInfo = connectWithRedux(
  PlaylistInfoWithRedux,
  ['playlist', 'offering']
);



