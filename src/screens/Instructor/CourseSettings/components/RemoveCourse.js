import React, { useState } from 'react';
import { useHistory } from 'dva/router';
import { Button } from 'pico-ui';
import { CTForm, CTFormHelp, CTConfirmation } from 'layout';
import { offControl } from '../controllers';

export function RemoveCourse() {
  const history = useHistory();
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleConfirm = () => setOpenConfirm(true);
  const handleCancelConfirm = () => setOpenConfirm(false);

  const handleDelete = () => {
    setOpenConfirm(false);
    offControl.deleteOffering(history);
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
