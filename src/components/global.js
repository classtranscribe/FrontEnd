import React from 'react'
import { Row, Col, Navbar, Nav } from 'react-bootstrap'
import { Icon, Dimmer, Loader, Dropdown, Placeholder } from 'semantic-ui-react'
import { util } from '../util'

/**
 * Drop down profile for the headers
 */
function ProfileBtn({user, onSignOut, darkMode}) {
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

/**
 * Header with a sign out button and user info
 * @param props 
 * user: {name, ...}
 * onSignOut - function to sign out
 */
export function SignOutHeader({user, onSignOut, darkMode}) {
  const bg = darkMode ? 'dark' : 'light';
  const theme = darkMode ? '-dark' : '';
  return (
    <Navbar sticky="top" bg={bg} variant={bg} className={"ct-nav"+theme} role="naviation">
      <Navbar.Brand className={"brand"+theme} href="/">ClassTranscribe</Navbar.Brand>
      <Row className="signout">
        <ProfileBtn user={user} onSignOut={onSignOut} darkMode={darkMode}/>
      </Row>
    </Navbar>
  );
}

/**
 * Header only for Course Setting Page with a sider bar show-up trigger button
 * @param props 
 * user: {name, ...}
 * showSiderBar: function for display or hide side bar
 */
export function ClassTranscribeHeader({darkMode, showSiderBar, user, onSignOut}) {
  const bg = darkMode ? 'dark' : 'light';
  const theme = darkMode ? '-dark' : '';
  const location =  window.location.toString()
  const offeringPage = location.includes('/offering/')
  return (
    <Navbar aria-label="Top Nav Bar" sticky="top" bg={bg} variant={bg} className={"ct-nav"+theme}>
      {
        offeringPage 
        &&
        <Navbar.Brand className="sidebar-trigger" onClick={showSiderBar} disabled>
          <Icon name='sidebar' size="large"/>
        </Navbar.Brand>
      }
      <Navbar.Brand className={"brand"+theme} href="/">ClassTranscribe</Navbar.Brand>
      <Row className="signout">
        <ProfileBtn user={user} onSignOut={onSignOut}/>
      </Row>
    </Navbar>
  )
}

/**
 * Padding Component
 */
export const EndPadding5rem = () => <div className="end-padding"></div>

/**
 * Spinning Loader wrapper while loading data
 */
export function GeneralLoader({loading, inverted, height}) {
  return (
    <Dimmer active={loading} inverted={inverted} style={{height: height}}>
      <Loader inverted={inverted}>Loading</Loader>
    </Dimmer>
  )
}

export function GeneralPlaceholder({fluid, lines, image, inverted}) {
  return (
    <Placeholder fluid={fluid}>
      <Placeholder.Header image={image}>
        <Placeholder.Line />
        <Placeholder.Line />
        {lines && lines.map( length => (
          <Placeholder.Line length={length} />
        ))}
      </Placeholder.Header>
    </Placeholder>
  )
}

/**
 * Sticky footer for all pages 
 */
export function StickyFooter() {
  return (
    <Navbar className="ct-footer" variant="light" aria-label="Footer">
      <Nav >
        <Nav.Link href="/class-transcribe-frontend/#/">Home</Nav.Link>
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}

export function FixedFooter(props) {
  return (
    <Navbar variant={props.isDark ? "dark" : "light"} aria-label="Footer">
      <Nav className="sp-footer">
        <Nav.Link href="/class-transcribe-frontend/#/">Home</Nav.Link>
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}
