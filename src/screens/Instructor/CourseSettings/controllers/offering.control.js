import _ from 'lodash';
import { prompt, api, links } from 'utils';
import { setup } from './setup';

class OfferingControl {
  constructor() {
    this.updateCourseInfo = this.updateCourseInfo.bind(this);
  }

  async updateCourseOfferings(newOffering) {
    const oldOffering = setup.offering;
    const offeringId = setup.offering.id;
    let newCourses = newOffering.courseIds;
    let oldCourses = _.map(oldOffering.courses, course => course.id);

    let added = _.difference(newCourses, oldCourses);
    let removed = _.difference(oldCourses, newCourses);

    // link added courses to this offering
    if (added.length > 0) {
      await Promise
      .all(added.map((courseId) => new Promise((resolve) => {
        api.createCourseOffering({ courseId, offeringId })
          .then(() => resolve());
      })))
      .catch((error) => {
        console.error(error);
        prompt.error('Failed to remove course.');
      });
    }

    if (removed.length > 0) {
      await Promise
      .all(removed.map((courseId) => new Promise((resolve) => {
        api.deleteCourseOffering(courseId, offeringId)
          .then(() => resolve());
      })))
      .catch((error) => {
        console.error(error);
        prompt.error('Failed to add course.');
      });
    }
  }

  async updateCourseInfo(newOffering) {
    const oldOffering = setup.offering;
    const updatedOff = {
      id: oldOffering.id,
      sectionName: newOffering.sectionName,
      termId: newOffering.termId,
      accessType: newOffering.accessType,
      logEventsFlag: newOffering.logEventsFlag,
      courseName: newOffering.courseName,
      description: newOffering.description,
    };

    try {
      await api.updateOffering(updatedOff);
      // update state ?
      setup.setOffering({ ...setup.offering, ...updatedOff })
    } catch (error) {
      console.error(error);
      prompt.error('Failed to update the course info.');
      return;
    }

    // handle linked course templates ?
    // await this.updateCourseOfferings(newOffering);

    prompt.addOne({ text: 'Course information updated.', timeout: 3000 });
  }

  async deleteOffering(history) {
    const offeringId = setup.offering.id;
    try {
      await api.deleteOffering(offeringId);
      prompt.addOne({ text: 'Course deleted.', timeout: 3000 });
      history.push(links.myCourses());
    } catch (error) {
      console.error(error);
      prompt.error('Failed to delete the course.');
    }
  }

  async getInstructorsByOfferingId(offeringId) {
    try {
      const { data } = await api.getInstructorsByOfferingId(offeringId);
      // console.log(data);
      return data;
    } catch (error) {
      prompt.error('Failed to get instructors.');
      return [];
    }
  }

  async updateInstructors(offeringId, addedEmails, removedEmails) {
    try {
      if (addedEmails.length > 0) {
        await api.addInstructorsToOffering(offeringId, addedEmails);
      }

      if (removedEmails.length > 0) {
        await api.deleteInstructorsFromOffering(offeringId, removedEmails);
      }

      prompt.addOne({ text: 'Updated instructor list.', timeout: 3000 });
    } catch (error) {
      prompt.error('Failed to update instructor list.');
    }
  }

  async getStudentsByOfferingId(offeringId) {
    try {
      const { data } = await api.getStudentsByOfferingId(offeringId);
      // console.log(data);
      return data;
    } catch (error) {
      prompt.error('Failed to get students.');
      return [];
    }
  }

  async updateStudents(offeringId, addedEmails, removedEmails) {
    try {
      if (addedEmails.length > 0) {
        await api.addStudentsToOffering(offeringId, addedEmails);
      }
  
      if (removedEmails.length > 0) {
        await api.deleteStudentsFromOffering(offeringId, removedEmails);
      }
  
      prompt.addOne({ text: 'Updated student list.', timeout: 3000 });
    } catch (error) {
      prompt.error('Failed to update student list.');
    }
  }
}

export const offControl = new OfferingControl();
