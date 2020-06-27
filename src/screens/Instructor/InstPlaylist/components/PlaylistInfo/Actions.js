import React from 'react';
import Button from '@material-ui/core/Button';
import { CTFragment } from 'layout';
import { useStyles } from 'screens/Course/Components/CourseInfo/ActionButtons/StarButton';

function Actions({
  editing,
  handleEdit,
  handleRename,
  handleCancelRename,
  handleDelete
}) {
  const tealClasses = useStyles();

  return (
    <CTFragment hEnd className="actions" padding={[10, 20, 10, 10]}>
      {
        editing ? (
          <>
            <Button 
              id="pl-rename-save-btn"
              className={tealClasses.button} 
              startIcon={<i className="material-icons">check</i>}
              onClick={handleRename}
              variant="contained"
            >
              save
            </Button>
            <Button 
              id="pl-rename-cancel-btn"
              className="font-weight-bold ml-3"
              onClick={handleCancelRename}
            >
              cancel
            </Button>
          </>
        ) : (
          <>
            <Button 
              id="pl-edit-btn"
              className="font-weight-bold"
              startIcon={<i className="material-icons">settings</i>}
              onClick={handleEdit}
              size="large"
            >
              settings
            </Button>
            <Button 
              id="pl-delete-btn"
              className="font-weight-bold ml-3"
              startIcon={<i className="material-icons delete">delete</i>}
              onClick={handleDelete}
              size="large"
            >
              delete
            </Button>
          </>
        )
      }
    </CTFragment>
  );
}

export default Actions;
