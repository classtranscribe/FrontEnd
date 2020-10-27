import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { EPubNavigationProvider } from '../../components';
import { epub } from '../../controllers';
import EPubPreview from './EPubPreview';
import DownloadOptions from './DownloadOptions';

function ViewAndDownload() {
  useEffect(() => {
    // add scroll event listener
    epub.nav.addScrollListenerForChapterList();
    // remove listener when component unmount
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epub.id.EPubChapterListID}>
        <CTFragment width="70%" height="max-content" padding={[40,20,100,20]}>
          <EPubPreview />
        </CTFragment>

        <CTFragment width="30%" sticky scrollY dFlexCol padding={[30, 10]}>
          <DownloadOptions />
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  );
}

export default ViewAndDownload;
