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
import { ClassTranscribeHeader } from '../../../components'
import { PlaylistEditing, VideoEditing } from './EditingPages'
import { SideBar, VideoList, EmptyResult } from './Components'
// Vars
import { user, api, handleData } from '../../../util'
import { fakeData } from '../../../data' // fake playlists
const { initialOffering, initialTerm } = api.initialData


export class InstructorOffering extends React.Component {
  constructor(props) {
    super(props)

    // offeringId
    this.id = this.props.match.params.id 
    // fake playlists
    this.playlists = fakeData.playlists // []

    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,
      activePane: localStorage.getItem('offeringActivePane') || this.playlists[0].name, // should be playlist id
      courseOffering: {...handleData.copy(initialOffering), courses: []},
      term: handleData.copy(initialTerm),

      loadingCourses: true,
      loadingTerm: true,
      loadingOfferingFirstTime: true,
      loadingOfferingInfo: true,
    }
  }

  showSiderBar = () => {
    this.setState({displaySideBar: !this.state.displaySideBar})
  }

  setActivePane = eventKey => {
    this.setState({activePane: eventKey})
    localStorage.setItem('offeringActivePane', eventKey)
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
              this.setState({ courseOffering, loadingCourses: false})
            })
        })
        /**
         * 3. Get term by offering.termId ---to get the term.name
         */
        api.getData('Terms', response.data.offering.termId)
          .then( response => {
            this.setState({term: response.data, loadingTerm: false})
          })

        const ele = document.getElementById('ct-loading-wrapper')
        if(ele) {
          // fade out
          ele.classList.add('available')
          setTimeout(() => {
            // remove from DOM
            ele.outerHTML = ''
            // ele.classList.add('hide')
          }, 1000)
        }
      })
  }

  /**
   * Check whether the content is loaded
   */
  componentDidUpdate(prevProps, prevState, snapshot) {
    // if the Offering info is fully loaded, hide loading wrapper
    const { loadingTerm, loadingCourses, loadingOfferingFirstTime } = this.state;
    if (!loadingTerm && !loadingCourses && loadingOfferingFirstTime) {
          this.setState({loadingOfferingInfo: false, loadingOfferingFirstTime: false})
    }
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
    const { activePane } = this.state
    
    return (      
      <main className="op-bg"> 
        {this.wrapper()}       
        <ClassTranscribeHeader 
          showSiderBar={this.showSiderBar} 
          user={{name: user.firstName()}} 
          onSignOut={user.signout}
        />

        {/* Sub-Routes to editing pages for playlist & video */}
        <Route path='/offering/playlist-setting/:type?=:id' component={PlaylistEditing} />
        <Route path='/offering/video-setting/:id' component={VideoEditing} />
        <Route path='/offering/upload/:id' component={VideoEditing} />

        {/* Layouts */}
        <Tab.Container 
          className="content" 
          defaultActiveKey={this.playlists.length ? activePane : 'noPlaylists'}
        >
          <SideBar {...this}/>

          <Tab.Content className="content-result" style={paddingLeft}>
            {/* When there is no playlists yet */}
            <EmptyResult {...this}/>
            {/* Data demo */}
            <Tab.Pane eventKey="data" aria-label="Data Representation">
              data here.
            </Tab.Pane>
            {/* Video list */}
            <VideoList {...this} />
          </Tab.Content>

        </Tab.Container>
      </main>
    )
  }
}
