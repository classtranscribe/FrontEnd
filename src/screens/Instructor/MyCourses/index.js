import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout } from 'layout';
import { setup, myCoursesStore, connectWithRedux } from './controllers';

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

    return (
      <CTLayout {...layoutProps} />
    );
  }
}

export const MyCourses = withReduxProvider(
  MyCoursesWithRedux,
  myCoursesStore,
  connectWithRedux,
  [],
  ['all']
);
