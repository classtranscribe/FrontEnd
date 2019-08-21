import React from 'react'
import { List, Dropdown } from 'semantic-ui-react'
import { util } from 'utils'

export default function EditVideoBtn({show, mediaName}) {
  const display = show ? {} : {display: 'none'}
  return (
    <List.Content floated='right' className="list-dropdown-btn" style={display}>
      <Dropdown 
        icon="ellipsis vertical" 
        floating direction="left" 
        aria-label={`Dropdown Buttons for Video ${mediaName}`}
        title="edit"
      >
        <Dropdown.Menu >
          <Dropdown.Item 
            icon="edit" text='Edit' 
            onClick={()=>util.editVideo('fakeid')}
            aria-label="edit"
          />
          <Dropdown.Item 
            icon="trash" text='Delete' 
            onClick={()=>1}
            aria-label="delete"
          />
        </Dropdown.Menu>
      </Dropdown>
    </List.Content>
  )
}