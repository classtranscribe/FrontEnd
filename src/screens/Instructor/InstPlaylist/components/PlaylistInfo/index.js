import React from 'react';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';

function PlaylistInfoWithRedux({
  offering,
  playlist
}) {
  const { name } = playlist;
  return (
    <CTFragment padding={[30]}>
      <div>{name}</div>
    </CTFragment>
  );
}

export const PlaylistInfo = connectWithRedux(
  PlaylistInfoWithRedux,
  ['playlist', 'offering']
);



