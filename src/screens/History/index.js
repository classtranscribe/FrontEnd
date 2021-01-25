import React, { Component } from 'react';
import { CTLayout } from 'layout';
import { connect } from 'dva';
import WatchHistories from './components/WatchHistories';

const HistoryWithRedux = (props) => {
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
    },
    metaTagsProps: {
      title: 'History',
      description: 'Track your activities in ClassTranscribe.'
    }
  });

  return (
    <CTLayout {...layoutProps}>
      <WatchHistories />
    </CTLayout>
  )
}

export const History = connect(({ historypage, loading }) => ({
  historypage
}))(HistoryWithRedux);