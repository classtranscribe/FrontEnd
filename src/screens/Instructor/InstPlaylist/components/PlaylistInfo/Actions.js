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
    <CTFragment list className="actions" padding={[10, 0]}>
      {
        editing ? (
          <>
            <CTFragment>
              <Button 
                id="pl-delete-btn"
                className="font-weight-bold mb-2 delete-btn"
                color="secondary"
                startIcon={<i className="material-icons delete">delete</i>}
                onClick={handleDelete}
                size="large"
              >
                delete playlist
              </Button>
            </CTFragment>
            <CTFragment hEnd>
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
            </CTFragment>
          </>
        ) : (
          <CTFragment hEnd>
            <Button 
              id="pl-edit-btn"
              className="font-weight-bold"
              startIcon={<i className="material-icons">settings</i>}
              onClick={handleEdit}
              size="large"
            >
              settings
            </Button>
          </CTFragment>
        )
      }
    </CTFragment>
  );
}

export default Actions;
