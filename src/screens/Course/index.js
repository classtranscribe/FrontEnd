import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import ErrorTypes from 'entities/ErrorTypes';
import { INSTRUCTOR } from 'utils';
import { CTLayout, CTErrorWrapper } from 'layout';
import { InfoAndListLayout } from 'components';
import { useLocation } from 'react-router-dom';
import UserEventManager from 'entities/UserEvent';
import pathToRegexp from 'path-to-regexp';
import { CourseInfo, Playlists } from './components';
import { loadCourse } from './courseThunks';


const CourseWithRedux = (props) => {
  const { course } = props;
  const { offering, role, playlist } = course;
  const location = useLocation()
  const dispatch = useDispatch()

  useEffect(() => {
    const match = pathToRegexp('/offering/:id/:option?').exec(location.pathname);
    if (match) {
      const offeringId = match[1];
      const uevent = new UserEventManager();
      uevent.selectcourse(offeringId);
      dispatch(loadCourse(offeringId));
    }
  }, [dispatch, location]);


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
      { search: false }
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

export const Course = connect(({ course }) => ({
  course
}))(CourseWithRedux);