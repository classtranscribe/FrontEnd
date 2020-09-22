import _ from 'lodash';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CTFragment, CTText } from 'layout';
import UploadTableVideoCell from './UploadTableVideoCell';
import UploadTableStatusCell from './UploadTableStatusCell';


function UploadTable({
  progress,
  uploadIndex,
  videos,
  setVideos,
  failedVideos,
  can2Video
}) {
  const uploading = uploadIndex >= 0;

  const swapeVideos = (index) => {
    let { video1, video2 } = videos[index];
    videos[index] = { video1: video2, video2: video1 };
    setVideos([...videos]);
  };

  const deleteVideos = (index) => {
    videos.splice(index, 1);
    setVideos([...videos]);
  };

  return (
    <CTFragment>
      <TableContainer className="ipl-upl-tb-con" data-scroll>
        <Table stickyHeader size="small" aria-label="videos table">
          <TableHead>
            <TableRow>
              <TableCell>
                <div className="tb-cell header video1">
                  {can2Video ? 'VIDEO 1' : 'VIDEO'} ({videos.length})
                </div>
              </TableCell>
              {
                can2Video 
                && 
                <TableCell><div className="tb-cell header">VIDEO 2</div></TableCell>
              }
              <TableCell align="right">
                <div className="tb-cell header actions">{uploading ? 'STATUS' : 'ACTIONS'}</div>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {videos.map(({ video1, video2 }, index) => (
              <TableRow className="tb-row" key={video1}>
                <UploadTableVideoCell videFile={video1} can2Video={can2Video} />

                {can2Video && <UploadTableVideoCell videFile={video2} />}

                <UploadTableStatusCell
                  failed={failedVideos.includes(index)}
                  waiting={uploadIndex >= 0 && uploadIndex < index}
                  inProgress={uploadIndex === index}
                  progress={progress}
                  uploaded={uploadIndex > index}
                  canSwap={video2}
                  onSwap={() => swapeVideos(index)}
                  onDelete={() => deleteVideos(index)}
                />
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {
          videos.length === 0
          &&
          <CTText center padding={[20, 0]}>No videos</CTText>
        }
      </TableContainer>
    </CTFragment>
  );
}

export default UploadTable;
