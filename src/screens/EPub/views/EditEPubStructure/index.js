import React, { useState, useEffect } from 'react';
import { CTFragment, altEl, CTHeading } from 'layout';
import { EPubNavigationProvider } from '../../components';
import { epub, connectWithRedux } from '../../controllers';
import ChapterList from './ChapterList';
import Instruction from './Instruction';
import EPubItemView from './EPubItemView';
import QuickActions from './QuickActions';


function EditEPubStructure(props) {
  const epubData = props.epub;
  const [ePubItem, setEPubItem] = useState(null);
  const [instExp, setInstExp] = useState(true);

  const toggleInstExp = (e, newExpanded) => setInstExp(newExpanded);

  useEffect(() => {
    // add scroll event listener
    epub.nav.addScrollListenerForChapterList();

    // remove listener when component unmount
    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  useEffect(() => {
    if (Boolean(ePubItem) && instExp) {
      setInstExp(false);
    }
  }, [ePubItem]);

  const itemViewElem = altEl(EPubItemView, Boolean(ePubItem), {
    item: ePubItem, setEPubItem
  });

  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epub.id.EPubChapterListID}>
        <CTFragment width="65%">
          <CTHeading>{epubData.title}</CTHeading>
          <ChapterList setEPubItem={setEPubItem} />
        </CTFragment>

        <CTFragment sticky scrollY dFlexCol width="35%" padding={[30, 10]}>
          <Instruction expanded={instExp} onToggle={toggleInstExp} />
          {itemViewElem}
          <QuickActions />
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  );
}

export default connectWithRedux(
  EditEPubStructure,
  ['epub']
);
