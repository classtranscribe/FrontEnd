/**
 * Offering Viewing Page/Home Page/Student Page of ClassTranscribe
 */

import React from 'react'
import { Route } from 'react-router-dom'
// UIs
import { ClassTranscribeHeader, ClassTranscribeFooter } from '../../components'
import { Sidebar, Home, Starred } from './Components'
import './index.css'
// Vars
import { user, api, util } from '../../util'


export class OfferingViewing extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      displaySideBar: (window.innerWidth < 900) ? false : true,
    }
  }

  componentDidMount() {
    /**
     * 1. Setup user and then get all data based on userId
     */
    if (user.isLoggedIn()) {
      user.setUpUser(()=>api.contentLoaded())
    } else {
      api.contentLoaded()
    }
    /**
     * 2. listen on window size for showing or hiding sidebar
     */
    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 900) this.setState({displaySideBar: false})
      else this.setState({displaySideBar: true})
    })
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
    const { displaySideBar } = this.state
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
          <Route path={util.links.studentHome()} component={Home}/>
          <Route path={util.links.studentStarred()} render={()=><Starred {...this} />}/>
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