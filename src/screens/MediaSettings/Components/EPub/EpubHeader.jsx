import React from 'react'
import _ from 'lodash'
import { Dropdown } from 'semantic-ui-react'
import { Button } from 'pico-ui'
import { langMap } from 'screens/Watch/Utils'
import { epub } from 'screens/MediaSettings/Utils'

const langOptions = _.map(langMap, (text, value) => ({ text, value }))

export default function EpubHeader({
  title='',
  children,
  language,
  padded=true,
}) {
  return (
    <div className="msp-ee-el-header" data-padded={padded}>
      <div className="w-100 ct-d-r-center-v msp-ee-el-h1">
        <h1>{title}</h1>
        <Dropdown pointing='top right'
          trigger={<Button outlined icon="arrow_drop_down" text={langMap[language]} />}
          icon={null}
          value={language}
          options={langOptions}
          onChange={(e, { value }) => epub.changeLanguage(value)}
        />
      </div>
      {children}
    </div>
  )
}

EpubHeader.Subtitle = ({ children, text }) => <span className="msp-ee-el-h-p-t">{children || text}</span>
EpubHeader.Text = ({ children }) => <p>{children}</p>
