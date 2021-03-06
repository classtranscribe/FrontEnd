import React, { Component } from 'react';
import { CTLayout, CTFragment } from 'layout';
import { connect } from 'dva';
import TempVideoTimeTable from './components/TempVideoTimeTable';

const setup = {};
export class CourseAnalyticsWithRedux extends Component {
  componentDidMount() {
    // setup.setupCourseSettingsPage(this.offeringId);
  }

  render() {
    const { course } = this.props;
    const { offering } = course;
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
      },
      metaTagsProps: {
        title: 'Course Analytics'
      }
    }));

    if (offering && offering.fullNumber) {
      layoutProps.headingProps.heading = <><span>{offering.fullNumber}</span> Analytics</>;
      layoutProps.metaTagsProps.title = `Analytics | ${offering.fullNumber}`;
    }

    return (
      <CTLayout {...layoutProps}>
        <CTFragment padding={[20, 20]} loading={!offering}>
          {offering && <TempVideoTimeTable offeringId={offering.id} />}
        </CTFragment>
      </CTLayout>
    );
  }
}

export const CourseAnalytics = connect(({ course, loading }) => ({
  course
}))(CourseAnalyticsWithRedux);