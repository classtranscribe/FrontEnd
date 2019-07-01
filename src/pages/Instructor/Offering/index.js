/**
 * Instructor Offering Page
 * - The page component for a specific offering
 * - including playlists and videos
 */

import React from 'react'
import { Route } from 'react-router-dom'
// UI
import { Tab } from 'react-bootstrap'
import './index.css'
// Layout components
import { CourseSettingHeader } from '../../../components'
import { PlaylistEditing, VideoEditing } from './EditingPages'
import { SideBar, VideoList, EmptyResult } from './Components'
// Vars
import { user, api, handleData } from '../../../util'
import { fakeData } from '../../../data' // fake playlists
const { initialOffering, initialTerm } = api.initialData


export class InstructorOffering extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,
      courseOffering: handleData.copy(initialOffering),
      term: handleData.copy(initialTerm),
    }
    // offeringId
    this.id = this.props.match.params.id 
    // fake playlists
    this.playlists = fakeData.playlists // []
  }

  showSiderBar = () => {
    this.setState({displaySideBar: !this.state.displaySideBar})
  }

  componentDidMount() {
    /**
     * listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 900) this.setState({displaySideBar: false})
      else this.setState({displaySideBar: true})
    })

    /**
     * Get all the data based on the offeringId
     */
    api.getData('Offerings', this.id)
      .then( response => {
        console.log(response.data)
        /**
         * 1. get and set courseOffering
         */
        this.setState({courseOffering: response.data})
        /** 
         * 2. get all the departments associated with the courses
         *    and modify the course.courseNumber with depart acronym 
         */
        const { courses } = response.data
        courses.forEach( (course, index) => {
          api.getData('Departments', course.departmentId)
            .then( response => {
              const { courseOffering } = this.state
              const { courseNumber } = courseOffering.courses[index]
              const { acronym } = response.data
              courseOffering.courses[index].courseNumber = acronym + courseNumber
              this.setState({courseOffering})
            })
        })
        /**
         * 3. Get term by offering.termId ---to get the term.name
         */
        api.getData('Terms', response.data.offering.termId)
          .then( response => {
            this.setState({term: response.data})
          })
      })
  }

  /**
   * Dimmer wrapper for contents when side bar is floating 
   */
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
    // the padding style of the content when sidebar is not floating
    const paddingLeft = {
      paddingLeft: (this.state.displaySideBar && window.innerWidth > 900) ? '20rem' : '0'
    }
    
    return (      
      <div className="course-container"> 
        {this.wrapper()}       
        <CourseSettingHeader showSiderBar={this.showSiderBar} user={{name: user.firstName()}} onSignOut={user.signout}/>

        {/* Sub-Routes to editing pages for playlist & video */}
        <Route path='/offering/playlist-setting/:type?=:id' component={PlaylistEditing} />
        <Route path='/offering/video-setting/:id' component={VideoEditing} />
        <Route path='/offering/upload/:id' component={VideoEditing} />

        {/* Layouts */}
        <Tab.Container 
          className="content" 
          defaultActiveKey={this.playlists.length ? this.playlists[0].name : 'noPlaylists'}
        >
          <SideBar {...this}/>

          <Tab.Content className="content-result" style={paddingLeft}>
            {/* When there is no playlists yet */}
            <EmptyResult {...this}/>
            {/* Data demo */}
            <Tab.Pane eventKey="data">
              data here.
            </Tab.Pane>
            {/* Video list */}
            <VideoList {...this} />
          </Tab.Content>

        </Tab.Container>
      </div>
    )
  }
}
