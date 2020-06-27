import React, { Component } from 'react';
import { CTLayout } from 'layout';
import { api, user, prompt, links } from 'utils';
import { CourseForm } from './Components';

export class NewCourse extends Component {
  componentDidMount() {
    api.contentLoaded();
  }

  createCourseOfferings = async (courseIds, offeringId) => {
    await Promise
      .all(courseIds.map((courseId) => new Promise((resolve) => {
        api.createCourseOffering({ courseId, offeringId })
          .then(() => resolve());
      })))
      .catch((error) => {
        console.error(error);
      });    
  }

  createOffering = async (newOffering) => {
    const {
      sectionName,
      termId,
      accessType,
      logEventsFlag,
      courseName,
      description,
      courseIds,
    } = newOffering;

    let offeringId = null;

    try {
      const { userId } = user.getUserInfo();
      const { data } = await api.createOffering({
        offering: {
          sectionName,
          termId,
          accessType,
          logEventsFlag,
          courseName,
          description
        },
        courseId: courseIds[0],
        instructorId: userId
      });

      offeringId = data.id;
    } catch (error) {
      prompt.error('Failed to create the course.');
      return;
    }

    await this.createCourseOfferings(
      courseIds.slice(1),
      offeringId
    );

    prompt.addOne({
      text: 'Course Created.',
      header: 'Success',
      status: 'success',
      timeout: 2200,
      position: 'top',
      offset: [-1, -1],
    }, false);

    if (offeringId) {
      this.props.history.push(links.offeringDetail(offeringId));
    }
  };

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
        <CourseForm onSave={this.createOffering} />
      </CTLayout>
    );
  }
}
