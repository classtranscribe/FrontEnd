/**
 * Instructor Profile Page
 * - the page for instructor login
 * - lists the courses and corresponding offerings of an instructor
 */

import React from 'react'
import { Route } from 'react-router-dom'
// Layouts
import { ClassTranscribeHeader, ClassTranscribeFooter } from 'components'
import { Courses, ProfileCard } from "./Components"
import OfferingSettingPage from '../OfferingEditing'
import './index.css'
// Vars
import { api, user, handleData } from 'utils'


export class InstructorProfile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: user.id(),
      userInfo: {},
      userUni: '',
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      courseActivePane: localStorage.getItem('courseActivePane') || 0,
      
      courseOfferings: [],
      universities: [],
      terms: [],
      departments: []
    }
  }

  /**
   * Callback for setUpUser below
   */
  getCourseOfferingsByInstructorId = () => {
    api.getCourseOfferingsByInstructorId(this.state.userInfo.userId)
      .then(response => {
        console.log(response.data)
        this.setState({courseOfferings: response.data})
        api.contentLoaded()
      })
  }

  /**
   * GET all the data based on the user
   */
  componentDidMount() {
    /**
     * 1. Login
     */
    if (!user.isLoggedIn()) {
      user.login()
    } else {
      const userInfo = user.getUserInfo()
      this.setState({ userInfo })
    }
    /**
     * 2. Get courseOfferings 
     */
    api.getAll(['Universities', 'Terms', 'Departments'], (response, name) => {
      this.setState({[name]: response.data})
    })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.userInfo !== this.state.userInfo) {
      this.getCourseOfferingsByInstructorId()
    }
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
        <Route path='/instructor/offering-setting/:type?=:id' component={OfferingSettingPage} />
        <ClassTranscribeHeader />
        <div className="ip-container">
          <ProfileCard {...this.state} />
          <Courses 
            {...this}
          />
        </div>
        <ClassTranscribeFooter />
      </div>
    )
  }
}
