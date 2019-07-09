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
    <Dropdown trigger={trigger} direction='left' aria-label="Open menu" title="menu">
      <Dropdown.Menu>
        <Dropdown.Item disabled>Signed in as <strong>{user.name}</strong></Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.Header content='Switch to ...' />
        <Dropdown.Item 
          icon={{name:'users', color: 'blue',}} 
          text='Student' 
          onClick={util.toStudentPage}
          title="Switch to student page"
          aria-label="Switch to student page"
        />
        <Dropdown.Item 
          icon={{name:'student', color: 'blue'}} 
          text='Instructor' 
          onClick={util.toInstructorPage}
          title="Switch to instructor page"
          aria-label="Switch to instructor page"
        />
        <Dropdown.Item 
          icon={{name:'cogs', color: 'blue'}} 
          text='Admin' 
          onClick={util.toAdminPage}
          title="Switch to administer page"
          aria-label="Switch to administer page"
        />
        <Dropdown.Divider />
        <Dropdown.Header content='Have problems?' />
        <Dropdown.Item 
          icon={{name:'mail', color: 'grey'}} 
          text='Contact Us' 
          href="mailto:classtranscribe@illinois.edu" 
          target="_blank"
          title="contact us"
          aria-label="contact us"
        />
        <Dropdown.Divider />
        <Dropdown.Item 
          icon='sign-out' 
          text='Sign Out' 
          onClick={onSignOut}
          title="sign out"
          aria-label="sign out"
        />
      </Dropdown.Menu>
    </Dropdown>
  )
}