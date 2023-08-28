import React, { useEffect, useState } from 'react';
import _ from 'lodash'
import { CTFragment, CTHeading, CTText } from 'layout';
import { connect } from 'dva'
import { EPubNavigationProvider } from '../../components';
import { epub as epubController} from '../../controllers';
import INoteEditor from './INoteEditor';

// import './index.scss';

function EditINote ({epub: epubData, dispatch}) {
  const dispatchScroll = _.debounce((e) => dispatch({ type: 'epub/onScroll', payload: e }), 300)
  const onScroll = (e) => dispatchScroll(e.target)
  
  const [iNoteItem, setINoteItem] = useState(null);
  return (
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epubController.id.EPubChapterListID} onScroll={onScroll}>
        <CTFragment width="75%">
          <CTHeading>{epubData.title}</CTHeading>
          <INoteEditor> setINoteItem={setINoteItem} dispatch={dispatch} </INoteEditor>
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  )
}
export default connect(({epub: {epub}, loading }) => ({
    epub
  }))(EditINote);