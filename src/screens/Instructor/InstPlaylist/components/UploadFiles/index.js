import _ from 'lodash';
import React, { useState } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import {
  CTModal,
  CTUploadButton,
  CTFormHelp,
  CTCheckbox,
  CTFragment,
  CTConfirmation
} from 'layout';
import { useCheckbox } from 'hooks';
import { links, api, prompt } from 'utils';
import UploadTable from './UploadTable';
import UploadActions from './UploadActions';
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
export function UploadFiles(props) {
  const { history, match } = props;
  const { id } = match.params;
  const classes = useStyles();

  const [videos, setVideos] = useState([]);
  const [uploadIndex, setUploadingIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [failedVideos, setFailedVideos] = useState([]);

  const canUploadTwoVideo = useCheckbox(false);
  const [openConfirm, setOpenConfirm] = useState(false);

  const [openLoader, setOpenLoader] = useState(false);

  const uploading = uploadIndex >= 0;

  const handleCloseConfirm = () => setOpenConfirm(false);
  const handleConfirm = () => {
    canUploadTwoVideo.setChecked(false);
    handleCloseConfirm();
    setVideos(_.map(videos, (_video) => ({ video1: _video.video1 })));
  };

  const handleUpload2VideoCheckboxChange = ({ target: { checked }}) => {
    if (checked === false && videos.filter((_video) => _video.video2).length) {
      setOpenConfirm(true);
    } else {
      canUploadTwoVideo.setChecked(checked);
    }
  }

  const handleAddVideo = (files) => {
    if (canUploadTwoVideo.checked) {
      let [video1, video2] = files;
      setVideos([ ...videos, { video1, video2 }]);
    } else {
      setVideos([ ...videos, ..._.map(files, (vfile) => ({ video1: vfile }))]);
    }
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
    action: <UploadActions {...actionProps} />,
    onClose: handleClose
  };

  const tableProps = {
    progress,
    uploadIndex,
    videos,
    failedVideos,
    can2Video: canUploadTwoVideo.checked,
    setVideos
  };

  return (
    <CTModal {...modalProps}>
      <CTFormHelp title="upload instruction">
        <b>By checking the checkbox below, you can upload a pair of videos for each media.</b>
        <br />
        The pair of videos will be presented to viewers with synchronized playbacks.
      </CTFormHelp>
      <CTFragment margin={[-15,0,0,10]}>
        <CTCheckbox 
          label="Upload 2 videos for each media"
          checked={canUploadTwoVideo.checked}
          onChange={handleUpload2VideoCheckboxChange}
        />
        <CTConfirmation
          text="Are you sure to remove the all the secondary video files of your medias?"
          onConfirm={handleConfirm}
          onClose={handleCloseConfirm}
          open={openConfirm}
        />
      </CTFragment>
      {
        canUploadTwoVideo.checked 
        &&
        <CTFormHelp fadeIn>
          Choose 2 video files at a time when browsing files.
        </CTFormHelp>
      }

      <CTUploadButton 
        fluid 
        accept="video/mp4,video/x-m4v,video/*" 
        onFileChange={handleAddVideo}
        disabled={uploading}
      >
        Browse videos
      </CTUploadButton>

      <UploadTable {...tableProps} />

      <Backdrop open={openLoader} className={classes.backdrop}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </CTModal>
  );
}
