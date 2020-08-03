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

  const title = useInput(epubData.title, epub.data.saveEPubTitle);
  const filename = useInput(epubData.filename, epub.data.saveEPubFilename);
  const cover = useInput(epubData.cover, epub.data.saveEPubCover);
  const author = useInput(epubData.author, epub.data.saveEPubAuthor);

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
