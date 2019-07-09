import React from 'react'
import { Col, Nav, Navbar } from 'react-bootstrap'
import { Grid, List, Header } from 'semantic-ui-react'
import './index.css'


export function FixedFooter(props) {
  return (
    <Navbar variant={props.isDark ? "dark" : "light"} aria-label="Footer">
      <Nav className="ct-fixed-footer">
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}

export function ClassTranscribeFooter(props) {
  return (
    <div className="ct-footer" aria-label="Footer">
      <Grid stackable>
        <Grid.Row>
          <Header className="title">About</Header>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={3}>
            <List link>
              <List.Item as="a">About Us</List.Item>
              <List.Item as="a" href="mailto:classtranscribe@illinois.edu" target="_blank">Contact Us</List.Item>
            </List>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <div className="copy">&copy; 2016-2018 UIUC</div>
    </div>
  )
}