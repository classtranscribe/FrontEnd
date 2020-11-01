import React from 'react';
import { CTFragment, CTText, CTSelect } from 'layout';
import { connectWithRedux } from '../../controllers/trans';
import Player from './Player';
import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  media,
}) {
  return (
    <CTFragment fadeIn className="msp-tab-con">
      <Player />
      <TransTable media={media} />
      <CTFragment center padding={[30, 0]} />
    </CTFragment>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [],
  [],
  ['media']
);
