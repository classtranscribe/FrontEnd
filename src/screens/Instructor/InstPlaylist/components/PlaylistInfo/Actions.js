import React from 'react';
import Button from '@material-ui/core/Button';
import { CTFragment, useButtonStyles } from 'layout';
import { CopyButton } from 'components';
import { links } from 'utils/links';

function Actions({
  editing,
  handleEdit,
  handleRename,
  handleCancelRename,
  handleDelete,
  playlistId,
  offeringId
}) {
  const btn = useButtonStyles();

  const shareableLink = window.location.origin 
                      + links.course(offeringId, playlistId);

  return (
    <CTFragment dFlexCol className="actions" padding={[10, 0]}>
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
                disableRipple
              >
                delete playlist
              </Button>
            </CTFragment>
            <CTFragment justConEnd>
              <Button 
                id="pl-rename-save-btn"
                className={btn.teal} 
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
          <CTFragment justConEnd>
            <Button 
              id="pl-edit-btn"
              className="font-weight-bold"
              startIcon={<i className="material-icons">settings</i>}
              onClick={handleEdit}
              size="large"
            >
              settings
            </Button>
            <CopyButton text={shareableLink} size="large">
              Share
            </CopyButton>
          </CTFragment>
        )
      }
    </CTFragment>
  );
}

export default Actions;
