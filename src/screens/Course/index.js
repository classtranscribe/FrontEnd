import React, { Component } from 'react';
import { connect } from 'dva';
import ErrorTypes from 'entities/ErrorTypes';
import { INSTRUCTOR } from 'utils';
import { CTLayout, CTErrorWrapper } from 'layout';
import { InfoAndListLayout } from 'components';
import { CourseInfo, Playlists } from './components';


const CourseWithRedux = (props) => {
  const { course } = props;
  const { offering, role, playlist } = course;
  const offeringLoaded = offering && offering.id;
  const playlistLoaded = playlist && playlist.id;

  const isInstructor = role === INSTRUCTOR;

  const layoutProps = CTLayout.createProps((sidebar) => ({
    transition: true,
    responsive: true,
    sidebarProps: isInstructor ? {
      items: sidebar.getCoursePageSidebarItems(offering)
    } : undefined,
    metaTagsProps: offeringLoaded ? {
      title: playlistLoaded
        ? `${playlist.name} | ${offering.fullNumber}`
        : offering.fullNumber,
      description: offering.description
    } : undefined,
    // temp, need to change back
    headerProps:
      // !isInstructor ? {
      //   subtitle: 'Course Admin'
      // } :
      { search: true }
  }));

  const errorProps = {
    show: true,
    signInButton: false,
    code: 404,
    header: `Couldn't find the course.`,
    description: 'Please check if provided the URL is correct.'
  };

  const pageFragmentProps = {
    id: 'cp-container',
    loading: offering === null,
    error: offering === ErrorTypes.NotFound404,
    errorElement: <CTErrorWrapper {...errorProps} />
  };

  return (
    <CTLayout {...layoutProps}>
      <InfoAndListLayout {...pageFragmentProps}>
        <CourseInfo />
        <Playlists {...props} />
      </InfoAndListLayout>
    </CTLayout>
  );
}

export const Course = connect(({ course, loading }) => ({
  course
}))(CourseWithRedux);