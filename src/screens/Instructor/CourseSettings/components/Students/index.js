import React, { useEffect } from 'react';
import { useArray } from 'hooks';
import offControl from '../../controllers/offering.control';
import { EmailList } from '../EmailList';

export function Students(props) {
  const { match = {} } = props;
  const { id } = match.params;
  const students = useArray([]);

  const getStudents = async () => {
    const data = await offControl.getStudentsByOfferingId(id);
    students.setValue(data);
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleSave = ({
    addedEmails,
    removedEmails
  }) => {
    offControl.updateStudents(id, addedEmails, removedEmails);
  };

  return (
    <EmailList
      title="Students"
      description="Manage the students who can access this course"
      defaultEmails={students.value}
      onSave={handleSave}
    />
  );
}