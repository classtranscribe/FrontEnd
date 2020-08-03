import React from 'react';
import CTEPubGenerator from 'components/CTEPubGenerator';
import { connectWithRedux } from '../../controllers';

export function EpubWithRedux({ media }) {
  const { mediaName } = media || {};
  return <CTEPubGenerator media={media} title={mediaName} />;
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  ['media']
);
