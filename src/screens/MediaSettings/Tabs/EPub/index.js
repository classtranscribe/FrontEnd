import React from 'react';
import CTEPubListScreen from 'components/CTEPubListScreen';
import SourceTypes from 'entities/SourceTypes';
import { useCTDocTitle } from 'hooks';
import { connectWithRedux } from '../../controllers';

export function EpubWithRedux({ media }) {
  const { id, mediaName = '' } = media || {};

  useCTDocTitle(`ePubs | ${mediaName}`);

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
