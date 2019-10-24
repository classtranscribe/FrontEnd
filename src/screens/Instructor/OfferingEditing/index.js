/**
 * Offering Editing Page
 * - used for creating a offering or editing the info of a offering
 */

import React from 'react'
// import $ from 'jquery'
// Layouts
import { GeneralModal, DeleteModal, CTContext } from 'components'
import OfferingForm from './OfferingForms'
import { SaveButtons, EditButtons } from './Buttons'
import './index.css'
// Vars
import { api, handleData, util, user } from 'utils'

export default class OfferingSettingPage extends React.Component {
  constructor(props) {
    super(props)
    this.isNew = this.props.match.params.type === 'new'
    this.id = this.props.match.params.id
    util.links.title( this.isNew ? 'New Offering' : 'Edit Offering')
    this.state = {
      showDeleteModal: false,
      loading: !this.isNew,

      // offering info
      offering: handleData.copy(api.initialData.initialOffering),

      // choose courses
      departments: [],
      currDepart: null,
      courses: [],

      selectedCourses: [],
      newSelectedCourses: [],
      newRemovedCourses: [],

      // term
      terms: [],

      // course staffs
      staffMailId: '',
      staffs: [],
      staffs_ids: [],
      newAddedStaffs: [],
      newRemovedStaffs: [],
      staffEmailExists: false,

      // students
      students: [],

      confirmed: false,
    }
    this.path = 'Offerings'
  }

  setUpOffering = async () => {
    /** GET terms and departments based on user's university */
    const { universityId } = user.getUserInfo()
    // get terms
    await api.getTermsByUniId(universityId)
            .then(({data}) => {
              this.setState({ terms: data.slice().reverse() })
            })
            .catch( error => {
              const { generalError } = this.context
              generalError({ header: "Couldn't load the terms." })
              this.setState({ loading: true })
            })
    // get departments
    var _departs = []
    await api.getDepartsByUniId(universityId)
            .then(({data}) => {
              this.setState({ departments: data })
              _departs = data
            })
            .catch( error => {
              const { generalError } = this.context
              generalError({ header: "Couldn't load the departments." })
              this.setState({ loading: true })
            })

    /** GET offering info */
    if ( !this.isNew ) {
      api.getOfferingById(this.id)
        .then(({data}) => {
          console.log('offering', data)
          /** Setup selectedCourses */
          data.courses.forEach( (course, index) => {
            const dep = handleData.findById(_departs, course.departmentId)
            if (dep !== 'NOT FOUND') {
              data.courses[index].acronym = dep.acronym
            }
          })

          /** Setup Staffs */
          const staffs = []
          data.instructorIds.forEach( instructor => {
            staffs.push(instructor.email)
          })

          this.setState({ 
            offering: data, 
            selectedCourses: data.courses, 
            staffs, 
            loading: false 
          })

          api.contentLoaded()
        })
        .catch( error => {
          const { generalError } = this.context
          generalError({ header: "Couldn't load the offering." })
        })
    }
  }

  /**
   * First loading for preparing the page
   */
  componentDidMount() {
    // $('.dimmer').addClass('solid-dimmer')
    this.setUpOffering()
  }

  showDeleteModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal })
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
      .catch( error => {
        const { generalError } = this.context
        generalError({ text: `Couldn't load the courses of the department ${acronym}.` })
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
    const { selectedCourses, newSelectedCourses, newRemovedCourses, courses } = this.state

    const course = handleData.findById(courses, courseId)
    if ( handleData.findById(selectedCourses, course.id) !== 'NOT FOUND' ) return;
    // console.log('course', course)
    selectedCourses.push(course)
    this.setState({ selectedCourses })

    if ( !this.isNew ) {
      if (newRemovedCourses.includes(courseId)) {
        handleData.remove(newRemovedCourses, id => id === courseId)
      } else {
        newSelectedCourses.push(course)
        this.setState({ newSelectedCourses })
      }
    }
  }
  removeCourse = courseId => {
    var { selectedCourses, newRemovedCourses, newSelectedCourses } = this.state

    handleData.remove(selectedCourses, {id: courseId})
    this.setState({ selectedCourses })

    if (!this.isNew) {
      if (handleData.findById(newSelectedCourses, courseId) !== 'NOT FOUND') {
        handleData.remove(newSelectedCourses, {id: courseId})
      } else {
        newRemovedCourses.push(courseId)
        this.setState({ newRemovedCourses })
      }
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
    this.setState({ staffMailId: value })
  }

  addStaff = value => {
    const isUpload = typeof value === "string"
    const { staffMailId, staffs, newAddedStaffs, newRemovedStaffs } = this.state
    const email = isUpload ? value : staffMailId
    if ( !handleData.isValidEmail(email) ) return;
    if ( handleData.includes(staffs, email) ) {
      if (!isUpload) this.setState({ staffEmailExists: true })
      return;
    }
    staffs.push(email)
    this.setState({ staffs, staffMailId: '', staffEmailExists: false })
    if ( !this.isNew ) {
      if (newRemovedStaffs.includes(email)) {
        handleData.remove(newRemovedStaffs, staff => staff === email)
      } else {
        newAddedStaffs.push(email)
        this.setState({ newAddedStaffs })
      }
    }
  }

  removeStaff = email =>  {
    const { staffs, newRemovedStaffs, newAddedStaffs } = this.state
    handleData.remove(staffs, staff => staff === email)
    this.setState({ staffs })
    if ( !this.isNew ) {
      if (newAddedStaffs.includes(email)) {
        handleData.remove(newAddedStaffs, staff => staff === email)
      } else {
        newRemovedStaffs.push(email)
        this.setState({ newRemovedStaffs })
      }
    }
  }

  /**
   * Functions for add students
   */
  addStudent = email => {
    const { students } = this.state
    if ( !handleData.isValidEmail(email) || students.includes(email)) return;
    students.push(email)
    this.setState([students])
  }

  removeStudent = email => {
    const { students } = this.state
    handleData.remove(students, staff => staff === email)
    this.setState({ students })
  }

  /**
   * Function called when saving a new offering
   */
  onCreate = async () => {
    const { generalError } = this.context
    this.setState({ loading: true })
    const { offering, selectedCourses, staffs } = this.state
    // complete offering
    offering.instructorId = this.id
    offering.courseId = selectedCourses[0].id
    
    // POST to Offerings
    var offeringId = ''
    await api.createOffering(offering)
            .then(({data}) => offeringId = data.id)
            .catch( error => {
              generalError({ 
                refresh: false,
                header: "Couldn't create the offering",
                text: "Please try to re-submit again.", 
              })
            })

    if (!offeringId) {
      this.setState({ loading: false })
      return;
    }

    // POST to courseOfferings
    try {
      for (let i = 0; i < selectedCourses.length; i++) {
        if (i > 0) await api.createCourseOffering({ courseId: selectedCourses[i].id, offeringId })
      }
    } catch {
      console.error("couldn't add offering to course.")
    }
    // POST to Offerings/AddUsers
    try {
      await api.addCourseStaffToOffering(offeringId, staffs)
    } catch (error) {
      generalError({ 
        span: 1000,
        refresh: false,
        text: "Couldn't add course staffs.", 
      })
    }

    // Go back
    this.onClose(offeringId)
  }

  /**
   * Function called when save changes of a offering
   */
  onUpdate = async () => {
    const { generalError } = this.context
    this.setState({ loading: true })
    const { offering, newRemovedCourses, newSelectedCourses, newAddedStaffs, newRemovedStaffs } = this.state
    // console.log('offering', offering.offering)
    // console.log('newRemovedCourses', newRemovedCourses)
    // console.log('newSelectedCourses', newSelectedCourses)
    // console.log('newAddedStaffs', newAddedStaffs)
    // console.log('newRemovedStaffs', newRemovedStaffs)

    // PUT to offerings
    let noError = true
    await api.updateOffering(offering.offering)
          .catch( error => {
            noError = false
            generalError({ 
              refresh: false,
              header: "Couldn't save changes.",
              text: "Please try to re-submit again.", 
            })
          })
    // delete removed courses
    if (!noError) return;
    try {
      for (let i = 0; i < newRemovedCourses.length; i++) {
        await api.deleteCourseOffering(newRemovedCourses[i], this.id)
      }
    } catch (error) {
      generalError({ 
        span: 4000,
        refresh: false,
        text: `Couldn't remove the course(s) from the offering.`, 
      })
    }
    // add new courses
    try {
      for (let i = 0; i < newSelectedCourses.length; i++) {
        await api.createCourseOffering({ courseId: newSelectedCourses[i].id, offeringId: this.id })
      }
    } catch (error) {
      generalError({ 
        span: 4000,
        refresh: false,
        text: "Couldn't add new courses to the offering.", 
      })
    }
    // delete removed staffs
    try {
      for (let i = 0; i < newRemovedStaffs.length; i++) {
        const staff_ = handleData.find(offering.instructorIds, {email: newRemovedStaffs[i]})
        if (staff_) await api.deleteCourseStaffFromOffering(this.id, staff_.id)
      }
    } catch (error) {
      generalError({ 
        span: 1000,
        refresh: false,
        text: "Couldn't remove the course staffs.", 
      })
    }
    // add new staffs
    try {
      await api.addCourseStaffToOffering(this.id, newAddedStaffs)
    } catch (error) {
      generalError({ 
        span: 1000,
        refresh: false,
        text: "Couldn't add new course staffs.", 
      })
    }

    if (noError) this.onClose(this.id)
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
    // $('.dimmer').removeClass('solid-dimmer')
    window.location = util.links.offering(offeringId || this.id)
  }

  onCancel = () => {
    this.props.history.goBack()
  }

  onConfirm = () => this.setState({confirmed: true})

  render() {
    const { showDeleteModal } = this.state
    const header = this.isNew ? 'New Offering' : 'Offering Setting'
    const button = this.isNew ? <SaveButtons {...this}/> : <EditButtons {...this} />

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
        <OfferingForm {...this} />
      </GeneralModal>
    )
  }
}

OfferingSettingPage.contextType = CTContext