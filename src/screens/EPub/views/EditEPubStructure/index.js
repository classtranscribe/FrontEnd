import React, { useState, useEffect } from 'react';
import _ from 'lodash'
import { CTFragment, altEl, CTHeading } from 'layout';
import { connect } from 'dva'
import { EPubNavigationProvider } from '../../components';
import { epub as epubController, generateEPubGuide } from '../../controllers';
import ChapterList from './ChapterList';
import Instruction from './Instruction';
import EPubItemView from './EPubItemView';
import QuickActions from './QuickActions';


function EditEPubStructure({ epub: epubData, dispatch }) {
  const [ePubItem, setEPubItem] = useState(null);
  const [instExp, setInstExp] = useState(true);

  const toggleInstExp = (e, newExpanded) => setInstExp(newExpanded);

  useEffect(() => {
    // show the user onboard guide if possible
    setTimeout(() => {
      const guide = generateEPubGuide();
      guide.start();
    }, 1000);
  }, []);

  useEffect(() => {
    if (Boolean(ePubItem) && instExp) {
      setInstExp(false);
    }
  }, [ePubItem]);
  const dispatchScroll = _.debounce((e) => dispatch({ type: 'epub/onScroll', payload: e }), 300)
  const onScroll = (e) => dispatchScroll(e.target)

  const itemViewElem = altEl(EPubItemView, Boolean(ePubItem), {
    item: ePubItem, setEPubItem
  });

  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epubController.id.EPubChapterListID} onScroll={onScroll}>
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

export default connect(({ epub: { epub }, loading }) => ({
  epub
}))(EditEPubStructure);
