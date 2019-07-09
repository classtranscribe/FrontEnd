/**
 * Instructor Profile Page
 * - the page for instructor login
 * - lists the courses and corresponding offerings of an instructor
 */

import React from 'react'
// Layouts
import { FixedFooter, ClassTranscribeHeader, ClassTranscribeFooter } from '../../../components'
import { Courses, ProfileCard } from "./Components"
import './index.css'
// Vars
import { api, user } from '../../../util'


export class InstructorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: user.id(),
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      courseActivePane: localStorage.getItem('courseActivePane') || 0,
      
      courseOfferings: [],
      terms: [],
      departments: []
    }
  }

  /**
   * Callback for setUpUser below
   */
  getCourseOfferingsByInstructorId = id => {
    this.setState({userId: id})
    api.getCourseOfferingsByInstructorId(id)
      .then(response => {
        console.log(response.data)
        this.setState({courseOfferings: response.data})

        /**
         * Hide the loading page
         */
        api.contentLoaded()
      })
  }

  /**
   * GET all the data based on the user
   */
  componentDidMount() {
    /**
     * 1. Get the auth token from api with userId
     */
    user.setUpUser(this.getCourseOfferingsByInstructorId);
    /**
     * 2. Get courseOfferings 
     */
    api.getAll(['Terms', 'Departments'], (response, name) => {
      this.setState({[name]: response.data})
    })
  }

  onSignOut = () => {
    user.signout();
  }

  /* sort offering by term */
  onSort = () => {
    this.setState({sortDown: !this.state.sortDown})
    localStorage.setItem('sortDown', !this.state.sortDown ? 'down' : 'up')
  }

  setActivePane = index => {
    localStorage.setItem('courseActivePane', index.toString())
  }

  render() {
    return (      
      <div className="ip-bg">
        <ClassTranscribeHeader onSignOut={this.onSignOut} user={{name: user.firstName()}}/>
        <div className="ip-container">
          <ProfileCard instructor={{name: user.fullName()}}/>
          <Courses 
            {...this}
          />
        </div>
        <ClassTranscribeFooter />
      </div>
    )
  }
}
