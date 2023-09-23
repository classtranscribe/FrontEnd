import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import cx from 'classnames';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CTFragment, CTHeading, CTText, altEl, useButtonStyles } from 'layout';
import { connect } from 'dva'
import Button from '@material-ui/core/Button';
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
  const btnStyles = useButtonStyles();
  const btnClasses = cx(btnStyles.tealLink, 'justify-content-start');
  const [iNoteItem, setINoteItem] = useState(null);
  const [hidden, setHidden] = useState(true);
  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epubController.id.EPubChapterListID} onScroll={onScroll}>
        <CTFragment width="100%">
          <CTHeading>{epubData.title}</CTHeading>
          <INoteEditor> setINoteItem={setINoteItem} dispatch={dispatch} </INoteEditor>
        </CTFragment>
        {hidden ?
          <>
            <CTFragment margin="10" padding={[5, 10]} width="12%">
              <CTFragment margin="10" padding={[5, 10]} width="auto">
                <ButtonGroup fullWidth>
                  <Button onClick={()=>setHidden(!hidden)}>Split</Button>
                </ButtonGroup>
              </CTFragment>
            </CTFragment>
          </>
        : <>
          <CTFragment margin="10" padding={[5, 10]} width="40%">
            <CTFragment margin="10" padding={[5, 10]} width="auto">
              <ButtonGroup fullWidth>
                <Button onClick={()=>setHidden(!hidden)}>Collapse</Button>
              </ButtonGroup>
            </CTFragment>
            <QuickActionsEditNote />
          </CTFragment>
          </>}
      </CTFragment>
    </EPubNavigationProvider>
  )
}
export default connect(({epub: {epub}, loading }) => ({
    epub
  }))(EditINote);