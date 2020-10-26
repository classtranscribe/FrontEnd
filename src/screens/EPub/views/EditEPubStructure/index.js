import React, { useState, useEffect } from 'react';
import { CTFragment, altEl } from 'layout';
import { EPubNavigationProvider } from '../../components';
import { epub } from '../../controllers';
import ChapterList from './ChapterList';
import EPubItemView from './EPubItemView';


function EditEPubStructure() {
  const [ePubItem, setEPubItem] = useState(null);

  useEffect(() => {
    const items = epub.data.data.items;
    if (items.length > 0) {
      console.log('----items[0]', items[0]);
      setEPubItem(items[0]);
    }

    epub.nav.addScrollListenerForChapterList();

    return epub.nav.removeScrollListenerForChapterList;
  }, []);

  const itemViewElem = altEl(EPubItemView, Boolean(ePubItem), {
    item: ePubItem, setEPubItem
  });

  const chListWidth = ePubItem ? '65%' : '80%';
  const itemVWidth = ePubItem ? '35%' : '0';

  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epub.id.EPubChapterListID}>
        <CTFragment width={chListWidth}>
          <ChapterList setEPubItem={setEPubItem} />
        </CTFragment>

        <CTFragment sticky scrollY dFlexCol width={itemVWidth}>
          {itemViewElem}
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  );
}

export default EditEPubStructure;
