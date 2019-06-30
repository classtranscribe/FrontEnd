import React from 'react'
// UIs
import { 
  FixedFooter, 
  SignOutHeader, 
} from '../../components'
import './index.css'
import Profile from "./profile.js";
import Courses from "./courses"
// Vars
import { api, user } from '../../util'
// import { fakeData } from '../../data';
// var instructor = fakeData.instData;

export class InstProfilePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: user.id(),
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      // courses
      courseOfferings: [],
      terms: [],
      departments: []
    }
  }

  getCourseOfferingsByInstructorId = id => {
    this.setState({userId: id})
    api.getCourseOfferingsByInstructorId(id)
      .then(response => {
        console.log(response.data)
        this.setState({courseOfferings: response.data})
      })
  }

  componentDidMount() {
    user.setUpUser(this.getCourseOfferingsByInstructorId);
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
