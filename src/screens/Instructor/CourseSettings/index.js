import React, { Component } from 'react';
import { CTLayout, CTFragment } from 'layout';
import { connect } from 'dva';
import { Students, Staffs, CourseInfo, RemoveCourse } from './components';

const CourseSettingsWithRedux = (props) => {
  const { course } = props;
  const { offering } = course;
  const loading = !offering;

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
    },
    metaTagsProps: {
      title: 'Course Settings'
    }
  }));

  if (!loading && offering.fullNumber) {
    layoutProps.headingProps.heading = <><span>{offering.fullNumber}</span> Settings</>;
    layoutProps.metaTagsProps.title = `Settings | ${offering.fullNumber}`;
  }

  return (
    <CTLayout {...layoutProps}>
      <CTFragment loading={loading} padding={[0, 30]}>
        <CourseInfo />
        {(offering && offering.accessType === 2) && <Students {...props} />}
        <Staffs {...props} />
        <RemoveCourse {...props} />
      </CTFragment>
    </CTLayout>
  );
}

export const CourseSettings = connect(({ course, loading }) => ({
  course
}))(CourseSettingsWithRedux);