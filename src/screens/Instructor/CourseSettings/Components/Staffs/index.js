import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useArray } from 'hooks';
import { offControl } from '../../controllers';
import { EmailList } from '../EmailList';


export function Staffs() {
  const { id } = useParams();
  const instructors = useArray([]);

  useEffect(async () => {
    const data = await offControl.getInstructorsByOfferingId(id);
    instructors.setValue(data);
  }, []);

  const handleSave = ({
    addedEmails,
    removedEmails
  }) => {
    offControl.updateInstructors(id, addedEmails, removedEmails);
  };

  return (
    <EmailList
      title="Staffs"
      description="Add staffs"
      defaultEmails={instructors.value}
      onSave={handleSave}
    />
  );
}