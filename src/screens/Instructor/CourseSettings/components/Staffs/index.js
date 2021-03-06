import React, { useEffect } from 'react';
import { useArray } from 'hooks';
import { prompt, api, links } from 'utils';
import { EmailList } from '../EmailList';

async function getInstructorsByOfferingId(offeringId) {
  try {
    const { data } = await api.getInstructorsByOfferingId(offeringId);
    // console.log(data);
    return data;
  } catch (error) {
    prompt.error('Failed to get instructors.');
    return [];
  }
}
async function updateInstructors(offeringId, addedEmails, removedEmails) {
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
export function Staffs(props) {
  const { match = {} } = props;
  const { id } = match.params;
  const instructors = useArray([]);
  
  const getInstructors = async () => {
    try {
      const data = await getInstructorsByOfferingId(id);
      instructors.setValue(data.slice().reverse());
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getInstructors();
  }, []);

  const handleSave = async ({ addedEmails, removedEmails }) => {
    await updateInstructors(id, addedEmails, removedEmails);
    getInstructors();
  };

  return (
    <EmailList
      title="Course Staff"
      description="Manage the instructor access for course staff"
      defaultEmails={instructors.value}
      onSave={handleSave}
    />
  );
}