import React from 'react'
import { Icon, Dropdown, Button } from 'semantic-ui-react'
import './index.css'

import { util, user } from '../../util'
import { Link } from 'react-router-dom';

/**
 * Drop down profile for the headers
 */
export default function ProfileBtn({onSignOut, darkMode}) {
  const isLoggedIn = user.isLoggedIn()
  const trigger = isLoggedIn ? (
    <span style={darkMode ? {color: 'white'} : {}}>
      <Icon name='user' circular/> Hello, {user.firstName()}
    </span>
  ) : null
  
  return (
    <>
    {
      isLoggedIn ? (
        <Dropdown 
          trigger={trigger} 
          direction='left' 
          aria-label="Open menu" 
          title="menu" 
          closeOnBlur={false}
        >
          <Dropdown.Menu>
            <Dropdown.Item disabled>
              Signed in as <strong>{user.fullName()}</strong>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header content='Switch to ...' />
            <Dropdown.Item 
              icon={{name:'users', color: 'grey'}} 
              text='Student' 
              href={util.links.student()}
              title="Switch to student page"
              aria-label="Switch to student page"
            />
            <Dropdown.Item 
              icon={{name:'student', color: 'grey'}} 
              text='Instructor' 
              href={util.links.instructor()}
              title="Switch to instructor page"
              aria-label="Switch to instructor page"
            />
            <Dropdown.Item 
              icon={{name:'cogs', color: 'grey'}} 
              text='Admin' 
              href={util.links.admin()}
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
              as="button"
              style={{width: '100%'}}
              icon='sign-out' 
              text='Sign Out' 
              onClick={onSignOut}
              title="sign out"
              aria-label="sign out"
            />
          </Dropdown.Menu>
        </Dropdown>
      ) : (
        <Button as={Link} to={util.links.studentHome()}>Sign In</Button>
      )
    }
    
    </>
  )
}