import React from 'react'
import { Route } from 'react-router-dom'
// UIs
import { Tab } from 'react-bootstrap'
import { CourseSettingHeader } from '../../components'
import { PlaylistEditingPage, VideoEditingPage } from './editing-pages'
import { SideBar, Videos, EmptyResult } from './layouts'
import './index.css';
// Vars
import { user } from '../../util'
import { fakeData } from '../../data';

export class InstOfferingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,
    };
    this.playlists = fakeData.playlists; // []
    this.course = fakeData.instData.courses.length ? fakeData.instData.courses[0] : null;
    this.offering = this.course ? this.course.offerings[0] : null;
  }

  showSiderBar = () => {
    this.setState({displaySideBar: !this.state.displaySideBar})
  }

  componentDidMount() {
    /* listen on window size for showing or hiding sidebar */
    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 900) this.setState({displaySideBar: false})
      else this.setState({displaySideBar: true});
    });
  }

  /* Dimmer wrapper component when side bar is floating */
  wrapper() {
    const showWrapper = {display: (this.state.displaySideBar && window.innerWidth < 900) ? 'block' : 'none'}
    return (
      <div 
        style={showWrapper} className="cs-wrapper"
        onClick={this.showSiderBar}
      ></div>
    )
  }

  render() {
    // the padding style when sidebar is not floating
    const paddingLeft = {
      paddingLeft: (this.state.displaySideBar && window.innerWidth > 900) ? '20rem' : '0'
    }
    
    return (      
      <div className="course-container"> 
        {this.wrapper()}       
        <CourseSettingHeader showSiderBar={this.showSiderBar} user={{name: user.firstName()}} onSignOut={user.signout}/>

        <Route path='/offering/playlist-setting/:type?=:id' component={PlaylistEditingPage} />
        <Route path='/offering/video-setting/:id' component={VideoEditingPage} />
        <Route path='/offering/upload/:id' component={VideoEditingPage} />

        <Tab.Container 
          className="content" 
          defaultActiveKey={this.playlists.length ? this.playlists[0].name : 'noPlaylists'}
        >
          <SideBar {...this}/>
          <Tab.Content className="content-result" style={paddingLeft}>
            <EmptyResult {...this}/>
            <Tab.Pane eventKey="data">
              data here.
            </Tab.Pane>
            <Videos {...this} />
          </Tab.Content>
        </Tab.Container>
      </div>
    )
  }
}
