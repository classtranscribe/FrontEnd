import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import { useButtonStyles } from 'layout';
import { LanguageConstants } from '../../CTPlayer';
import EPubMenu from './EPubMenu';
import { EPubListCtrl, _getMediaLangOptions } from '../controllers';

function NewEPubButton({ languages, sourceType, sourceId, defaultTitle }) {
  const btn = useButtonStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleCreate = (language) => {
    EPubListCtrl.createEPub(sourceType, sourceId, {
      language,
      title: defaultTitle,
      filename: `${defaultTitle} (${LanguageConstants.decode(language)})`
    });
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
    <EPubMenu
      trigger={buttonElement}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      items={_getMediaLangOptions(languages)}
      handleItemClick={handleCreate}
    />
  );
}

export default NewEPubButton;
