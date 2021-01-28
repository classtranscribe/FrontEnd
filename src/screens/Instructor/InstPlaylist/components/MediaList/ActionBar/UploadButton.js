import React from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import Button from '@material-ui/core/Button';
import UploadIcon from '@material-ui/icons/CloudUpload';
import { links } from 'utils/links';
import { useButtonStyles } from 'layout';

function UploadButton({
  playlistId
}) {
  const btn = useButtonStyles();
  
  return (
    <Button
      component={Link}
      className={cx(btn.teal, 'ml-3')}
      startIcon={<UploadIcon />}
      variant="contained"
      to={links.playlistUploadFiles(playlistId)}
    >
      upload
    </Button>
  );
}

export default UploadButton;

