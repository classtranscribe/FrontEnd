import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { CTModal, CTUploadButton, CTFormHelp } from 'layout';
import { links } from 'utils';
import { mediaControl } from '../../controllers';
import UploadTable from './UploadTable';
import UploadActions from './UploadActions';
import './index.scss';

export function UploadFiles() {
  const history = useHistory();
  const { id } = useParams();

  const [videos, setVideos] = useState([]);
  const [uploadIndex, setUploadingIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [failedVideos, setFailedVideos] = useState([]);

  const uploading = uploadIndex >= 0;

  const handleAddVideo = (files) => {
    let [video1, video2] = files;
    setVideos([ ...videos, { video1, video2 }]);
  };
  
  const handleClose = () => {
    if (!uploading) {
      history.push(links.playlist(id));
    } else {
      // refresh the page to cancel the upload process
      window.location = links.playlist(id)
    }
  };

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    setProgress(percentCompleted);
  };

  const handleUpload = async () => {
    let successedVideos = await mediaControl.handleUpload(
      id,
      videos,
      setUploadingIndex,
      setProgress,
      onUploadProgress,
      setFailedVideos
    );

    if (successedVideos.length === videos.length) {
      // go back once finished
      history.push(links.playlist(id));
    } else {
      setVideos(videos.filter((vi, index) => !successedVideos.includes(index)));
      setUploadingIndex(-1);
      setProgress(0);
      setFailedVideos([]);
    }
  };

  const actionProps = {
    noFileUploaded: videos.length === 0,
    uploading,
    handleClose,
    handleUpload
  };

  const modalProps = {
    open: true,
    responsive: true,
    size: 'md',
    title: 'Upload Videos',
    action: <UploadActions {...actionProps} />,
    onClose: handleClose
  };

  const tableProps = {
    progress,
    uploadIndex,
    videos,
    failedVideos,
    setVideos
  };

  return (
    <CTModal {...modalProps}>
      <CTFormHelp title="upload instruction">
        <b>You can either upload one video or a pair of videos for each media. </b> 
        The pair of videos will be presented to viewers with synchronized playbacks.
      </CTFormHelp>
      <CTUploadButton 
        fluid 
        accept="video/mp4,video/x-m4v,video/*" 
        onFileChange={handleAddVideo}
      >
        Browse videos
      </CTUploadButton>

      <UploadTable {...tableProps} />
    </CTModal>
  );
}
