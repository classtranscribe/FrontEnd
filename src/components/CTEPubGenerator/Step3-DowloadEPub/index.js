import React from 'react';
import { useInput } from 'hooks';
import { epub } from '../controllers';
import { connectWithRedux } from '../redux';
import { ChapterNavigationProvider } from '../components';
import EPubPreviewer from './EPubPreviewer';
import DownloadBar from './DownloadBar';
import './index.scss';

function DowloadEPub({ chapters }) {
  const epubData = epub.data.data;
  const screenshots = epubData.images;

  const title = useInput(epubData.title, val => { epubData.title = val; });
  const filename = useInput(epubData.filename, val => { epubData.filename = val; });
  const cover = useInput(epubData.cover, val => { epubData.cover = val; });
  const author = useInput(epubData.author, val => { epubData.author = val; });

  return (
    <ChapterNavigationProvider>
      <div 
        id={epub.const.DownloadEPubContainerID}
        className="ct-epb step-con ct-a-fade-in"
      >
        <EPubPreviewer chapters={chapters} title={title.value} />
        <DownloadBar
          title={title}
          filename={filename}
          cover={cover}
          author={author}
          screenshots={screenshots}
        />
      </div>
    </ChapterNavigationProvider>
  );
}

export default connectWithRedux(
  DowloadEPub,
  ['chapters']
);
