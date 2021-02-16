import React, { useEffect } from 'react';
import _ from 'lodash'
import { CTFragment } from 'layout';
import { connect } from 'dva'
import { EPubNavigationProvider } from '../../components';
import { epub } from '../../controllers';
import EPubPreview from './EPubPreview';
import EditOptions from './EditOptions';
import DownloadOptions from './DownloadOptions';

function ViewAndDownload({ dispatch }) {
  const dispatchScroll = _.debounce((e) => dispatch({ type: 'epub/onScroll', payload: e }), 300)
  const onScroll = (e) => dispatchScroll(e.target)
  
  return (
    <EPubNavigationProvider defaultClosed>
      <CTFragment dFlex h100 scrollY id={epub.id.EPubChapterListID} onScroll={onScroll}>
        <CTFragment width="70%" height="max-content" padding={[40, 20, 100, 20]}>
          <EPubPreview />
        </CTFragment>

        <CTFragment width="30%" sticky scrollY dFlexCol padding={[30, 10]}>
          <EditOptions />
          <DownloadOptions />
        </CTFragment>
      </CTFragment>
    </EPubNavigationProvider>
  );
}

export default connect()(ViewAndDownload);
