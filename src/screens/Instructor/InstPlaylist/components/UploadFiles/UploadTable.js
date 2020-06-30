import _ from 'lodash';
import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import IconButton from '@material-ui/core/IconButton';
import { CTFragment, CTText, CTPopoverLabel } from 'layout';
import { CircularProgress } from 'components';


export function fileSizeParser(size) {
  let _size = size;
  const fSExt = ['Bytes', 'KB', 'MB', 'GB'];
  let i = 0;
  while (_size > 900) {
    _size /= 1024;
    i += 1;
  }
  const exactSize = `${Math.round(_size * 100) / 100} ${fSExt[i]}`;
  return exactSize;
}

function UploadTable({
  progress,
  uploadIndex,
  videos,
  setVideos
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

  const fileIcon = <i className="fas fa-file-video" />;

  return (
    <CTFragment>
      <TableContainer className="ipl-upl-tb-con" data-scroll>
        <Table stickyHeader size="small" aria-label="videos table">
          <TableHead>
            <TableRow>
              <TableCell><div className="tb-cell header video1">VIDEO 1</div></TableCell>
              <TableCell><div className="tb-cell header">VIDEO 2</div></TableCell>
              <TableCell align="right">
                <div className="tb-cell header actions">{uploading ? 'STATUS' : 'ACTIONS'}</div>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {videos.map(({ video1, video2 }, index) => (
              <TableRow key={video1}>
                <TableCell>
                  <div className="tb-cell">
                    <span className="name">{fileIcon}{video1.name}</span>
                    <span className="size">{fileSizeParser(video1.size)}</span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="tb-cell">
                    {
                      video2
                      ?
                        <>
                          <span className="name">{fileIcon}{video2.name}</span>
                          <span className="size">{fileSizeParser(video2.size)}</span>
                        </>
                      :
                        <span className="name">NaN</span>
                    }
                  </div>
                </TableCell>

                <TableCell align="right">
                  {
                    uploadIndex < 0
                    ?
                      <div className="tb-cell actions">
                        <CTPopoverLabel label="Swape videos">
                          <IconButton disabled={!video2} onClick={() => swapeVideos(index)}>
                            <i className="material-icons">swap_horiz</i>
                          </IconButton>
                        </CTPopoverLabel>
                        <CTPopoverLabel label="Delete video(s)">
                          <IconButton onClick={() => deleteVideos(index)}>
                            <i className="material-icons">delete</i>
                          </IconButton>
                        </CTPopoverLabel>
                      </div>
                    :
                    uploadIndex < index ?
                      <div className="tb-cell actions">
                        <span className="progress-txt">Waiting</span>
                      </div>
                    :
                    uploadIndex === index ?
                      <div className="tb-cell actions">
                        <CircularProgress value={progress} />
                      </div>
                    :
                      <div className="tb-cell actions">
                        <CircularProgress value={100} />
                      </div>
                  }
                </TableCell>
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
