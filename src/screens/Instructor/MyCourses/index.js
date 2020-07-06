import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment, CTFilter, CTErrorWrapper } from 'layout';
import { ARRAY_INIT, NOT_FOUND_404, links, api } from 'utils';
import { setup, myCoursesStore, connectWithRedux } from './controllers';

import { CourseList, NoCourseHolder } from './components';

class MyCoursesWithRedux extends Component {
  constructor(props) {
    super(props);

    setup.init(props);
  }

  componentDidMount() {
    setup.setupMyCoursesPage();
    links.title('My Courses');
  }


  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'My Courses',
        icon: 'collections_bookmark',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    const { offerings, terms } = this.props;
    const loading = offerings === ARRAY_INIT;
    const error = api.isError(offerings);
    const noOffering = !loading && offerings.length === 0;

    const offeringResult = (result) => {
      const {
        currentOfferings,
        pastOfferings
      } = setup.sortOfferings(result, terms);

      return (
        <CTFragment fade loading={loading} error={error}>
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

    const errorProps = {
      fixed: false,
      show: true,
      code: offerings,
      header: 'There is an error when loading your courses.',
      description: 'Please try to refresh page or contact us if have problems.',
      signInButton: false,
    };

    const fragmentProps = {
      padding: [0, 30],
      error,
      errorElement: <CTErrorWrapper {...errorProps} />
    };

    return (
      <CTLayout {...layoutProps}>
        <CTFragment {...fragmentProps}>
          {
            error ? null :
            noOffering ? (
              <NoCourseHolder />
            ) : (
              <CTFilter {...filterProps}>
                {offeringResult}
              </CTFilter>
            )
          }
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
