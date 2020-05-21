import React, { Fragment } from 'react';
import { Provider } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { mspStore, mspContext, connectWithRedux as mspConnect } from 'redux/media-settings';
import { getTab } from '../helpers';

import {
  TAB_EPUB,
  // TAB_EDIT_TRANS,
} from '../constants';

import EpubReduxProvider from './EpubReduxProvider';

function providerSelector(pathname) {
  const tab = getTab(pathname);
  switch (tab) {
    case TAB_EPUB:
      return EpubReduxProvider;
    default:
      return Fragment;
  }
}

function withMSPReduxProvider(MediaSettingsWithRedux) {
  const MspConnectToRedux = mspConnect(MediaSettingsWithRedux, [], ['all'], mspContext);

  function MSPReduxProvider(props) {
    const { pathname } = useLocation();

    const TabProvider = providerSelector(pathname);

    return (
      <Provider store={mspStore} context={mspContext}>
        <TabProvider>
          <MspConnectToRedux {...props} />
        </TabProvider>
      </Provider>
    );
  }

  return MSPReduxProvider;
}

export default withMSPReduxProvider;
