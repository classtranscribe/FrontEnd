import React from 'react';
import { CTPlayer } from 'components/CTPlayer';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers/trans';

export function TranscriptionsWithRedux({
  media,
}) {
  return (
    <div className="msp-ee-con ct-a-fade-in">
      <div className="msp-ee">
        <CTFragment padding={30}>
          <CTPlayer
            media={media}
            width={540}
            height={315}
          />
        </CTFragment>
      </div>
    </div>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [],
  [],
  ['media']
);
