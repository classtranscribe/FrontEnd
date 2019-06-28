import React from 'react'
import authentication from 'react-azure-adb2c'
import { api, user } from '../../util'

// UIs
import { 
  FixedFooter, 
  SignOutHeader, 
  GeneralAlert, 
  CourseFormModal, 
  OfferingFormModal, 
  DeleteModal, 
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
      
      courses: [],

      loading: !true, // should be true at the begginning
      sortDown: localStorage.getItem('sortDown') === 'up' ? false : true,
      // courses
      currCourse: instructor.courses.length > 0 ? instructor.courses[0] : null,
      newCourse: false,
      editCourse: false,
      courseInfo: {
        num: '',
        name: '',
        depart: '',
        uni: 'UIUC',
        description: ''
      },
      deleteCourse: false,
      // offerings
      newOffering: false,
      offeringInfo: {
        term: '',
        sec: '',
        copy: '',
      },
      // alerts
      showAlert: false,
      alertType: 'default', 
      // values: []
    }
  }

  getCourseOfferingsByInstructorId = id => {
    api.getCourseOfferingsByInstructorId(id)
      .then(response => {
        console.log(response.data)
        this.setState({courses: response.data})
      })
  }

  componentDidMount() {
    user.setUpUser(this.getCourseOfferingsByInstructorId);
  }

  isSelectInput = item => 
      item === 'depart' || item === 'term' || item === 'copy';
  /**
   * @param info
   * - 'courseInfo'   : num, name, depart, uni, description
   * - 'offeringInfo' : term, sec, copy
   */
  onInputChange = (event, info, item) => {
    const newInfo = this.state[info];
    newInfo[item] = (this.isSelectInput(item)) ? event.value : event.target.value;    
    this.setState({[info]: newInfo});
  }

  /**
   * @param info 'courseInfo', 'offeringInfo'
   */
  onSave = info => { // need to modify for delete and edit course
    console.log(this.state[info])
    if (info === 'courseInfo') {
      this.onCloseOrOpen(this.state.newCourse ? info : 'edit')
    }
    else this.onCloseOrOpen(info);

    if (info === 'delete') this.setAlert('deleted')
    else this.setAlert('saved'); //'danger'
    if (!this.state.showAlert) {
      this.onCloseOrOpen('alert');
      setTimeout(()=>{
        if (this.state.showAlert) return this.onCloseOrOpen('alert');
      }, 3000);
    };
  }

  /**
   * @param info 
   * - 'edit', 'alert', 'delete'
   * - 'courseInfo'
   * - 'offeringInfo', 'editPlaylist', 'deletePlaylist'
   */
  onCloseOrOpen = info => { 
    if      (info === 'courseInfo'  ) this.setState({newCourse: !this.state.newCourse})
    else if (info === 'edit'        ) this.setState({editCourse: !this.state.editCourse})
    else if (info === 'delete'      ) this.setState({deleteCourse: !this.state.deleteCourse})
    else if (info === 'offeringInfo') this.setState({newOffering: !this.state.newOffering})
    else if (info === 'alert'       ) this.setState({showAlert: !this.state.showAlert})
  }

  setCurrCourse = data => {
    this.setState({currCourse: instructor.courses[data.activeIndex]})
  }

  /** 
   * @param opt saved, deleted
   */
  setAlert = opt => {
    this.setState({alertType: opt})
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
    const {showAlert, alertType} = this.state;
    const {currCourse, deleteCourse, newCourse, editCourse } = this.state;
    return (      
      <div className="ip-bg">
{/* Modals */}
        <CourseFormModal 
          course={newCourse ? '' : currCourse}
          info={newCourse ? 'courseInfo' : 'edit'}
          open={newCourse || editCourse}
          onClose={this.onCloseOrOpen}
          onSave={this.onSave}
          onChange={this.onInputChange}
        />
        <DeleteModal 
          target={`course ${ currCourse ? currCourse.num : null}`}
          open={deleteCourse}
          onSave={()=>this.onSave('delete')}
          onClose={()=>this.onCloseOrOpen('delete')}
        />
        <OfferingFormModal
          course={currCourse}
          open={this.state.newOffering}
          onClose={this.onCloseOrOpen}
          onSave={this.onSave}
          onChange={this.onInputChange}
        />
{/* Layouts */}
        <SignOutHeader onSignOut={this.onSignOut} user={{name: user.firstName()}}/>
        <div className="ip-container">
          <Profile instructor={{name: user.fullName()}}/>
          <GeneralAlert 
            open={showAlert} width={97}
            type={alertType}
            onClose={()=>this.onCloseOrOpen('alert')}
          />
          <Courses 
            {...this}
            instructor={instructor}
            newCourse={()=>this.onCloseOrOpen('courseInfo')}
            editCourse={()=>this.onCloseOrOpen('edit')}
            deleteCourse={()=>this.onCloseOrOpen('delete')}
            newOffering={()=>this.onCloseOrOpen('offeringInfo')}
          />
        </div>
        <FixedFooter />
      </div>
    )
  }
}
