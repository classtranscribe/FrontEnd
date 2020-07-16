import React, { useState } from 'react';
import { Button } from 'pico-ui';
import { CTPlayerConstants as PConstants } from '../../CTPlayer';
import { EPubMenu } from './EPubMenu';
import { epub } from '../controllers';

export function LanguageMenuTrigger({
  language,
  classNames,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const langOptions = PConstants.LANG_MAP.map((text, value) => ({ text, value }));
  
  return (
    <EPubMenu
      trigger={
        <Button
          outlined 
          icon="arrow_drop_down" 
          classNames={classNames}
          text={PConstants.LANG_MAP[language]} 
          onClick={e => setAnchorEl(e.currentTarget)}
        />
      }
      items={langOptions}
      value={language}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      handleItemClick={value => epub.ctrl.changeLanguage(value)}
    />
  );
}
