import React from 'react';
import CTEPubGenerator from 'components/CTEPubGenerator';
import { connectWithRedux } from '../../controllers';

export function EpubWithRedux({ media }) {
  const { id, mediaName } = media || {};
  return <CTEPubGenerator mediaId={id} title={mediaName} />;
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  ['media']
);
