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
import OfferingSettingPage from '../OfferingEditing'
// Vars
import { user, api, handleData } from '../../../util'


export class InstructorOffering extends React.Component {
  constructor(props) {
    super(props)

    // offeringId
    this.id = this.props.match.params.id 

    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,

      courseOffering: {},
      playlists: [],
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
    api.getOfferingById(this.id)
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
        api.completeSingleOffering(response.data, courseOffering => this.setState({ courseOffering }))
        /**
         * 3. Hide the loading page
         */
        api.contentLoaded()
      })

    api.getPlaylistsByOfferingId(this.id)
      .then( ({data}) => {
        this.setState({ playlists: data })
        console.log(data)
      } )
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
    const { displaySideBar } = this.state
    // the padding style of the content when sidebar is not floating
    const paddingLeft = {
      paddingLeft: (displaySideBar && window.innerWidth > 900) ? '20rem' : '0'
    }

    return (      
      <main className="op-bg"> 
        {this.wrapper()}       
        <ClassTranscribeHeader 
          showSiderBar={this.showSiderBar} 
          onSignOut={user.signout}
          display={displaySideBar}
        />

        {/* Sub-Routes to editing pages for playlist & video */}
        <Route path='/offering/offering-setting/:type?=:id' component={OfferingSettingPage} />
        <Route path='/offering/playlist-setting/:type?=:id' component={PlaylistEditing} />
        <Route path='/offering/video-setting/:id' component={VideoEditing} />
        <Route path='/offering/upload/:id' component={VideoEditing} />

        {/* Layouts */}
        <Tab.Container 
          className="content" 
          defaultActiveKey={'noPlaylists'}
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
            {/* <VideoList {...this} /> */}
          </Tab.Content>

        </Tab.Container>
      </main>
    )
  }
}
