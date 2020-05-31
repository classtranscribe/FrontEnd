import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'layout';
import { ARRAY_INIT } from 'utils';
import { setup, myCoursesStore, connectWithRedux } from './controllers';

import { CourseList } from './components';

class MyCoursesWithRedux extends Component {
  constructor(props) {
    super(props);

    setup.init(props);
  }

  componentDidMount() {
    setup.setupMyCoursesPage();
  }


  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'My Courses',
        icon: 'class',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    const { offerings, terms } = this.props;

    const {
      currentOfferings,
      pastOfferings
    } = setup.sortOfferings(offerings, terms);

    const loading = offerings === ARRAY_INIT;

    return (
      <CTLayout {...layoutProps}>
        <CTFragment loading={loading}>
          <CourseList title="Current Courses" offerings={currentOfferings} />
          <CourseList title="Past Courses" offerings={pastOfferings} />
        </CTFragment>
      </CTLayout>
    );
  }
}

export const MyCourses = withReduxProvider(
  MyCoursesWithRedux,
  myCoursesStore,
  connectWithRedux,
  ['offerings', 'terms'],
  ['all']
);
