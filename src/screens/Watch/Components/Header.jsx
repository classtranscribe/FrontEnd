import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

export function Header(props) {
  return (
    <Navbar sticky="top" variant="dark" className="vp-navbar" >
      <Navbar.Brand className="brand" href="/class-transcribe-frontend/#/">Class Transcribe</Navbar.Brand>
      <Nav className="navs">
        <Nav.Item>
          <Nav.Link onClick={props.goBack}>
            <i class="fas fa-chevron-left"></i> Go Back
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link className="pl-trigger" onClick={props.playlistTrigger}>
            <i class="fas fa-list"></i>
          </Nav.Link>
        </Nav.Item>
      </Nav>
    </Navbar>
  );
}