import React, { useEffect } from 'react';
import { useArray } from 'hooks';
import { prompt, api, links } from 'utils';
import { EmailList } from '../EmailList';

async function getStudentsByOfferingId(offeringId) {
  try {
    const { data } = await api.getStudentsByOfferingId(offeringId);
    // console.log(data);
    return data;
  } catch (error) {
    prompt.error('Failed to get students.');
    return [];
  }
}

async function updateStudents(offeringId, addedEmails, removedEmails) {
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
export function Students(props) {
  const { match = {} } = props;
  const { id } = match.params;
  const students = useArray([]);

  const getStudents = async () => {
    const data = await getStudentsByOfferingId(id);
    students.setValue(data);
  };

  useEffect(() => {
    getStudents();
  }, []);

  const handleSave = ({
    addedEmails,
    removedEmails
  }) => {
    updateStudents(id, addedEmails, removedEmails);
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