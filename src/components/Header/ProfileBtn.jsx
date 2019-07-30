import React, { useState } from 'react'
import { Icon, Dropdown, Button } from 'semantic-ui-react'
import './index.css'

import { util, user } from '../../util'
import { Link } from 'react-router-dom';

/**
 * Drop down profile for the headers
 */
export default function ProfileBtn({onSignOut, darkMode}) {
  /**
   * state for currently focused menu item
   */
  const [currItem, setCurrItem] = useState(null)
  /**
   * Function for handle onKeyDown event, which can switch focus from menu items
   */
  const switchFocus = ({keyCode}) => {
    var index = currItem
    if (keyCode === 40) {
      if (!index) {
        setCurrItem( () => 1 )
        document.getElementById(`menu-item1`).focus()
      } else {
        if (index === 5) index = 0
        document.getElementById(`menu-item${index + 1}`).focus()
        setCurrItem( () => index + 1)
      }
    } else if (keyCode === 38) {
      if (!index) {
        setCurrItem( () => 5 )
        document.getElementById(`menu-item5`).focus()
      } else {
        if (index === 1) index = 6
        document.getElementById(`menu-item${index - 1}`).focus()
        setCurrItem( () => index - 1)
      }
    } 
  }

  const isLoggedIn = user.isLoggedIn()
  const isMobile = window.innerWidth <= 520
  const trigger = isLoggedIn ? (
    <span style={darkMode ? {color: 'white'} : {}}>
      <Icon name='user' circular/>
      {
        !isMobile
        &&
        `Hello, ${user.firstName()}`
      }
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
          onKeyDown={switchFocus}
          closeOnBlur={isMobile} 
          closeOnEscape
        >
          <Dropdown.Menu id="header-menu" >
            <Dropdown.Item disabled>
              Signed in as <strong>{user.fullName()}</strong>
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Header content='Switch to ...' />
            <Dropdown.Item 
              id="menu-item1"
              icon={{name:'users', color: 'grey'}} 
              text='Student' 
              as={Link} to={util.links.studentHome()}
              title="Switch to student page"
              aria-label="Switch to student page"
            />
            <Dropdown.Item 
              id="menu-item2"
              icon={{name:'student', color: 'grey'}} 
              text='Instructor' 
              as={Link} to={util.links.instructor()}
              title="Switch to instructor page"
              aria-label="Switch to instructor page"
            />
            <Dropdown.Item 
              id="menu-item3"
              icon={{name:'cogs', color: 'grey'}} 
              text='Admin' 
              as={Link} to={util.links.admin()}
              title="Switch to administer page"
              aria-label="Switch to administer page"
            />
            <Dropdown.Divider />
            <Dropdown.Header content='Have problems?' />
            <Dropdown.Item 
              id="menu-item4"
              icon={{name:'mail', color: 'grey'}} 
              text='Contact Us' 
              href="mailto:classtranscribe@illinois.edu" 
              target="_blank"
              title="contact us"
              aria-label="contact us"
            />
            <Dropdown.Divider />
            <Dropdown.Item 
              id="menu-item5"
              as="button"
              className="w-100"
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