import _ from 'lodash';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { CTFragment, CTText } from 'layout';
import VideoUploadTableVideoCell from './VideoUploadTableVideoCell';
import VideoUploadTableStatusCell from './VideoUploadTableStatusCell';


function VideoUploadTable({
  progress,
  uploadIndex,
  videos,
  setVideos,
  failedVideos,
}) {
  const uploading = uploadIndex >= 0;

  const deleteVideo = (index) => {
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
                </div>
              </TableCell>
                <div className="tb-cell header actions">{uploading ? 'STATUS' : 'ACTIONS'}</div>
            </TableRow>
          </TableHead>

          <TableBody>
            {videos.map(({ video1 }, index) => (
              <TableRow className="tb-row" key={video1}>
                <VideoUploadTableVideoCell videFile={video1} />
                <VideoUploadTableStatusCell
                  failed={failedVideos.includes(index)}
                  waiting={uploadIndex >= 0 && uploadIndex < index}
                  inProgress={uploadIndex === index}
                  progress={progress}
                  uploaded={uploadIndex > index}
                  onSwap={() => swapeVideos(index)}
                  onDelete={() => deleteVideo(index)}
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

export default VideoUploadTable;
