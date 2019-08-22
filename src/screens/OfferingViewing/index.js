/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CSSTransition, TransitionGroup } from 'react-transition-group'
// UIs
import { ClassTranscribeHeader, SidebarDimmer } from 'components'
import { Sidebar, Home, Starred, Search, OfferingDetail } from './Components'
import SearchHeader from './Components/Search/SearchHeader'
import './transition.css'
import './index.css'
// Vars
import { api } from 'utils'

export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,
      displaySearchHeader: (window.innerWidth < 600) ? false : true,

      offerings: [],
    }
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    api.getOfferingsByStudent()
      .then(({data}) => {
        this.completeOfferings(data)
        api.contentLoaded()
      })
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
      else if (window.innerWidth >= 900 && !displaySideBar) 
        this.setState({ displaySideBar: true })
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

  showSiderBar = value => {
    if (typeof value === "boolean") this.setState({ displaySideBar: value })
    else this.setState({displaySideBar: !this.state.displaySideBar})
  }

  render() {
    const { displaySideBar, displaySearchHeader, offerings } = this.state
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

            <div className="sp-content" style={paddingLeft}>
              <TransitionGroup>
                <CSSTransition key={location.key} classNames="fade" timeout={300}>
                  <Switch location={location}>
                    {/* Unauthed home page */}
                    <Route 
                      exact path="/home" 
                      render={props => <Home offerings={offerings} displaySearchHeader={displaySearchHeader} {...props} />} 
                    />
                    {/* Starred */}
                    <Route 
                      exact path="/home/starred" 
                      render={() => <Starred {...this} />}
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
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            </div>
          </div>
      )}/>
    )
  }
}