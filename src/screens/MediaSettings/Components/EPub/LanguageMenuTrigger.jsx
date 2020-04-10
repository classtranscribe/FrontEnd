import React, { useState } from 'react'
import _ from 'lodash'
import { Button } from 'pico-ui'
import { EpubMenu } from './EpubMenu'
import { langMap } from 'screens/Watch/Utils'
import { epub } from '../../Utils'

const langOptions = _.map(langMap, (text, value) => ({ text, value }))

export function LanguageMenuTrigger({
  language,
  classNames,
}) {

  const [anchorEl, setAnchorEl] = useState(null)
  
  return (
    <EpubMenu
      trigger={
        <Button outlined 
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
      handleItemClick={value => epub.changeLanguage(value)}
    />
  )
}
