import React, { useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {
  CTModal,
  CTUploadButton,
  CTFormHelp,
  CTFragment,
  CTConfirmation
} from 'layout';
import { links, api, prompt } from 'utils';
import VideoUploadTable from './VideoUploadTable';
import VideoUploadActions from './VideoUploadActions';
import './index.scss';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.modal + 1,
    color: '#fff',
  },
}));
const mediaControl = {
  async handleUpload(
    mediaId, 
    uploadedMedias, 
    setUploadingIndex, 
    setProgress, 
    onUploadProgress,
    setFailedVideos
  ) {
    if(uploadedMedias.length === 0) return;
    let successedVideos = [];
    // Just upload one video.
    const index = uploadedMedias.length - 1;
    const oneMedia = uploadedMedias[index]
    setUploadingIndex(index);
    setProgress(0);
    let successed = await this.uploadasl(mediaId, oneMedia, onUploadProgress);
    if (successed) {
        successedVideos.push(index);
    } else {
        setFailedVideos(fvis => [...fvis, index]);
    }

    if (successedVideos.length > 0) {
      prompt.addOne({ text: `Uploaded video.`, timeout: 4000 });
    }
    return successedVideos;
  },
  async uploadasl(mediaId, aslvideo, onUploadProgress) {
    try {
      await api.uploadASLVideo(mediaId, aslvideo, onUploadProgress);
      return true
    } catch (error) {
      console.error(error);
      prompt.error(`Failed to upload video.`);
      return false;
    }
  } 
}
export function UploadSingleFile(props) {
  const { history, match } = props;
  const playlistId = match.params.playlistId;
  const mediaId = match.params.mediaId
  const classes = useStyles();

  const [videos, setVideos] = useState([]);
  const [uploadIndex, setUploadingIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [failedVideos, setFailedVideos] = useState([]);

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openLoader, setOpenLoader] = useState(false);

  const uploading = uploadIndex >= 0;

  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleConfirm = () => {
    handleCloseConfirm();
    // setVideos(_.map(videos, (_video) => ({ video1: _video.video1 })));
  };

  const handleAddVideo = (files) => {
    setVideos([...files ]);
  };
  
  const handleClose = () => {
    if (!uploading) {
      history.push(links.playlist(playlistId));
    } else {
      // refresh the page to cancel the upload process
      window.location = links.playlist(playlistId)
    }
  };

  const handleOpenFakeLoading = () => {
    setOpenLoader(true);
    setTimeout(() => {
      setOpenLoader(false);
      handleClose();
    }, 2000);
  }

  const onUploadProgress = (progressEvent) => {
    const percentCompleted = Math.round((progressEvent.loaded / progressEvent.total) * 100);
    setProgress(percentCompleted);
  };

  const handleUpload = async () => {
    let successedVideos = await mediaControl.handleUpload(
      mediaId,
      videos,
      setUploadingIndex,
      setProgress,
      onUploadProgress,
      setFailedVideos
    );

    if (successedVideos.length === videos.length) {
      // go back once finished
      // add fake loading time to avoid race condition
      handleOpenFakeLoading();
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
    action: <VideoUploadActions {...actionProps} />,
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
        <b>Upload an ASL video.</b>
        <br />
      </CTFormHelp>
      <CTFragment margin={[-15,0,0,10]}>
        <CTConfirmation
          text="Are you sure you want to remove this video?"
          onConfirm={handleConfirm}
          onClose={handleCloseConfirm}
          open={openConfirm}
        />
      </CTFragment>

      <CTUploadButton 
        fluid 
        accept="video/mp4,video/x-m4v,video/*" 
        onFileChange={handleAddVideo}
        disabled={uploading}
        id="id"
      >
        Browse videos
      </CTUploadButton>

      <VideoUploadTable {...tableProps} />

      <Backdrop open={openLoader} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </CTModal>
  );
}
