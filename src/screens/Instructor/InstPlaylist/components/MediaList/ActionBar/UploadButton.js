import React from 'react';
import cx from 'classnames';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import UploadIcon from '@material-ui/icons/CloudUpload';
import { links } from 'utils/links';
import { useStyles } from 'screens/Course/Components/CourseInfo/ActionButtons/StarButton';

function UploadButton({
  playlistId
}) {
  const classes = useStyles();
  return (
    <Button
      component={Link}
      className={cx(classes.button, 'ml-3')}
      startIcon={<UploadIcon />}
      variant="contained"
      to={links.playlistUploadFiles(playlistId)}
    >
      upload
    </Button>
  );
}

export default UploadButton;

