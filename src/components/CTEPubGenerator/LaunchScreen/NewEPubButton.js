import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useButtonStyles } from 'layout';
import { EPubMenu } from '../components';
import { epub, getLanguageOptions } from '../controllers';

function NewEPubButton({ media }) {
  const btn = useButtonStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreate = (language) => {
    epub.list.createEPub(language);
  };

  const buttonElement = (
    <Button
      variant="contained"
      className={btn.teal}
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
