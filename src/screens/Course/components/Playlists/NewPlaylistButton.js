import React from 'react';
import cx from 'classnames';
import { Link } from 'dva/router';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { links } from 'utils/links';
import { useButtonStyles } from 'layout';

function NewPlaylistButton({
  offeringId
}) {
  const btn = useButtonStyles();

  return (
    <Button
      component={Link}
      variant="contained"
      className={cx(btn.teal, 'ml-3', 'ct-a-fade-in')}
      size="small"
      startIcon={<AddIcon />}
      to={links.instNewPlaylist(offeringId)}
    >
      new playlist
    </Button>
  );
}

export default NewPlaylistButton;

