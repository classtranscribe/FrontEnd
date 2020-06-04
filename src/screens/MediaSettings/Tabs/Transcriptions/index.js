import React from 'react';
import { connectWithRedux } from '../../controllers/trans';

export function TranscriptionsWithRedux(props) {
  return (
    <div />
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux
);
