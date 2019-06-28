import React from 'react'
import { api, user } from '../../util'

// UIs
import { 
  FixedFooter, 
  SignOutHeader, 
} from '../../components'
import './index.css'
import Profile from "./profile.js";
import Courses from "./courses"
// Vars
import { fakeData } from '../../data';
var instructor = fakeData.instData;
// instructor.courses = []; // empty test

export class InstProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: user.id(),
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      // courses
      courses: instructor.courses//[],
    }
  }

  getCourseOfferingsByInstructorId = id => {
    this.setState({userId: id})
    api.getCourseOfferingsByInstructorId(id)
      .then(response => {
        console.log(response.data)
        // this.setState({courses: response.data})
      })
  }

  componentDidMount() {
    user.setUpUser(this.getCourseOfferingsByInstructorId);
    // api.getData('Offerings', 'f7952421-94f3-413e-8270-80ee15b30e70')
    //   .then( response => {
    //     console.log(response.data)
    //   })
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
            instructor={instructor}
          />
        </div>
        <FixedFooter />
      </div>
    )
  }
}
