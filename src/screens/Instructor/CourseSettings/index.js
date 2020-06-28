import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
import { courseStore, connectWithRedux, setup } from './controllers';
import { Students, Staffs, CourseInfo, RemoveCourse } from './Components';

class CourseSettingsWithRedux extends Component {
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
        heading: 'Course Settings',
        icon: 'settings',
        sticky: true,
        gradient: true,
        offsetTop: 30
      },
      sidebarProps: {
        items: sidebar.getCoursePageSidebarItems(offering)
      }
    }));

    const loading = !offering;

    return (
      <CTLayout {...layoutProps}>
        <CTFragment loading={loading}>
          <CourseInfo />
          <Students />
          <Staffs />
          <RemoveCourse />
        </CTFragment>
      </CTLayout>
    );
  }
}

export const CourseSettings = withReduxProvider(
  CourseSettingsWithRedux,
  courseStore,
  connectWithRedux,
  ['offering'],
  ['all']
);
