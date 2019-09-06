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
    this.isNew = this.props.match.params.type === 'new'
    this.id = this.props.match.params.id
    this.state = {
      id: this.props.match.params.id,
      type: this.props.match.params.type,
      isNew: this.props.match.params.type === 'new',

      showDeleteModal: false,
      loading: this.props.match.params.type !== 'new',
      progress: 'Courses', // Courses, Staffs, TermSecType

      // choose courses
      departments: [],
      currDepart: null,
      courses: [],

      // choose a term
      terms: [],

      // add multiple course staffs
      staffMailId: '',
      staffs: [],
      newAddedStaffs: [],
      newRemovedStaffs: [],

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

  setUpOffering = async () => {
    /** GET terms and departments based on user's university */
    const { universityId } = user.getUserInfo()
    var _departs = [], _terms = []
    await api.getTermsByUniId(universityId).then(({data}) => {
      this.setState({ terms: data.slice().reverse() })
      _terms = data
    })
    await api.getDepartsByUniId(universityId).then(({data}) => {
      this.setState({ departments: data })
      _departs = data
    })

    /** GET offering info */
    if ( !this.isNew ) {
      api.getOfferingById(this.id)
        .then(({data}) => {
          console.log('offering', data)
          // const term = handleData.findById(_terms, data.offering.termId)
          // if (term !== 'NOT FOUND') data.offering.termName = term.name
          /** Setup selectedCourses */
          data.courses.forEach( (course, index) => {
            const dep = handleData.findById(_departs, course.departmentId)
            if (dep !== 'NOT FOUND') data.courses[index].acronym = dep.acronym
          })
          this.setState({ offering: data, selectedCourses: data.courses })
          /** Setup Staffs */
          const staffs = []
          data.instructorIds.forEach( instructor => {
            staffs.push(instructor.email)
          })
          this.setState({ staffs, loading: false })
        })
    }
  }

  /**
   * First loading for preparing the page
   */
  componentDidMount() {
    this.setUpOffering()
  }

  toProgress = progress => {
    this.setState({ progress })
  }

  showDeleteModal = () => {
    this.setState({showDeleteModal: !this.state.showDeleteModal})
  }

  /**
   * Helper Function for setting selecting options for courses based on current department
   */
  getCoursesByDepartId = (id, acronym) => {
    api.getCoursesByDepartId(id)
      .then(({data}) => {
        data.forEach(course => course.acronym = acronym)
        this.setState({ courses: data })
      })
  }

  onDepartSelected = departId => {
    const currDepart = handleData.findById(this.state.departments, departId)
    this.setState({ currDepart })
    this.getCoursesByDepartId(departId, currDepart.acronym)
  }

  /**
   * Functions for add courses
   */
  addCourse = courseId => {
    const { selectedCourses, newSelectedCourses, courses } = this.state
    const course = handleData.findById(courses, courseId)
    if ( handleData.findById(selectedCourses, course.id) !== 'NOT FOUND' ) return;
    selectedCourses.push(course)
    console.log('course', course)
    this.setState({ selectedCourses })
    if ( !this.isNew ) {
      newSelectedCourses.push(course)
      this.setState({ newSelectedCourses })
    }
  }
  removeCourse = courseId => {
    var { selectedCourses, newRemovedCourses } = this.state
    handleData.remove(selectedCourses, {id: courseId})
    this.setState({ selectedCourses })
    if (!this.isNew) {
      newRemovedCourses.push(courseId)
      this.setState({ newRemovedCourses })
    }
  }

  /**
   * Function for handling input changes
   */
  onChange = (value, key) => {
    const { offering } = this.state
    offering.offering[key] = value
    this.setState({ offering })
  }

  /**
   * Functions for add course staffs
   */
  onEnterStaffMailId = ({target: {value}}) => {
    if ( value.includes(' ') ) return;
    this.setState({staffMailId: value})
  }
  addStaff = event => {
    if ( event.keyCode === 32 || event.keyCode === 13 ) { 
      const { staffMailId, staffs, newAddedStaffs } = this.state
      if ( !handleData.isValidEmail(staffMailId) ) return;
      const email = staffMailId
      if ( handleData.includes(staffs, email) ) return;
      staffs.push(email)
      this.setState({ staffs, staffMailId: '' })
      if ( !this.isNew ) {
        newAddedStaffs.push(email)
        this.setState({ newAddedStaffs })
      }
    } 
  }
  removeStaff = email =>  {
    const { staffs, newRemovedStaffs } = this.state
    handleData.remove(staffs, staff => staff === email)
    this.setState({ staffs })
    if ( !this.isNew ) {
      newRemovedStaffs.push(email)
      this.setState({ newRemovedStaffs })
    }
  }

  /**
   * Function called when saving a new offering
   */
  onCreate = async handleError => {
    this.setState({ loading: true })
    const { offering, selectedCourses, staffs } = this.state
    // complete offering
    offering.instructorId = this.id
    offering.courseId = selectedCourses[0].id
    
    // POST to Offerings
    var offeringId = ''
    await api.createOffering(offering)
            .then(({data}) => offeringId = data.id)
            .catch(() => handleError({
                header: "Couldn't Create the Offering",
                text: "Please try to re-submit again.",
                type: "danger",
                position: "top",
                contactUs: true,
              }, -1))
    if (!offeringId) {
      this.setState({ loading: false })
      return;
    }
    // POST to courseOfferings
    for (let i = 0; i < selectedCourses.length; i++) {
      if (i > 0) await api.createCourseOffering({ courseId: selectedCourses[i].id, offeringId })
    }

    // POST to Offerings/AddUsers
    await api.addCourseStaffToOffering(offeringId, staffs)

    // Go back
    this.onClose(offeringId)
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
    api.deleteOffering(this.id).then(() => window.location = util.links.instructor())
  }

  /**
   * Go Back
   */
  onClose = offeringId => {
    window.location = util.links.offering(offeringId || this.id)
  }

  onCancel = () => {
    this.props.history.goBack()
  }

  onConfirm = () => this.setState({confirmed: true})

  render() {
    const { showDeleteModal } = this.state
    const header = this.isNew ? 'New Offering' : 'Offering Setting'
    const button = this.isNew ? <SaveButtons {...this}/>
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

