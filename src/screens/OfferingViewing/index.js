/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
// UIs
import { ClassTranscribeHeader } from 'components'
import { Sidebar, Home, Starred, Search, OfferingDetail } from './Components'
import './transition.css'
import './index.css'
// Vars
import { user, api } from 'utils'



export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props)
    this.isLoggedIn = user.isLoggedIn() || localStorage.getItem('userId')
    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,
      alreadySet: false,

      offerings: [],
    }
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    if (user.isLoggedIn()) {
      user.setUpUser(this.getOfferingsByStudentId)
    } else {
      api.getOfferings()
        .then( ({data}) => {
          this.completeOfferings(data)
          api.contentLoaded()
        })
    }
    /**
     * 2. listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 900) 
        this.setState({ displaySideBar: false })
      else if (!this.state.alreadySet) 
        this.setState({ displaySideBar: true })
    })
  }

  componentWillMount() {
    const currPath = window.location.pathname
    if (this.isLoggedIn && !currPath.includes('student')) {
      window.location = '/student'+currPath
    }
  }

  /**
   * GET functions for set states
   */
  getOfferingsByStudentId = userId => {
    this.setState({ userId })
    api.getOfferingsByStudentId(userId)
      .then( ({data}) => {
        console.log(data)
        this.completeOfferings(data)
        api.contentLoaded()
      })
  }

  completeOfferings = rawOfferings => {
    this.setState({ offerings: rawOfferings })
    api.completeOfferings(
      rawOfferings, 
      this.state.offerings,
      offerings => this.setState({ offerings })
    )
  }

  showSiderBar = () => {
    this.setState({displaySideBar: !this.state.displaySideBar, alreadySet: true})
  }

  /**
   * Function for signout
   */
  onSignOut = () => { 
    user.signout() 
  }

  render() {
    const isLoggedIn = this.isLoggedIn
    const offeringDetailPath = isLoggedIn ? '/student/home/offering/:id' : '/home/offering/:id'
    const searchPath = isLoggedIn ? '/student/home/search' : '/home/search'

    const { displaySideBar, offerings } = this.state
    // the padding style of the content when sidebar is not floating
    const paddingLeft = {
      paddingLeft: (displaySideBar && window.innerWidth > 900) ? '22rem' : '2rem'
    }

    return (
      <Route
        render={({ location }) => (

          <div className="sp-bg" ref={this.listen}>
            <ClassTranscribeHeader 
              showSiderBar={this.showSiderBar} 
              display={displaySideBar}
              onSignOut={this.onSignOut} 
            />   
            <Sidebar {...this} />

            <div className="sp-content" style={paddingLeft}>
              <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                  <Switch location={location}>
                    {/* Unauthed home page */}
                    <Route 
                      exact path="/home" 
                      render={props => <Home offerings={offerings} {...props} />} 
                    />
                    {/* Authed home page */}
                    <Route 
                      exact path="/student/home"
                      render={props => <Home offerings={offerings} {...props} />}
                    />
                    {/* Starred */}
                    <Route 
                      exact path="/student/starred" 
                      render={() => <Starred {...this} />}
                    />
                    {/* Offering Detail page */}
                    <Route 
                      exact path={offeringDetailPath}
                      render={({ match, history }) => <OfferingDetail history={history} id={match.params.id} />}
                    />
                    {/* Search Page */}
                    <Route 
                      exact path={searchPath} 
                      render={() => <Search offerings={offerings} />}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </div>
          </div>
      )}/>
    )
  }
}