import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'components';

import { historyStore, connectWithRedux, setup } from './controllers';
import { WatchHistories } from './Components';


class HistoryWithRedux extends Component {
  constructor(props) {
    super(props);

    setup.init(props);
  }

  componentDidMount() {
    setup.setupHisoryPage();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Watch History',
        icon: 'history',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    return (
      <CTLayout {...layoutProps}>
        <WatchHistories />
      </CTLayout>
    )
  }
}

export const History = withReduxProvider(
  HistoryWithRedux,
  historyStore,
  connectWithRedux,
  [],
  ['all']
);
