/**
 * Instructor Offering Page
 * - The page component for a specific offering
 * - including playlists and videos
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
// UI
import './index.css'
import { ClassTranscribeHeader } from 'components'
import { PlaylistEditing, VideoEditing } from './EditingPages'
import { SideBar, EmptyResult, DataDemo, Playlist } from './Components'
import OfferingSettingPage from '../OfferingEditing'
// Vars
import { user, api, util } from 'utils'


export class InstructorOffering extends React.Component {
  constructor(props) {
    super(props)

    // offeringId
    this.id = this.props.match.params.id 

    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,

      courseOffering: {},
      playlists: [],
      playlistLoaded: false,
    }
  }

  showSiderBar = () => {
    this.setState({displaySideBar: !this.state.displaySideBar})
  }

  componentDidMount() {
    if (!user.isLoggedIn()) {
      user.login()
    } 
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

    /**
     * GET playlists based on offeringId
     */
    api.getPlaylistsByOfferingId(this.id)
      .then( ({data}) => {
        this.setState({ playlists: data, playlistLoaded: true })
        console.log('playlists', data)
      })
  }

  /**
   * Redirect the route to the first playlist
   */
  componentDidUpdate(prevProps, prevState) {
    if (prevState.playlists !== this.state.playlists || prevState.courseOffering !== this.state.courseOffering) {
      const { props, id, state } = this
      const isExactOfferingPage = window.location.pathname === `/offering/${id}`
      if (state.playlists.length && state.courseOffering.courses.length && isExactOfferingPage) 
        props.history.push(util.links.offeringPlaylist(
          id, api.getFullNumber(state.courseOffering.courses, '-'), 
          state.playlists[0].id
        ))
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
    const { displaySideBar, playlists } = this.state
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
        <Route path={`/offering/${this.id}/offering-setting/:type?=:id`} component={OfferingSettingPage} />
        <Route path={`/offering/${this.id}/playlist-setting/:type?=:id`} component={PlaylistEditing} />
        <Route path='/offering/video-setting/:id' component={VideoEditing} />
        <Route path='/offering/upload/:id' component={VideoEditing} />

        {/* Layouts */}
        <div
          className="content" 
          defaultActiveKey={'noPlaylists'}
        >
          <SideBar {...this}/>

          <div className="content-result" style={paddingLeft}>
            {
              !playlists.length
              &&
              <EmptyResult {...this} />
            }

            <Route
              render={({ location }) => (
                <TransitionGroup>
                  <CSSTransition key={location.key} classNames="fade" timeout={300}>
                    <Switch location={location}>
                      <Route exact path={`/offering/${this.id}/data`} component={DataDemo} />
                      <Route exact path={`/offering/${this.id}/playlist/:courseNumber?=:id`} component={Playlist} />
                    </Switch>
                  </CSSTransition>
                </TransitionGroup>
              )} 
            />
          </div>
        </div>
      </main>
    )
  }
}
