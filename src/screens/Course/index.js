import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { NOT_FOUND_404 } from 'utils';
import { CTLayout, CTFragment, CTErrorWrapper } from 'components';
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

  componentWillUnmount() {
    // setup.clear();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
    });

    const { offering } = this.props;

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
  ['offering'],
  ['all']
);
