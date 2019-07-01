/**
 * Instructor Profile Page
 * - the page for instructor login
 * - lists the courses and corresponding offerings of an instructor
 */

import React from 'react'
// Layouts
import { FixedFooter, SignOutHeader } from '../../components'
import { Courses, Profile } from "./layouts"
import './index.css'
// Vars
import { api, user } from '../../util'


export class InstProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: user.id(),
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      
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
        this.setState({courseOfferings: response.data.reverse()})
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

  render() {
    return (      
      <div className="ip-bg">
        <SignOutHeader onSignOut={this.onSignOut} user={{name: user.firstName()}}/>
        <div className="ip-container">
          <Profile instructor={{name: user.fullName()}}/>
          <Courses 
            {...this}
          />
        </div>
        <FixedFooter />
      </div>
    )
  }
}
