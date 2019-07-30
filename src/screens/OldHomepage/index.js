import React from 'react';
import {Row, Col, Jumbotron, Button, Navbar, Nav } from 'react-bootstrap';
import { Link } from "react-scroll";
import './index.css';

export class Homepage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      btnSelect: ['active', 'menu-tab', 'menu-tab'],
    }
  }

  componentDidMount() {
    document.addEventListener('scroll', () => {
      if (window.scrollY < 100) { // start page
        this.setState({btnSelect: ['active', 'menu-tab', 'menu-tab']});
      } 
      if (window.scrollY > 550 && window.scrollY < 600) { // about us
        this.setState({btnSelect: ['menu-tab', 'active', 'menu-tab']});
      }   
      if (window.scrollY > 670) { // contact
        this.setState({btnSelect: ['menu-tab', 'menu-tab', 'active']});
      } 
    });
  }

  render() {
    return (
      <div>
        <Header />
        <Menu btnSelect={this.state.btnSelect}/>
        <AboutUs />
        <Contact />
        <Footer btnSelect={this.state.btnSelect}/>
      </div>
    );
  }
}

/**
 * Header
 * @param {*} props 
 */
function Header(props) {
  return(
    <header className="start-page parallax-background" id="home" role="banner">
      <Jumbotron className="opacity">
        <h1 className="welcome-text">
          WELCOME TO<br/>
          <span>CLASS TRANSCRIBE</span>
        </h1>
        <div class="arrow-down"></div>
        <Button 
          className="login-signup-btn" 
          variant="outline-light" size="lg"
          href="/class-transcribe-frontend/#/login"
        >SIGN IN TO SEE VIDEOS</Button>
      </Jumbotron>
    </header>
  );
}

/* helper funtion for a nice scroll w/o jQuery */
function scrollLink(name, id, btnSelect) {
  const key= id === 'home' ? 0 : id === 'about-us' ? 1 : 2;
  return (
    <Nav.Link as={Link} 
      to={id} smooth={true}
      offset={(id === 'about-us') ? -100 : 0} duration={500}
      className={btnSelect[key]}
    >
      {name}
    </Nav.Link>
  )
}

/**
 * Menu bar
 * @param {*} props 
 */
function Menu(props) {
  return (
    <Navbar bg="dark" variant="dark" className="menu" sticky="top">
      <Navbar.Brand className="logo" disabled>UIUC</Navbar.Brand>
      <Navbar.Toggle/>
      <Navbar.Collapse>
        <Nav className="menu-tab-container">
          {scrollLink('HOME',     "home",     props.btnSelect)}
          {scrollLink('ABOUT US', "about-us", props.btnSelect)}
          {scrollLink('CONTACT',  "contact",  props.btnSelect)}
        </Nav>    
      </Navbar.Collapse>
    </Navbar>
  )
}

/**
 * About us
 * @param {*} props 
 */
function AboutUs(props) {
  const aboutUsCol = [
    {className: "fas fa-question-circle",   text: 'Our mission is to provide text-searchable lecture videos for all students'},
    {className: "fas fa-comments",          text: 'Captions are created using automated transcription and perfected with your help'},
    {className: "fas fa-universal-access",  text: 'We strive to meet modern accessibility standards to promote inclusive learning'}
  ];

  return (
    <main className="about-us" id="about-us">
      <h2>ABOUT US</h2>
      <p className="title">ClassTranscribe is an open-source, web-based platform developed by students and faculty at the University of Illinois at Urbana-Champaign</p>
      <Row>
        {aboutUsCol.map( discription => (
          <Col>
            <p><i className={discription.className}></i></p>
            <p>{discription.text}</p>
          </Col>
        ))}
      </Row>
    </main>
  );
}

/**
 * Contact info
 * @param {*} props 
 */
function Contact(props) {
  return (
    <Jumbotron className="contact" id="contact">
      <h2>CONTACT</h2>
      <p>Questions? Comments? Let us know!</p>
      <Row className="contact-email">
        <i class="fas fa-envelope"></i> <a href="mailto:classtranscribe@illinois.edu">ClassTranscribe@illinois.edu</a>
      </Row>
    </Jumbotron>
  )
}

/**
 * footer of the homepage
 * @param {*} props 
 */
function Footer(props) {
  return (
    <Navbar bg="dark" variant="dark" sticky="bottom">
      <Nav className="footer-tab-container">
        {scrollLink('HOME', "home", "footer-home", props)}
        <Nav.Link as={Col} className="footer-copy" disabled>&copy; 2016-2018 UIUC</Nav.Link>
      </Nav>    
    </Navbar>
  )
}