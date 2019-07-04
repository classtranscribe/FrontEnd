import React from 'react'
import { Col, Nav, Navbar } from 'react-bootstrap'
import './index.css'


export function FixedFooter(props) {
  return (
    <Navbar variant={props.isDark ? "dark" : "light"} aria-label="Footer">
      <Nav className="ct-fixed-footer">
        <Nav.Link href="/class-transcribe-frontend/#/">Home</Nav.Link>
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}