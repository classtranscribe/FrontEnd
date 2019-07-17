/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React, { lazy, Suspense } from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
// UIs
import { ClassTranscribeHeader, ClassTranscribeFooter } from '../../components'
import { Sidebar, Home, Starred } from './Components'
import './transition.css'
import './index.css'
// Vars
import { user, api, util } from '../../util'

const Search = lazy(() => import('./Components/Search'))
const OfferingDetail = lazy(() => import('./Components/OfferingDetail'))



export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,

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
      api.getData('Offerings')
        .then( ({data}) => {
          this.completeOfferings(data)
          api.contentLoaded()
        })
    }
    /**
     * 2. listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 900) this.setState({displaySideBar: false})
      else this.setState({displaySideBar: true})
    })
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
    this.setState({displaySideBar: !this.state.displaySideBar})
  }

  /**
   * Function for signout
   */
  onSignOut = () => { 
    user.signout() 
  }

  render() {
    const offeringDetailPath = user.isLoggedIn() ? '/student/home/offering/:id' : '/offering/:id'
    const { displaySideBar, offerings } = this.state
    // the padding style of the content when sidebar is not floating
    const paddingLeft = {
      paddingLeft: (displaySideBar && window.innerWidth > 900) ? '22rem' : '2rem'
    }
    return (
      <div className="sp-bg" ref={this.listen}>
        <ClassTranscribeHeader 
          showSiderBar={this.showSiderBar} 
          display={displaySideBar}
          onSignOut={this.onSignOut} 
        />   
        <Sidebar {...this} />

        <div className="sp-content" style={paddingLeft}>

          <Route 
            exact path={util.links.studentHome()} 
            render={() => <Home offerings={offerings} />}
          />

          <Route 
            exact path={util.links.studentStarred()} 
            render={()=><Starred {...this} />}
          />

          <Route path={offeringDetailPath}>
            {({ match, history }) => (
              <CSSTransition in={match != null} timeout={500} classNames="offering-detail" unmountOnExit>
                <Suspense fallback={<div>loading...</div>}>
                  <OfferingDetail 
                    offerings={offerings}
                    history={history} 
                    id={ match ? match.params.id : '' } 
                  />
                </Suspense>
              </CSSTransition>
            )}
          </Route>

          <Route path={util.links.search()}>
            {({ match, history }) => (
              <CSSTransition in={match != null} timeout={500} classNames="search-bar" unmountOnExit>
                <Suspense fallback={<div>loading...</div>}>
                  <Search history={history} offerings={offerings} />
                </Suspense>
              </CSSTransition>
            )}
          </Route>

          {
            !user.isLoggedIn()
            &&
            <Home {...this} />
          }

          <ClassTranscribeFooter />
        </div>
      </div>
    );
  }
}