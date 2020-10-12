import React from 'react';
import { epub } from '../controllers';
import { connectWithRedux } from '../redux';
import { ChapterNavigationProvider, useEPubInfo } from '../components';
import EPubPreviewer from './EPubPreviewer';
import DownloadBar from './DownloadBar';
import './index.scss';

function DowloadEPub({ chapters }) {
  const epubInfo = useEPubInfo();

  return (
    <ChapterNavigationProvider>
      <div 
        id={epub.const.DownloadEPubContainerID}
        className="ct-epb step-con ct-a-fade-in"
      >
        <EPubPreviewer chapters={chapters} title={epubInfo.title.value} />
        <DownloadBar {...epubInfo} />
      </div>
    </ChapterNavigationProvider>
  );
}

export default connectWithRedux(
  DowloadEPub,
  ['chapters']
);
