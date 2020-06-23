import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { NOT_FOUND_404, INSTRUCTOR } from 'utils';
import { CTLayout, CTFragment, CTErrorWrapper } from 'layout';
import {
  setup,
  courseStore,
  connectWithRedux
} from './controllers';
import './index.scss';

import { CourseInfo, Playlists } from './Components';


class CourseWithRedux extends Component {
  constructor(props) {
    super(props);

    this.offeringId = this.props.match.params.id;
    setup.init(props);
  }

  componentDidMount() {
    setup.setupCoursePage(this.offeringId);
  }

  render() {
    const { offering, role } = this.props;

    const layoutProps = CTLayout.createProps((sidebar) => ({
      transition: true,
      responsive: true,
      sidebarProps: role === INSTRUCTOR ? {
        items: sidebar.getCoursePageSidebarItems(offering)
      } : undefined
    }));

    const errorProps = {
      show: true,
      signInButton: false,
      code: 404,
      header: `Couldn't find the course.`,
      description: 'Please check if provided the URL is correct.'
    };

    const pageFragmentProps = CTFragment.createProps({
      id: 'cp-container',
      loading: offering === null,
      error: offering === NOT_FOUND_404,
      errorElement: <CTErrorWrapper {...errorProps} />
    });

    return (
      <CTLayout {...layoutProps}>
        <CTFragment {...pageFragmentProps}>
          <CourseInfo />
          <Playlists />
        </CTFragment>
      </CTLayout>
    );
  }
}

export const Course = withReduxProvider(
  CourseWithRedux,
  courseStore,
  connectWithRedux,
  ['offering', 'role'],
  ['all']
);
