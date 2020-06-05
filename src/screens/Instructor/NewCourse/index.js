import React, { Component, useState } from 'react';
import { CTLayout } from 'layout';

import { CTFormExampleUsage } from 'layout/CTForm/ExampleUsage';
import { api } from 'utils';
import {CourseForm} from './Components'

export class NewCourse extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  render() {
    const layoutProps = CTLayout.createProps({
      transition: true,
      responsive: true,
      footer: true,
      headingProps: {
        heading: 'Create a New Course',
        icon: 'add',
        sticky: true,
        gradient: true,
        offsetTop: 30
      }
    });

    return (
      <CTLayout {...layoutProps}>
        <CourseForm />
      </CTLayout>
    )
  }
}
