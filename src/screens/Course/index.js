import React, { Component } from 'react';
import { withReduxProvider } from 'redux/redux-provider';
import { CTLayout, CTFragment } from 'components';
import {
  setup,
  courseStore,
  connectWithRedux
} from './controllers';
import './index.scss';


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
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      // footer: true
    });

    return (
      <CTLayout {...layoutProps}>
        <CTFragment id="cp-container" />
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
