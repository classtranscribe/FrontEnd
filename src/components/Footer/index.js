import React from 'react'
import { Link } from 'react-router-dom'
import { Col, Nav, Navbar } from 'react-bootstrap'
import { Grid, Image } from 'semantic-ui-react'
import './index.css'
import { logoOutline as logo } from '../../images'
import { util } from '../../utils'


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
    <footer className="ct-footer" aria-label="Footer">
      <Grid stackable columns='equal' verticalAlign="middle" textAlign="center">
        <Grid.Row>
          <Grid.Column>
            <Link to={util.links.currentUrl()}>About Us</Link>
          </Grid.Column>
          <Grid.Column>
            <Link to={util.links.currentUrl()}>Documents</Link>
          </Grid.Column>
          <Grid.Column>
            <Image alt="logo" className="brand-img" style={{height: '1.5rem'}} src={logo}/> 
          </Grid.Column>
          <Grid.Column>
            <a href="mailto:classtranscribe@illinois.edu" target="_blank">Contact Us</a>
          </Grid.Column>
          <Grid.Column className="copy">
            &copy; 2016-2019 UIUC
          </Grid.Column>
        </Grid.Row>
      </Grid>
      {/* <div className="copy">&copy; 2016-2019 UIUC</div> */}
    </footer>
  )
}