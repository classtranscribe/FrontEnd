import React, { useEffect } from 'react';
import { useParams } from 'dva/router';
import { useArray } from 'hooks';
import offControl from '../../controllers/offering.control';
import { EmailList } from '../EmailList';


export function Staffs(props) {
  const { match = {} } = props;
  const { id } = match.params;
  const instructors = useArray([]);

  const getInstructors = async () => {
    try {
      const data = await offControl.getInstructorsByOfferingId(id);
      instructors.setValue(data.slice().reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const handleSave = async ({ addedEmails, removedEmails }) => {
    await offControl.updateInstructors(id, addedEmails, removedEmails);
    getInstructors();
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