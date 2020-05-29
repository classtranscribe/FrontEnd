import React from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'components';

import {
  searchStore,
  connectWithRedux,
  setup,
} from './controllers';

class SearchWithRedux extends React.Component {
  constructor(props) {
    super();

    setup.init(props);
  }

  componentDidMount() {
    setup.setupSearchPage();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      headerProps: {
        subtitle: 'Search'
      },
      headingProps: {
        heading: 'Search',
        icon: 'search',
        sticky: true,
        gradient: true,
      }
    });

    return (
      <CTLayout {...layoutProps}>
        Search
      </CTLayout>
    )
  }
}

export const Search = withReduxProvider(
  SearchWithRedux,
  searchStore,
  connectWithRedux,
  [],
  ['all']
);
