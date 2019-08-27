/**
 * Offering Editing Page
 * - used for creating a offering or editing the info of a offering
 */

import React from 'react'
// Layouts
import { GeneralModal, DeleteModal } from 'components'
import OfferingForm from './OfferingForms'
import { SaveButtons, EditButtons } from './Buttons'
import './index.css'
// Vars
import { api, handleData, util, user } from 'utils'
const initialOffering = api.initialData.initialOffering

export default class OfferingSettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      type: this.props.match.params.type,
      isNew: this.props.match.params.type === 'new',

      showDeleteModal: false,
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
      newSelectedCourses: [],
      newRemovedCourses: [],

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
     * Get departments and terms
     */
    const { universityId } = user.getUserInfo()
    api.getTermsByUniId(universityId).then(({data}) => this.setState({ terms: data }))
    api.getDepartsByUniId(universityId).then(({data}) => this.setState({ departments: data }))

    /**
     * Get data for editing a offering
     */
    const { isNew, id, offeringInfo } = this.state
    if ( !isNew ) {
      /**
       * Get CourseOffering by offeringId
       */
      api.getOfferingById(id)
        .then ( ({data}) => {
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
            api.getDepartById(course.departmentId)
              .then( ({data}) => {
                course.fullCourseNumber = data.acronym + course.courseNumber
                this.setState( state => ({
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
   * Function to determine the visibility of delete modal
   */
  showDeleteModal = () => {
    this.setState({showDeleteModal: !this.state.showDeleteModal})
  }

  /**
   * Functions for add course staffs
   */

  onEnterStaffMailId = event => {
    if ( event.target.value.includes(' ') ) return;
    this.setState({staffMailId: event.target.value})
  }

  addStaff = event => {
    if ( event.keyCode === 32 || event.keyCode === 13 ) { 
      const { id, isNew, staffMailId, staffs } = this.state
      if ( handleData.isValidEmail(staffMailId) ) {
        const email = staffMailId
        if ( handleData.includes(staffs, email) ) return;
        this.setState({staffs: [...staffs, email], staffMailId: ''})
        if ( !isNew ) {
          api.addCourseStaffToOffering(id, [email])
            .then(() => console.log('Successfully add new instructor!'))
        }
      } 
    } 
  }

  removeStaff = staff =>  {
    var { staffs, isNew, id } = this.state
    handleData.remove(staffs, obj => obj === staff)
    this.setState({ staffs })
    if ( !isNew ) {
      api.deleteCourseStaffFromOffering(id, staff)
       .then(() => console.log('Successfully removed the user'))
    }
  }


  /**
   * Functions for add courses
   */

  addCourse = course => {
    const { selectedCourses, isNew, id, newSelectedCourses } = this.state
    if ( handleData.findById(selectedCourses, course.id) !== 'NOT FOUND' ) return;
    selectedCourses.push(course)
    console.log('course', course)
    this.setState({ selectedCourses })
    if ( !isNew ) {
      newSelectedCourses.push(course)
      this.setState({ newSelectedCourses })
    }
  }

  removeCourse = courseId => {
    var { selectedCourses, isNew, newRemovedCourses } = this.state
    handleData.remove(selectedCourses, {id: courseId})
    this.setState({ selectedCourses })
    if (!isNew) {
      newRemovedCourses.push(courseId)
      this.setState({ newRemovedCourses })
    }
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
    if ( key === 'currDepart' ) {
      const { departments } = this.state
      this.setState({ currDepart: handleData.findById(departments, value) })
      this.getCoursesByDepartId(value)
    } 
    // keys of offering 
    else if ( handleData.includes(['termId', 'accessType', 'sectionName'], key) ) {
      newData.offering[key] = value
    } 
    // set current course
    else if ( key === 'courseId' ) {
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
    api.createOffering(offeringInfo).then(({data}) => {
      // POST to CourseOfferings
      selectedCourses.forEach( (course, index) => {
        if (index) {
          api.createCourseOffering({ courseId: course.id, offeringId: data.id })
            .then( ({data}) => console.log(data))
            .catch( error => console.log(error))
        }
      })

      // POST to Offerings/AddUsers
      api.addCourseStaffToOffering(data.id, staffs)
        .then( ({data}) => console.log(data))
        .catch(error => console.log(error))

      // Go back
      this.onClose(data.id)
    })
    .catch( error => console.log(error))
    
    console.log(offeringInfo)
  }

  /**
   * Function called when save changes of a offering
   */
  onUpdate = () => {
    const { offeringInfo, offering, newRemovedCourses, newSelectedCourses, id } = this.state
    const newOffering = offeringInfo.offering
    newRemovedCourses.forEach( courseId=> {
      api.deleteCourseOffering(courseId, id)
       .then( () => console.log('DELETE course success!'))
    })
    newSelectedCourses.forEach( course => {
      api.createCourseOffering({ courseId: course.id, offeringId: id })
        .then( () => console.log('PUT course success!'))
    })
    console.log(newOffering)
    // PUT to Offerings/id if if the offering info changes 
    if ( !handleData.isEqual(newOffering, offering.offering) ) {
      api.updateOffering(newOffering)
        .then( ({data}) => {
          this.onClose()
        })
    }
  }

  /**
   * Function called for deleting the offering
   */
  onDelete = () => {
    api.deleteOffering(this.state.id).then(() => window.location = util.links.instructor())
  }

  /**
   * Go Back
   */
  onClose = offeringId => {
    window.location = util.links.offering(offeringId || this.state.id)
  }

  onCancel = () => {
    this.props.history.goBack()
  }

  onConfirm = () => this.setState({confirmed: true})

  render() {
    const { isNew, showDeleteModal } = this.state
    const header = isNew ? 'New Offering' : 'Offering Setting'
    const button = isNew ? <SaveButtons {...this}/>
                         : <EditButtons {...this} />
    return(
      <GeneralModal 
        size="large"
        header={header}
        open={true} 
        onClose={this.onCancel}
        button={button}
      >
        <DeleteModal 
          open={showDeleteModal} 
          target="offering" 
          onClose={this.showDeleteModal}
          onSave={this.onDelete}
        />
        <OfferingForm {...this}/>
      </GeneralModal>
    )
  }
}

