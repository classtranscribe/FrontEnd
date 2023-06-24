import React from 'react';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import { CTPopoverLabel } from 'layout';
import { CircularProgress } from 'components';

function VideoUploadTableStatusCell({
  failed,
  waiting,
  inProgress,
  progress,
  uploaded,
  onDelete
}) {
  return (
    <TableCell align="right">
      {
        failed ? (
          <div className="tb-cell actions">
            <span className="progress-txt failed">Failed</span>
          </div>
        ) :
        waiting ? (
          <div className="tb-cell actions">
            <span className="progress-txt">Waiting</span>
          </div>
        ) :
        inProgress ? (
          <div className="tb-cell actions">
            <CircularProgress value={progress} />
          </div>
        ) :
        uploaded ? (
          <div className="tb-cell actions">
            <CircularProgress value={100} />
          </div>
        ) : (
          <div className="tb-cell actions">
            <CTPopoverLabel label="Delete video">
              <IconButton onClick={onDelete}>
                <i className="material-icons">delete</i>
              </IconButton>
            </CTPopoverLabel>
          </div>
        )
      }
    </TableCell>
  );
}

export default VideoUploadTableStatusCell;
