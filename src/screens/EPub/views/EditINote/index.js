import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import { CTFragment, CTHeading, CTText, altEl } from 'layout';
import { connect } from 'dva'
import { EPubNavigationProvider } from '../../components';
import { epub as epubController, generateEPubGuide} from '../../controllers';
import INoteEditor from './INoteEditor';
import Instruction from '../EditEPubStructure/Instruction';
import EPubItemView from '../EditEPubStructure/EPubItemView';
import QuickActionsEditNote from '../EditEPubStructure/QuickActionsEditNote';

// import './index.scss';

function EditINote ({epub: epubData, dispatch}) {
  const dispatchScroll = _.debounce((e) => dispatch({ type: 'epub/onScroll', payload: e }), 300)
  const onScroll = (e) => dispatchScroll(e.target)

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
  const itemViewElem = altEl(EPubItemView, Boolean(ePubItem), {
    item: ePubItem, setEPubItem
  });
  
  const [iNoteItem, setINoteItem] = useState(null);
  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epubController.id.EPubChapterListID} onScroll={onScroll}>
        <CTFragment width="65%">
          <CTHeading>{epubData.title}</CTHeading>
          <INoteEditor> setINoteItem={setINoteItem} dispatch={dispatch} </INoteEditor>
        </CTFragment>
        <CTFragment sticky scrollY dFlexCol width="35%" padding={[30, 10]}>
          {itemViewElem}
          <QuickActionsEditNote />
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  )
}
export default connect(({epub: {epub}, loading }) => ({
    epub
  }))(EditINote);