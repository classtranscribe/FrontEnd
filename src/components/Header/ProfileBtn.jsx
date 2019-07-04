import React from 'react'
import { Icon, Dropdown } from 'semantic-ui-react'
import './index.css'

import { util } from '../../util'

/**
 * Drop down profile for the headers
 */
export default function ProfileBtn({user, onSignOut, darkMode}) {
  const trigger = (
    <span style={darkMode ? {color: 'white'} : {}}>
      <Icon name='user' circular/> Hello, {user.name}
    </span>
  )
  return (
    <Dropdown trigger={trigger} direction='left' aria-label="Profile Menu">
      <Dropdown.Menu>
        <Dropdown.Item disabled>Signed in as <strong>{user.name}</strong></Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header content='Switch to ...' />
        <Dropdown.Item icon={{name:'users', color: 'blue',}} text='Student' onClick={util.toStudentPage}/>
        <Dropdown.Item icon={{name:'student', color: 'blue'}} text='Instructor' onClick={util.toInstructorPage}/>
        <Dropdown.Item icon={{name:'cogs', color: 'blue'}} text='Admin' onClick={util.toAdminPage}/>
        <Dropdown.Divider />
        <Dropdown.Header content='Have problems?' />
        <Dropdown.Item icon={{name:'mail', color: 'grey'}} text='Contact Us' href="mailto:classtranscribe@illinois.edu" target="_blank"/>
        <Dropdown.Divider />
        <Dropdown.Item icon='sign-out' text='Sign Out' onClick={onSignOut}/>
      </Dropdown.Menu>
    </Dropdown>
  )
}