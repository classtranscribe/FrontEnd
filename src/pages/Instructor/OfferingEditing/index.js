/**
 * Offering Editing Page
 * - used for creating a offering or editing the info of a offering
 */

import React from 'react'
// Layouts
import { GeneralModal } from '../../../components'
import OfferingForm from './OfferingForm'
import { SaveButtons, EditButtons } from './Buttons'
import './index.css'
// Vars
import { api, handleData, util } from '../../../util'
const initialOffering = api.initialData.initialOffering;

export default class OfferingSettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      type: this.props.match.params.type,
      isNew: this.props.match.params.type === 'new',
      loading: this.props.match.params.type !== 'new',
      progress: 'Courses', // Courses, Staffs, TermSecType

      departments: [],
      courses: [],
      terms: [],

      staffs: [],
      staffMailId: '',

      selectedCourses: [],

      currUni: null,
      currDepart: null,
      offering: handleData.copy(initialOffering),
      offeringInfo: handleData.copy(initialOffering),

      confirmed: false,
    }
    this.path = 'Offerings'
  }

  componentDidMount() {
    // api.
    api.getAll(['Departments', 'Terms'], 
      (responce, name) => {
        // console.log(responce.data)
        // console.log(name)
        this.setState({[name]: responce.data})
      })
  }

  toProgress = progress => {
    this.setState({ progress })
  }

  addStaff = event => {
    console.log(event.target.value)
  }

  onEnterStaffMailId = event => {
    if (event.target.value.includes(' ')) return;
    this.setState({staffMailId: event.target.value})
  }

  addStaff = event => {
    if (event.keyCode === 32 || event.keyCode === 13) { 
      let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      if (re.test(this.state.staffMailId)) {
        this.setState( state => ({
          staffs: [...state.staffs, state.staffMailId], staffMailId: ''
        }))
      } 
    } 
  }

  removeStaff = staff =>  {
    var { staffs } = this.state
    handleData.remove(staffs, obj => obj === staff)
    this.setState({ staffs })
  }

  addCourse = courseId => {
    const { selectedCourses } = this.state
    selectedCourses.push(courseId)
    this.setState({ selectedCourses })
  }

  removeCourse = courseId => {
    var { selectedCourses } = this.state
    handleData.remove(selectedCourses, {id: courseId})
    this.setState({ selectedCourses })
  }

  getCoursesByDepartId = id => {
    api.getCoursesByDepartId(id)
      .then(response => {
        this.setState({courses: response.data})
      })
  }

  onChange = (value, key) => {
    const newData = this.state.offeringInfo
    if (key === 'currDepart') {
      api.getData('Departments', value)
        .then(response => {
          this.setState({
            currDepart: response.data, 
            offeringInfo: handleData.copy(initialOffering)
          });
        })
      this.getCoursesByDepartId(value)
    } else if (handleData.includes(['termId', 'accessType', 'sectionName'], key)) {
      newData.offering[key] = value
    } else if (key === 'courseId') {
      const { courses, currDepart } = this.state
      const course = handleData.findById(courses, value)
      course.fullCourseNumber = currDepart.acronym + course.courseNumber
      this.addCourse(course)
    } else {
      newData[key] = value
    }
    this.setState({offeringInfo: newData})
    // console.log(newData);
  }

  onCreate = () => {
    const { offeringInfo, isNew, id, selectedCourses, staffs } = this.state
    if (isNew) {
      offeringInfo.instructorId = id
      offeringInfo.courseId = selectedCourses[0].id
    }

    // POST to Offerings
    api.postData(this.path, offeringInfo, ({data}) => {
      console.log(data)
      console.log(selectedCourses)
      // POST to CourseOfferings
      selectedCourses.forEach( (course, index) => {
        if (index) {
          api.postToCourseOfferings({
            courseId: course.id,
            offeringId: data.id
          })
            .then(response => {
              console.log(response.data)
            })
            .catch(error => console.log(error))
        }
      })
      // POST to Offerings/AddUsers
      api.postOfferingAddInstructors(data.id, staffs)
        .then( response => {
          console.log(response.data)
        })
        .catch(error => console.log(error))
      // this.onClose()
    })
    .catch( error => console.log(error))
    
    console.log(offeringInfo)
  }

  onUpdate = () => {
    const { offering, offeringInfo, id } = this.state;
    var data = handleData.updateJson(offeringInfo, offering)
    data.id = id;
    // console.log(data);
    api.updateData(this.path, data, () => this.onClose())
  }

  onConfirm = () => this.setState({confirmed: true})

  onDelete = () => {
    api.deleteData(this.path, this.state.id, () => this.onClose())
  }

  onClose = () => {
    if (this.state.isNew) util.toInstructorPage();
    else util.toOfferingPage(this.state.id)
  }

  onCancel = () => {
    this.props.history.goBack();
  }

  render() {
    const { isNew } = this.state;
    // console.log(id)
    const header = isNew ? 'New Offering' : 'Offering Setting';
    const button = isNew ? <SaveButtons {...this}/>
                         : <EditButtons {...this} />;
    return(
      <GeneralModal 
        size="large"
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <OfferingForm {...this}/>
      </GeneralModal>
    )
  }
}

