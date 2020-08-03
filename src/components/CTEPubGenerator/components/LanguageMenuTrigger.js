import React, { useState } from 'react';
import { Button } from 'pico-ui';
import { Languages } from '../../CTPlayer';
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
          text={Languages.decode(language)} 
          onClick={e => setAnchorEl(e.currentTarget)}
        />
      }
      items={Languages.LanguageOptions}
      value={language}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      handleItemClick={value => epub.ctrl.changeLanguage(value)}
    />
  );
}
