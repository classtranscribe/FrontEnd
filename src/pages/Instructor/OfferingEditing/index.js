/**
 * Offering Editing Page
 * - used for creating a offering or editing the info of a offering
 */

import React from 'react'
// Layouts
import { GeneralModal } from '../../../components'
import OfferingForm from './OfferingForms'
import { SaveButtons, EditButtons } from './Buttons'
import './index.css'
// Vars
import { api, handleData, util } from '../../../util'
const initialOffering = api.initialData.initialOffering

export default class OfferingSettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      type: this.props.match.params.type,
      isNew: this.props.match.params.type === 'new',

      loading: this.props.match.params.type !== 'new',
      progress: 'Courses', // Courses, Staffs, TermSecType

      // choose courses
      currUni: null,
      currDepart: null,
      departments: [],
      courses: [],

      // choose a term
      terms: [],

      // add multiple course staffs
      staffs: [],
      staffMailId: '',
      selectedCourses: [],

      // offering info
      offering: handleData.copy(initialOffering),
      offeringInfo: handleData.copy(initialOffering),

      confirmed: false,
    }
    this.path = 'Offerings'
  }

  /**
   * First loading for preparing the page
   */
  componentDidMount() {
    /**
     * Get existing departments and terms for selection
     * @TODO get by univeristy
     */
    api.getAll(['Departments', 'Terms'], 
      (responce, name) => {
        this.setState({[name]: responce.data})
      })

    /**
     * Get data for editing a offering
     */
    const { isNew, id, offeringInfo } = this.state
    if (!isNew) {
      /**
       * Get CourseOffering by offeringId
       */
      api.getData('Offerings', id)
        .then (({data}) => {
          console.log(data)
          // set default offeringInfo
          offeringInfo.offering = {
            ...data.offering,
            accessType: api.offeringAccessType[data.offering.accessType].id
          }
          console.log(offeringInfo)
          // set others
          this.setState({
            offering: data, 
            staffs: data.instructorIds,
            offeringInfo,
            loading: false
          })
          /**
           * get selectedCourses with full courseNumber based CourseOffering.courseIds
           */
          data.courses.forEach( course => {
            api.getData('Departments', course.departmentId)
              .then( ({data}) => {
                course.fullCourseNumber = data.acronym + course.courseNumber
                this.setState(state => ({
                  selectedCourses: [...state.selectedCourses, course]
                }))
              })
          })
        })
    }
  }

  /**
   * Set current progress
   */
  toProgress = progress => {
    this.setState({ progress })
  }

  /**
   * Functions for add course staffs
   */
  onEnterStaffMailId = event => {
    if (event.target.value.includes(' ')) return;
    this.setState({staffMailId: event.target.value})
  }
  addStaff = event => {
    if (event.keyCode === 32 || event.keyCode === 13) { 
      const {id, isNew, staffMailId} = this.state
      if (handleData.isValidEmail(staffMailId)) {
        const email = staffMailId
        this.setState( state => ({
          staffs: [...state.staffs, email], staffMailId: ''
        }))
        if (!isNew) {
          api.postOfferingAddInstructors(id, [email])
            .then(() => console.log('Successfully add new instructor!'))
        }
      } 
    } 
  }
  removeStaff = staff =>  {
    var { staffs, isNew, id } = this.state
    handleData.remove(staffs, obj => obj === staff)
    this.setState({ staffs })
    if (!isNew) {
      api.deleteUserFromOffering(id, staff)
       .then(() => console.log('Successfully removed the user'))
    }
  }

  /**
   * Functions for add courses
   */
  addCourse = course => {
    const { selectedCourses, isNew, id } = this.state
    selectedCourses.push(course)
    this.setState({ selectedCourses })
    if (!isNew) {
      api.postToCourseOfferings({
        courseId: course.id,
        offeringId: id
      })
        .then( () => console.log('PUT course success!'))
    }
  }
  removeCourse = courseId => {
    var { selectedCourses, isNew } = this.state
    handleData.remove(selectedCourses, {id: courseId})
    this.setState({ selectedCourses })
    // if (!isNew) {
    //   api.deleteFromCourseOfferings(courseId)
    //    .then( () => console.log('DELETE course success!'))
    // }
  }

  /**
   * Helper Function for setting selecting options for courses based on current department
   */
  getCoursesByDepartId = id => {
    api.getCoursesByDepartId(id)
      .then(response => {
        this.setState({courses: response.data})
      })
  }

  /**
   * Function for handling input changes
   */
  onChange = (value, key) => {
    const newData = this.state.offeringInfo
    // set current department
    if (key === 'currDepart') {
      api.getData('Departments', value)
        .then(response => {
          this.setState({
            currDepart: response.data, 
          })
        })
      this.getCoursesByDepartId(value)
    } 
    // keys of offering 
    else if (handleData.includes(['termId', 'accessType', 'sectionName'], key)) {
      newData.offering[key] = value
    } 
    // set current course
    else if (key === 'courseId') {
      const { courses, currDepart } = this.state
      const course = handleData.findById(courses, value)
      course.fullCourseNumber = currDepart.acronym + course.courseNumber
      this.addCourse(course)
    } 
    else {
      newData[key] = value
    }
    this.setState({offeringInfo: newData})
    // console.log(newData)
  }

  /**
   * Function called when saving a new offering
   */
  onCreate = () => {
    const { offeringInfo, id, selectedCourses, staffs } = this.state
    // complete offeringInfo
    offeringInfo.instructorId = id
    offeringInfo.courseId = selectedCourses[0].id
    

    // POST to Offerings
    api.postData(this.path, offeringInfo, ({data}) => {
      // console.log(data)
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

      // Go back
      this.onClose()
    })
    .catch( error => console.log(error))
    
    console.log(offeringInfo)
  }

  /**
   * Function called when save changes of a offering
   */
  onUpdate = () => {
    const { offeringInfo, offering } = this.state
    const newOffering = offeringInfo.offering
    console.log(newOffering)
    // PUT to Offerings/id if if the offering info changes 
    if (!handleData.isEqual(newOffering, offering.offering)) {
      api.updateData('Offerings', newOffering)
        .then( ({data}) => {
          // console.log(data)
          this.onClose()
        })
    }
  }

  /**
   * Function called for deleting the offering
   */
  onDelete = () => {
    api.deleteData(this.path, this.state.id, () => util.toInstructorPage())
  }

  /**
   * Go Back
   */
  onClose = () => {
    if (this.state.isNew) util.toInstructorPage()
    else util.toOfferingPage(this.state.id)
  }

  onConfirm = () => this.setState({confirmed: true})

  render() {
    const { isNew } = this.state
    const header = isNew ? 'New Offering' : 'Offering Setting'
    const button = isNew ? <SaveButtons {...this}/>
                         : <EditButtons {...this} />
    return(
      <GeneralModal 
        size="large"
        header={header}
        open={true} 
        onClose={this.onClose}
        button={button}
      >
        <OfferingForm {...this}/>
      </GeneralModal>
    )
  }
}

