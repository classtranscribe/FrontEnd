import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';
import { api } from 'utils';
import {
  setup,
  exampleStore,
  connectWithRedux
} from './controllers';

import { OfferingList } from './components';

class ExampleWithRedux extends Component {
  constructor(props) {
    super(props);
    setup.init(props);
  }

  componentDidMount() {
    setup.setupExamplePage();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      responsive: true,
      transition: true,
      headingProps: {
        heading: 'Example',
        icon: 'add'
      }
    });

    return (
      <CTLayout {...layoutProps}>
        <OfferingList />
      </CTLayout>
    );
  }
}

export const Example = withReduxProvider(
  ExampleWithRedux,
  exampleStore,
  connectWithRedux,
  ['offerings'],
  ['all']
);
