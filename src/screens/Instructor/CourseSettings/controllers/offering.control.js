import _ from 'lodash';
import { prompt, api, links } from 'utils';
import { setup } from './setup';

class OfferingControl {
  constructor() {
    this.updateCourseInfo = this.updateCourseInfo.bind(this);
    this.updateCourseVisibility = this.updateCourseVisibility.bind(this);
  }

  async updateCourseOfferings(newOffering) {
    const oldOff = setup.offering;
    const offeringId = setup.offering.id;
    let newCourses = newOffering.courseIds;
    let oldCourses = _.map(oldOff.courses, course => course.courseId);

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

  async updateCourseVisibility(newOffering) {
    const oldOff = setup.offering;
    const updatedOff = {
      id: oldOff.id,
      accessType: newOffering.accessType,
      logEventsFlag: newOffering.logEventsFlag,
      publishStatus: newOffering.publishStatus
    };

    try {
      await api.updateOffering(updatedOff);
    } catch (error) {
      console.error(error);
      prompt.error('Failed to update the course info.');
      return;
    }

    prompt.addOne({ text: 'Course visibility updated.', timeout: 3000 });
    setup.setupCourseSettingsPage(oldOff.id);
  }

  async updateCourseInfo(newOffering) {
    const oldOff = setup.offering;
    const updatedOff = {
      id: oldOff.id,
      sectionName: newOffering.sectionName || oldOff.sectionName,
      termId: newOffering.termId || oldOff.termId,
      courseName: newOffering.courseName || oldOff.courseName,
      description: newOffering.description || oldOff.description,
      accessType: typeof newOffering.accessType === 'number' 
                  ? newOffering.accessType : oldOff.accessType,
      logEventsFlag: typeof newOffering.logEventsFlag === 'boolean' 
                  ? newOffering.logEventsFlag : oldOff.logEventsFlag,
      publishStatus: typeof newOffering.publishStatus === 'number' 
                  ? newOffering.publishStatus : oldOff.publishStatus
    };

    try {
      await api.updateOffering(updatedOff);
    } catch (error) {
      console.error(error);
      prompt.error('Failed to update the course info.');
      return;
    }

    // handle linked course templates ?
    if (Array.isArray(newOffering.courseIds)) {
      await this.updateCourseOfferings(newOffering);
    }

    prompt.addOne({ text: 'Course information updated.', timeout: 3000 });
    setup.setupCourseSettingsPage(oldOff.id);
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
