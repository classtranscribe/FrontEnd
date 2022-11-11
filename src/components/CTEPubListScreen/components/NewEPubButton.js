import React from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useButtonStyles } from 'layout';

function NewEPubButton({ onCreate }) {
  const btn = useButtonStyles();

  return (
    <Button
      variant="contained"
      className={btn.teal}
      startIcon={<AddIcon />}
      onClick={onCreate}
      aria-haspopup="dialog"
    >
      Create new I-Note
    </Button>
  );
}

export default NewEPubButton;
