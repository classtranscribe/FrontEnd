import React, { useEffect, useState } from 'react';
import _ from 'lodash'

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CTFragment, CTHeading} from 'layout';
import { connect } from 'dva'
import Button from '@material-ui/core/Button';
import { EPubNavigationProvider } from '../../components';
import { epub as epubController} from '../../controllers';
import INoteEditor from './INoteEditor';
import QuickActionsEditNote from './QuickActionsEditNote';




function EditINote ({epub: epubData, dispatch}) {
  const dispatchScroll = _.debounce((e) => dispatch({ type: 'epub/onScroll', payload: e }), 300)
  const onScroll = (e) => dispatchScroll(e.target)

  const [iNoteItem, setINoteItem] = useState(null);
  const [hidden, setHidden] = useState(true);

  const menustyle_short = {
    transition: "width 100ms linear, padding 100ms linear",
    margin: "10",
    width: "12%"
  };
  const menustyle_extended = {
    transition: "width 100ms linear, padding 100ms linear",
    margin: "10",
    width: "28%"
  };
  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epubController.id.EPubChapterListID} onScroll={onScroll}>
        <CTFragment width="100%">
          <CTHeading>{epubData.title}</CTHeading>
          <INoteEditor> setINoteItem={setINoteItem} dispatch={dispatch} </INoteEditor>
        </CTFragment>
        {hidden ?
          <>
            <CTFragment style={menustyle_short} sticky scrollY dFlexCol padding={[5, 10]}>
              <CTFragment margin="10" padding={[5, 10]} width="auto">
                <ButtonGroup fullWidth>
                  <Button onClick={()=>setHidden(!hidden)}>Split</Button>
                </ButtonGroup>
              </CTFragment>
            </CTFragment>
          </>
        : <>
          <CTFragment style={menustyle_extended} sticky scrollY dFlexCol padding={[5, 10]}>
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