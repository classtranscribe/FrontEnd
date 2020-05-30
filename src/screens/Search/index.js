import React from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';

import {
  searchStore,
  connectWithRedux,
  setup,
} from './controllers';

import {
  SearchInput,
  SearchResult
} from './Components';

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
      footer: true,
      headingProps: {
        heading: 'Search',
        icon: 'search',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    return (
      <CTLayout {...layoutProps}>
        <SearchInput />
        <SearchResult />
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
