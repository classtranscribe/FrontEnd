import React, { useEffect } from 'react';
import { CTFragment, altEl } from 'layout';
import { EPubNavigationProvider } from '../../components';
import { epub } from '../../controllers';
import ChapterEditor from './ChapterEditor';

function EditEPubChapter() {
  useEffect(() => {
    // add scroll event listener
    epub.nav.addScrollListenerForChapterList();
    // remove listener when component unmount
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <EPubNavigationProvider>
      <CTFragment dFlex justConCenter h100 scrollY id={epub.id.EPubChapterListID}>
        <CTFragment width="70%" minWidth="700px">
          <ChapterEditor />
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  );
}

export default EditEPubChapter;
