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
    let layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      headerProps: {
        subtitle: 'Search'
      },
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
