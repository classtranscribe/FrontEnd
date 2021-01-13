import React, { useState } from 'react';
import { Button } from 'pico-ui';
import { CTForm, CTFormHelp, CTConfirmation } from 'layout';
import { prompt, api, links } from 'utils';

export function RemoveCourse(props) {
  const { history, course } = props;
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleConfirm = () => setOpenConfirm(true);
  const handleCancelConfirm = () => setOpenConfirm(false);

  const handleDelete = async () => {
    setOpenConfirm(false);
    const offeringId = course.offering.id;
    try {
      await api.deleteOffering(offeringId);
      prompt.addOne({ text: 'Course deleted.', timeout: 3000 });
      history.push(links.myCourses());
    } catch (error) {
      console.error(error);
      prompt.error('Failed to delete the course.');
    }
  };

  return (
    <>
      <CTForm
        collapsible
        danger
        heading="Remove Course"
        padding={[10, 35]}
        id="course-remove"
        details="Delete this course from your courses."
      >
        <CTFormHelp severity="warning" title="Removed courses cannot be restored">
          Removing the course will delete all related resources 
          including its playlists, videos, and files uploaded.
        </CTFormHelp>
        <div className="mt-2">
          <Button icon="delete" color="red" onClick={handleConfirm}>
            Delete this course
          </Button>
        </div>
      </CTForm>
      <CTConfirmation 
        open={openConfirm}
        text="Are you sure to delete this course? (Removed courses cannot be restored)"
        onConfirm={handleDelete}
        onClose={handleCancelConfirm}
      />
    </>
  );
}
