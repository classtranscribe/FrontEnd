import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useArray } from 'hooks';
import { offControl } from '../../controllers';
import { EmailList } from '../EmailList';


export function Staffs() {
  const { id } = useParams();
  const instructors = useArray([]);

  const getInstructors = async () => {
    const data = await offControl.getInstructorsByOfferingId(id);
    instructors.setValue(data);
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const handleSave = ({
    addedEmails,
    removedEmails
  }) => {
    offControl.updateInstructors(id, addedEmails, removedEmails);
  };

  return (
    <EmailList
      title="Course Staffs"
      description="Manage the instructor access for course staffs"
      defaultEmails={instructors.value}
      onSave={handleSave}
    />
  );
}