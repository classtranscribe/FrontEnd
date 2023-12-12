import React from 'react';
import { CTFragment, CTText } from 'layout';
// import Player from './Player';
// import TransTable from './TransTable';

export function TranscriptionsWithRedux({
  // eslint-disable-next-line no-unused-vars
  media
}) {
  return (
    <CTFragment fadeIn className="msp-tab-con">
      {/* <Player />
      <TransTable media={media} /> */}
      <CTFragment center padding={[30, 0]}>
        <CTText celadon size="medium">
          In progress
        </CTText>
      </CTFragment>
    </CTFragment>
  );
}

export const Transcriptions = TranscriptionsWithRedux;