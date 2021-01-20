import React, { useEffect } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import ErrorTypes from 'entities/ErrorTypes';
import { CTLayout, CTErrorWrapper } from 'layout';
import { InfoAndListLayout } from 'components';
import { INSTRUCTOR } from 'utils';
import { setup, courseStore, connectWithRedux } from './controllers';
import { CourseInfo, Playlists, CourseSearch } from './components';


function CourseWithRedux({ match, offering, role, playlist, ...props }) {
  useEffect(() => {
    setup.init(props);
    setup.setupCoursePage(match.params.id);
  }, [match]);

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
      { rightElem: <CourseSearch navbar /> }
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
        <Playlists />
      </InfoAndListLayout>
    </CTLayout>
  );
}

export const Course = withReduxProvider(
  CourseWithRedux,
  courseStore,
  connectWithRedux,
  ['offering', 'role', 'playlist'],
  ['all']
);
