import React from 'react'
import { Row, Col, Button, Navbar, Nav } from 'react-bootstrap'
import { Icon, Dimmer, Loader } from 'semantic-ui-react'

/**
 * Header with a sign out button and user info
 * @param props 
 * user: {name, ..}
 * onSignOut - function to sign out
 */
export function SignOutHeader(props) {
  const darkMode = props.darkMode || false;
  const bg = darkMode ? 'dark' : 'light';
  const btn = darkMode ? 'outline-light' : 'outline-dark';
  const theme = darkMode ? '-dark' : '';
  return (
    <Navbar sticky="top" bg={bg} variant={bg} className={"ct-nav"+theme}>
      <Navbar.Brand className={"brand"+theme} href="/">Class Transcribe</Navbar.Brand>
        <Row className="signout">
          <p className={"hi-there"+theme}>Hi, {props.user.name}</p>
          <Button variant={btn} onClick={props.onSignOut}>Sign Out</Button>
        </Row>
    </Navbar>
  );
}

/**
 * Header only for course setting page with a sider bar show-up trigger button
 * @param props 
 * user: {name, ..}
 * showSiderBar: function for display or hide side bar
 */
export function CourseSettingHeader(props) {
  return (
    <Navbar sticky="top" bg="light" variant="light" className="ct-nav">
      <Navbar.Brand className="sidebar-trigger" onClick={props.showSiderBar} disabled>
        <Icon name='grey sidebar' size="large"/>
      </Navbar.Brand>
      <Navbar.Brand className="brand" href="/">Class Transcribe</Navbar.Brand>
    </Navbar>
  );
}

/**
 * Sticky footer for all pages 
 */
export function StickyFooter() {
  return (
    <Navbar className="ct-footer" variant="light">
      <Nav >
        <Nav.Link href="/class-transcribe-frontend/#/">Home</Nav.Link>
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}

export function FixedFooter(props) {
  return (
    <Navbar variant={props.isDark ? "dark" : "light"} >
      <Nav className="sp-footer">
        <Nav.Link href="/class-transcribe-frontend/#/">Home</Nav.Link>
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}

export const EndPadding5rem = () => <div className="end-padding"></div>

export function GeneralLoader(props) {
  return (
    <Dimmer active={props.loading} inverted={props.inverted}>
      <Loader inverted={props.inverted}>Loading</Loader>
    </Dimmer>
  )
}
