import React, { useState } from 'react';
import { connect } from 'dva';
import { CTForm } from 'layout';
import { prompt, api } from 'utils';
import VisibilitySection from '../../NewCourse/components/CourseForm/Visibility';

export function VisibilityWithRedux(props) {
  const { dispatch, course } = props;
  const {
    offering
  } = course;

  const [logEventsFlag, setLogEventsFlag] = useState(offering.logEventsFlag);
  const [accessType, setAccess] = useState(offering.accessType);
  const [publishStatus, setPublishStatus] = useState(offering.publishStatus);

  const handleSave = async () => {
    const oldOffering = offering;
    const updatedOff = {
      id: oldOffering.id,
      sectionName: oldOffering.sectionName,
      termId: oldOffering.termId,
      courseName: oldOffering.courseName,
      description: oldOffering.description,
      accessType,
      logEventsFlag,
      publishStatus,
    };
    // update Model
    try {
      await api.updateOffering(updatedOff);
    } catch (error) {
      console.error(error);
      prompt.error('Failed to update the course visibility.');
      return;
    }
    
    dispatch({type: 'course/setOffering', payload: {...oldOffering, ...updatedOff}}); // update course info
    prompt.addOne({ text: 'Course visibility updated.', status: 'success', timeout: 3000 });
  }

  return (
    <CTForm
      collapsible
      id="visibility-form" 
      padding={[10, 35]}
      heading="Visibility"
      details="Publish status, visibillity, student performance settings"
      onSave={handleSave}
      onSaveButtonText="Update Visibility"
    >
      <VisibilitySection
        logEventsFlag={logEventsFlag}
        accessType={accessType}
        publishStatus={publishStatus}
        setLogEventsFlag={setLogEventsFlag}
        setAccess={setAccess}
        setPublishStatus={setPublishStatus}
      />
    </CTForm>
  );
}

export const Visibility = connect(({ course, loading }) => ({
  course
}))(VisibilityWithRedux);