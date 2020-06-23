import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { links } from 'utils/links';
import { useStyles } from '../CourseInfo/ActionButtons/StarButton';

function NewPlaylistButton({
  offeringId
}) {
  const classes = useStyles();
  const buttonClasses = cx(classes.button, 'ml-3');

  return (
    <Button
      variant="contained"
      className={buttonClasses}
      size="large"
      startIcon={<AddIcon />}
      href={links.instNewPlaylist(offeringId)}
    >
      new playlist
    </Button>
  );
}

export default NewPlaylistButton;

