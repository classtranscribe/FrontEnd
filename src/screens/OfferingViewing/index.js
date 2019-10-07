/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
// UIs
import { SidebarDimmer } from 'components'
import { Sidebar, Home, Starred, History, Search, OfferingDetail, PersonalReport } from './Components'
import SearchHeader from './Components/SearchHeader'
import './transition.css'
import './index.css'
// Vars
import { api, util, handleData } from 'utils'

export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySideBar: (window.innerWidth < 900 /*|| user.isLoggedIn()*/) ? false : true,
      displaySearchHeader: (window.innerWidth < 600) ? false : true,

      offerings: ['Unloaded'],
      watchHistory: ['unloaded']
    }
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    this.getOfferingsByStudent()
    /**
     * 2. listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', () => {
      const { displaySideBar, displaySearchHeader } = this.state
      if (window.innerWidth < 600 && displaySearchHeader) 
        this.setState({ displaySearchHeader: false })
      else if (window.innerWidth >= 600 && !displaySearchHeader)
        this.setState({ displaySearchHeader: true })

      if (window.innerWidth < 900 && displaySideBar) 
        this.setState({ displaySideBar: false })
      else if (window.innerWidth >= 900 && !displaySideBar/* && !user.isLoggedIn()*/) 
        this.setState({ displaySideBar: true })
    })
    util.completeWatchHistoryArray(watchHistory => this.setState({ watchHistory }))
  }

  getOfferingsByStudent = () => {
    const offerings = util.getStoredOfferings()
    if (offerings) {
      this.setState({ offerings })
      return;
    }
    this.setState({ offerings: ['Unloaded'] })
    api.getOfferingsByStudent()
      .then(({data}) => {
        this.completeOfferings(data.slice().reverse())
        api.contentLoaded()
      })
      .catch(error => {
        this.setState({ offerings: ['retry'] })
        api.contentLoaded()
      })
  }  

  completeOfferings = async rawOfferings => {
    const offerings = await api.parseOfferings(rawOfferings)
    this.setState({ offerings })
    util.storeOfferings(offerings)
  }

  showSiderBar = value => {
    if (typeof value === "boolean") this.setState({ displaySideBar: value })
    else this.setState({displaySideBar: !this.state.displaySideBar})
  }

  removeWatchHistory = mediaId => {
    util.removeStoredMediaInfo(mediaId)
    const { watchHistory } = this.state
    handleData.remove(watchHistory, { mediaId })
    this.setState({ watchHistory })
  }

  render() {
    const { displaySideBar, displaySearchHeader, offerings, watchHistory } = this.state
    // the padding style of the content when sidebar is not floating
    const paddingLeft = {
      paddingLeft: (displaySideBar && window.innerWidth > 900) ? '22rem' : displaySearchHeader ? '2rem' : '0rem'
    }

    return (
      <Route
        render={({ location }) => (

          <div className="sp-bg" ref={this.listen}>
            <SidebarDimmer show={displaySideBar && window.innerWidth < 900} onClose={() => this.showSiderBar(false)} />
            <SearchHeader
              displaySearchHeader={displaySearchHeader}
              showSiderBar={this.showSiderBar} 
              display={displaySideBar}
            />   
            <Sidebar {...this} />

            <main className="sp-content" style={paddingLeft}>
              <h1 className="accessbility_hide">Home</h1>
              <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                  <Switch location={location}>
                    {/* Unauthed home page */}
                    <Route 
                      exact path="/home" 
                      render={props => <Home offerings={offerings} watchHistory={watchHistory} displaySearchHeader={displaySearchHeader} {...props} />} 
                    />
                    {/* Starred */}
                    <Route 
                      exact path="/home/starred" 
                      render={() => <Starred {...this} />}
                    />
                    {/* History */}
                    <Route 
                      exact path="/home/history" 
                      render={() => <History {...this} watchHistory={watchHistory} />}
                    />
                    {/* Offering Detail page */}
                    <Route 
                      exact path='/home/offering/:id'
                      render={({ match, ...props }) => <OfferingDetail id={match.params.id} {...props} />}
                    />
                    {/* Search Page */}
                    <Route 
                      exact path='/home/search' 
                      render={props => <Search offerings={offerings} {...props} />}
                    />

                    {/* Personal Report */}
                    <Route 
                      exact path="/home/personal-report"
                      render={props => <PersonalReport {...props} {...this.state} />}
                    />
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </main>
          </div>
      )}/>
    )
  }
}