import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';
import { homeStore, connectWithRedux, home } from './controllers';
import { SectionList } from './components';

class HomeWithRedux extends Component {
  constructor(props) {
    super(props);

    home.state.init(props);
  }

  componentDidMount() {
    home.ctrl.setupHomepage();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
    });

    return (
      <CTLayout {...layoutProps}>
        <SectionList />
      </CTLayout>
    )
  }
}

export const Home = withReduxProvider(
  HomeWithRedux,
  homeStore,
  connectWithRedux,
  [],
  ['all']
);
