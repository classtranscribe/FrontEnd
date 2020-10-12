import React, { useState } from 'react';
import { Button } from 'pico-ui';
import { LanguageConstants } from '../../CTPlayer';
import { EPubMenu } from './EPubMenu';
import { epub } from '../controllers';

export function LanguageMenuTrigger({
  language,
  classNames,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  return (
    <EPubMenu
      trigger={
        <Button
          outlined 
          icon="arrow_drop_down" 
          classNames={classNames}
          text={LanguageConstants.decode(language)} 
          onClick={e => setAnchorEl(e.currentTarget)}
        />
      }
      items={LanguageConstants.LanguageOptions}
      value={language}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      handleItemClick={value => epub.ctrl.changeLanguage(value)}
    />
  );
}
