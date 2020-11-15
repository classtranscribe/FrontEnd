import React, { useEffect } from 'react';
import { CTFragment } from 'layout';
import { EPubNavigationProvider } from '../../components';
import { epub } from '../../controllers';
import ChapterEditor from './ChapterEditor';
import Instruction from './Instruction';
import Toolbuttons from './Toolbuttons';
import './index.scss';

function EditEPubChapter() {
  useEffect(() => {
    // add scroll event listener
    epub.nav.addScrollListenerForChapterList();
    // remove listener when component unmount
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epub.id.EPubChapterListID}>
        <CTFragment width="67%">
          <ChapterEditor />
        </CTFragment>

        <CTFragment
          className="ct-epb ech-tool-bar"
          sticky
          h100
          dFlexCol
          scrollY
          justConBetween
        >
          <Instruction />
          <Toolbuttons />
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  );
}

export default EditEPubChapter;
