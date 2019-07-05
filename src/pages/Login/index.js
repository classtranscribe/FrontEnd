import React from 'react';
// UIs
import { 
  Button as UIButton, Icon, Transition, Button, 
} from 'semantic-ui-react'
import { Row, Col, Accordion } from 'react-bootstrap'
import './index.css'
// Vars
// import { instructors } from '../util/handledata'
const aboutUsCol = [
  {className: "question circle",   text: 'Our mission is to provide text-searchable lecture videos for all students'},
  {className: "comments",          text: 'Captions are created using automated transcription and perfected with your help'},
  {className: "universal access",  text: 'We strive to meet modern accessibility standards to promote inclusive learning'}
];


export class LoginPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      aboutUs: false,
      visible: true,
    }
  }

  openAboutUs = () => {
    window.scrollBy(1000, 100);
    this.setState({aboutUs: !this.state.aboutUs})
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({visible: !this.state.visible})
    }, 1700);

    // hide the loading page
    const ele = document.getElementById('ct-loading-wrapper')
    if(ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        ele.outerHTML = ''
      }, 2000)
    }
    
  }
  
  render() {
    return (
      <>
        <div className="lg-bg"></div>

        <div className="lg-wrapper" id="container" onClick={this.openAboutUs}>
          <div className="triangle-up-big"></div>

          <p className="brand">CLASS TRANSCRIBE</p>
          
          <div className="login-container">
            <UIButton className="inst-btn" size="massive" secondary href="/instructor/">
              <i class="fas fa-graduation-cap"></i>  Instructor Login
            </UIButton>
            <UIButton className="stu-btn" size="massive" primary href="/student/">
              <i class="fas fa-users"></i>&ensp;Student Login&ensp;
            </UIButton>
            <UIButton className="admin-btn" size="massive" color='brown' href="/admin/">
              <i class="fas fa-users-cog"></i>&ensp;Admin Login&ensp;
            </UIButton>
          </div>

          <div className="triangle-up-small"></div>

          <BounceBtn visible={this.state.visible} />

          
          <AboutUs visible={this.state.visible} open={this.state.aboutUs} click={this.openAboutUs}/>  
        </div>
        
        
      </>
    );
  }
}

function BounceBtn(props) {
  return (
    <div className="aboutus-btn">
      <Transition animation='bounce' duration='1500' visible={props.visible}>
        <Icon name="angle double down" size="huge" color="grey" onClick={()=>1}/>
      </Transition>
    </div>
  )
}

function AboutUs(props) {
  return (
    <Accordion defaultActiveKey="0" className="aboutus-accordion">
      <Accordion.Toggle as={Button} eventKey="0" style={{display: 'none'}}/>
      <Accordion.Collapse eventKey="0">
      <div className="aboutus-content">
          <p id="aboutus" className="aboutus-title">ABOUT US</p>
          
          <Row>
            {aboutUsCol.map( description => (
              <Col style={{display: 'flex', flexDirection: 'column',alignItems: 'center', height: '18rem'}}>
                <Icon className="icon" name={description.className}/>
                <p className="description">{description.text}</p>
              </Col>
            ))}
          </Row>

          <div className="divider"></div>

          <p className="contact">CONTACT</p>
          <p className="qinfo">Questions? Comments? Let us know!</p>
          <Row className="email">
              <i class="fas fa-envelope"></i>&ensp;<a href="mailto:classtranscribe@illinois.edu">ClassTranscribe@illinois.edu</a>
          </Row>
          
          <p className="copy">&copy; 2016-2018 UIUC</p>
        </div>
      </Accordion.Collapse>
  </Accordion>
  )
}