import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import { EPubMenu } from '../components';
import { epub, getLanguageOptions } from '../controllers';

const useStyles = makeStyles({
  button: {
    fontWeight: 'bold',
    marginLeft: 5,
    minWidth: 'max-content',
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  }
});

function NewEPubButton({ media }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreate = (language) => {
    epub.list.createEPub(language);
  };

  const buttonElement = (
    <Button
      variant="contained"
      className={classes.button}
      startIcon={<AddIcon />}
      onClick={e => setAnchorEl(e.currentTarget)}
    >
      Create new ePub
    </Button>
  );

  return (
    <>
      <EPubMenu
        trigger={buttonElement}
        anchorEl={anchorEl}
        setAnchorEl={setAnchorEl}
        items={getLanguageOptions(media)}
        handleItemClick={handleCreate}
      />
    </>
  );
}

export default NewEPubButton;
