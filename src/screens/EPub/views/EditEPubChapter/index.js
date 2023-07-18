import React, { useEffect } from 'react';
import _ from 'lodash'
import { CTFragment } from 'layout';
import { connect } from 'dva'
import { EPubNavigationProvider } from '../../components';
import { epub } from '../../controllers';
import ChapterEditor from './ChapterEditor';
import Instruction from './Instruction';
import Toolbuttons from './Toolbuttons';
import './index.scss';

function EditEPubChapter({ dispatch }) {
  const dispatchScroll = _.debounce((e) => dispatch({ type: 'epub/onScroll', payload: e }), 300)
  const onScroll = (e) => dispatchScroll(e.target)

  return ( 
    <EPubNavigationProvider>
      <CTFragment dFlex h100 scrollY id={epub.id.EPubChapterListID} onScroll={onScroll}>
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

export default connect()(EditEPubChapter);
