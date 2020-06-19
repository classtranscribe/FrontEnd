import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment, CTFilter } from 'layout';
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
    const loading = offerings === ARRAY_INIT;

    const offeringResult = (result) => {
      const {
        currentOfferings,
        pastOfferings
      } = setup.sortOfferings(result, terms);

      return (
        <CTFragment fade loading={loading}>
          <CourseList title="Current Courses" offerings={currentOfferings} />
          <CourseList title="Past Courses" offerings={pastOfferings} />
        </CTFragment>
      );
    };

    const filterProps = {
      withDefaultFilter: true,
      data: offerings,
      keys: ['courseName', 'fullNumber', 'sectionName', 'termName']
    };

    return (
      <CTLayout {...layoutProps}>
        <CTFragment padding={[0, 30]}>
          <CTFilter {...filterProps}>
            {offeringResult}
          </CTFilter>
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
