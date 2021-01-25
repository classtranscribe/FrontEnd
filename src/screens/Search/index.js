import React from 'react';
import { connect } from 'dva';
import { CTLayout } from 'layout';
import SearchInput from './components/SearchInput';
import SearchResult from './components/SearchResult';

const SearchWithRedux = (props) => {
  const layoutProps = CTLayout.createProps({
    transition: true,
    responsive: true,
    footer: true,
    headingProps: {
      heading: 'Search',
      icon: 'search',
      sticky: true,
      gradient: true,
      offsetTop: 30,
    },
    metaTagsProps: {
      title: 'Search',
      description: 'Find your courses in ClassTranscribe.'
    }
  });

  return (
    <CTLayout {...layoutProps}>
      <SearchInput {...props} />
      <SearchResult {...props} />
    </CTLayout>
  );
}

export const Search = connect(({ search, loading }) => ({
  search
}))(SearchWithRedux);