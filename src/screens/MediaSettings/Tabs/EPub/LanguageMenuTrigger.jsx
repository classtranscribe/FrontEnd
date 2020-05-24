import React, { useState } from 'react';
import { Button } from 'pico-ui';

import _ from 'lodash';
import { langMap } from 'screens/Watch/Utils';
import { EpubMenu } from './EpubMenu';
import { epub } from '../../controllers/epub';

const langOptions = _.map(langMap, (text, value) => ({ text, value }));

export function LanguageMenuTrigger({
  language,
  classNames,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  
  return (
    <EpubMenu
      trigger={
        <Button
          outlined 
          icon="arrow_drop_down" 
          classNames={classNames}
          text={langMap[language]} 
          onClick={e => setAnchorEl(e.currentTarget)}
        />
      }
      items={langOptions}
      value={language}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      handleItemClick={value => epub.sch.changeLanguage(value)}
    />
  );
}
