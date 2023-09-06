import _ from 'lodash';
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
    playlistId, 
    uploadedMedias, 
    setUploadingIndex, 
    setProgress, 
    onUploadProgress,
    setFailedVideos
  ) {
    let successedVideos = [];
    for (let i = 0; i < uploadedMedias.length; i += 1) {
      setUploadingIndex(i);
      setProgress(0);
      let successed = await this.upload(playlistId, uploadedMedias[i], onUploadProgress);
      if (successed) {
        successedVideos.push(i);
      } else {
        setFailedVideos(fvis => [...fvis, i]);
      }
    }

    if (successedVideos.length > 0) {
      prompt.addOne({ text: `Uploaded ${successedVideos.length} videos.`, timeout: 4000 });
    }

    return successedVideos;
  },
  async upload(playlistId, { video1, video2 }, onUploadProgress) {
    try {
      await api.uploadVideo(playlistId, video1, video2, onUploadProgress);
      return true
    } catch (error) {
      console.error(error);
      prompt.error(`Failed to upload video ${video1.name}.`);
      return false;
    }
  } 
}
export function UploadSingleFile(props) {
  const { history, match } = props;
  const id = match.params.playlistId;
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
    setVideos(_.map(videos, (_video) => ({ video1: _video.video1 })));
  };

  const handleAddVideo = (files) => {
    setVideos([ ...videos, ..._.map(files, (vfile) => ({ video1: vfile }))]);
  };
  
  const handleClose = () => {
    if (!uploading) {
      history.push(links.playlist(id));
    } else {
      // refresh the page to cancel the upload process
      window.location = links.playlist(id)
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
      id,
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
          text="Are you sure to remove this video?"
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
