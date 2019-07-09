import React from 'react'
import { Col, Nav, Navbar } from 'react-bootstrap'
import { Grid, List, Header } from 'semantic-ui-react'
import './index.css'


export function FixedFooter(props) {
  return (
    <Navbar variant={props.isDark ? "dark" : "light"} aria-label="Footer">
      <Nav className="ct-fixed-footer">
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2019 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}

export function ClassTranscribeFooter(props) {
  return (
    <div className="ct-footer" aria-label="Footer">
      <Grid stackable columns='equal' verticalAlign="middle" textAlign="center">
        <Grid.Row>
          <Grid.Column>
            <List.Item as="a" href="/">About Us</List.Item>
          </Grid.Column>
          <Grid.Column>
            <List.Item as="a" href="mailto:classtranscribe@illinois.edu" target="_blank">Contact Us</List.Item>
          </Grid.Column>
          <Grid.Column>
            &copy; 2016-2019 UIUC
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* <div className="copy">&copy; 2016-2019 UIUC</div> */}
    </div>
  )
}