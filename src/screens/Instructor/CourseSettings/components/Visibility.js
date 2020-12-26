import React, { useState } from 'react';
import { CTFragment, CTForm, CTFormRow } from 'layout';
import { connectWithRedux, offControl } from '../controllers';
import VisibilitySection from '../../NewCourse/components/CourseForm/Visibility';

function VisibilityWithRedux({ offering }) {
  const [logEventsFlag, setLogEventsFlag] = useState(offering.logEventsFlag);
  const [accessType, setAccess] = useState(offering.accessType);
  const [publishStatus, setPublishStatus] = useState(offering.publishStatus);

  const handleSave = () => {
    offControl.updateCourseInfo({ logEventsFlag, accessType, publishStatus });
  }

  return (
    <CTForm
      collapsible
      id="visibility-form" 
      padding={[10, 35]}
      heading="Visibility"
      details="Publish status, visibillity, student performance settings"
      onSave={handleSave}
      onSaveButtonText="Update Course"
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

export const Visibility = connectWithRedux(
  VisibilityWithRedux,
  ['offering']
);
