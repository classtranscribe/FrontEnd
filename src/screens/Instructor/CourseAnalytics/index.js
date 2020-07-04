import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
import { courseStore, connectWithRedux, setup } from './controllers';
import TempVideoTimeTable from './components/TempVideoTimeTable';

export class CourseAnalyticsWithRedux extends Component {
  constructor(props) {
    super(props);
    this.offeringId = this.props.match.params.id;

    setup.init(props);
  }

  componentDidMount() {
    setup.setupCourseSettingsPage(this.offeringId);
  }

  render() {
    const { offering } = this.props;
    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Course Analytics',
        icon: 'bar_chart',
        sticky: true,
        gradient: true,
        offsetTop: 30,
      },
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      }
    }));

    return (
      <CTLayout {...layoutProps}>
        <CTFragment padding={[20, 20]} loading={!offering}>
          {offering && <TempVideoTimeTable offeringId={offering.id} />}
        </CTFragment>
      </CTLayout>
    );
  }
}

export const CourseAnalytics = withReduxProvider(
  CourseAnalyticsWithRedux,
  courseStore,
  connectWithRedux,
  ['offering'],
  ['all']
);
