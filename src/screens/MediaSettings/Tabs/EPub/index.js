import React from 'react';
import CTEPubListScreen from 'components/CTEPubListScreen';
import SourceTypes from 'entities/SourceTypes';
import { useCTDocTitle } from 'hooks';
import { connect } from 'dva';

export function EpubWithRedux(props) {
  const { mediasetting } = props;
  const { media } = mediasetting;
  const { id, mediaName = '' } = media || {};

  useCTDocTitle(`I-Notes | ${mediaName}`);

  const ePubLiProps = {
    sourceType: SourceTypes.Media,
    sourceId: id,
    source: media,
    defaultTitle: mediaName
  };

  return <CTEPubListScreen {...ePubLiProps} />;
}

export const EPub = connect(({ mediasetting, loading }) => ({
  mediasetting
}))(EpubWithRedux);
