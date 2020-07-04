import React, { Component } from 'react';
import { CTLayout, CTFragment, CTErrorWrapper } from 'layout';
import { api, links } from 'utils';
import WatchTimeAnalytics from './Components/WatchTimeAnalytics/WatchTimeAnalytics';

export class Analytics extends Component {
  componentDidMount() {
    api.contentLoaded();
    links.title('Analytics');
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Personal Analytics',
        icon: 'bar_chart',
        sticky: true,
        gradient: true,
        offsetTop: 30,
      },
    });

    return (
      <>
        <CTLayout {...layoutProps}>
          <CTFragment>
            <WatchTimeAnalytics />
          </CTFragment>
        </CTLayout>
      </>
    );
  }
}
