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
import { api } from 'utils'

export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props)
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
    this.getOfferingsByStudentId()
    /**
     * 2. listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', () => {
      if (window.innerWidth < 900) 
        this.setState({ displaySideBar: false })
      else if (!this.state.alreadySet) 
        this.setState({ displaySideBar: true })
    })
  }

  /**
   * GET functions for set states
   */
  getOfferingsByStudentId = () => {
    api.getOfferingsByStudent()
      .then(({data}) => {
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

  render() {
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
                    {/* Starred */}
                    <Route 
                      exact path="/home/starred" 
                      render={() => <Starred {...this} />}
                    />
                    {/* Offering Detail page */}
                    <Route 
                      exact path='/home/offering/:id'
                      render={({ match, history }) => <OfferingDetail history={history} id={match.params.id} />}
                    />
                    {/* Search Page */}
                    <Route 
                      exact path='/home/search' 
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