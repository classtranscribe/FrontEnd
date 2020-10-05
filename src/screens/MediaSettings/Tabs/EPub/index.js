import React from 'react';
// import CTEPubGenerator from 'components/CTEPubGenerator';
import CTEPubListScreen from 'components/CTEPubListScreen';
import SourceTypes from 'entities/SourceTypes';
import { connectWithRedux } from '../../controllers';

export function EpubWithRedux({ media }) {
  const { id, mediaName } = media || {};
  const ePubLiProps = {
    sourceType: SourceTypes.Media,
    sourceId: id,
    source: media,
    defaultTitle: mediaName
  };
  return <CTEPubListScreen {...ePubLiProps} />;
}

export const EPub = connectWithRedux(
  EpubWithRedux,
  ['media']
);
