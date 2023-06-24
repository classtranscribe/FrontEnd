import React from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import Button from '@material-ui/core/Button';
import { links } from 'utils/links';
import { useButtonStyles, CTText } from 'layout';

function VideoUploadButton({
  videoId
}) {
  const btn = useButtonStyles();
  const btnClassName = cx(btn.tealLink, 'media-item-button');
  
  return (
    <Button
      component={Link}
      className={btnClassName}
      startIcon={<i className="material-icons upload">upload</i>}
      to={links.videoUploadFile(videoId)}
    >
      upload
    </Button>
  );
}

export default VideoUploadButton;

