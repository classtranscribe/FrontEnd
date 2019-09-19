/**
 * Home sub-screen for Offering Viewing screen
 */

import React, { Suspense, lazy } from 'react'
// UI
import Filter from  './Filter'
import { OfferingListHolder } from './PlaceHolder'
import { ClassTranscribeFooter } from 'components'
import './index.css'
// Vars
import { api, user, handleData, util } from 'utils'
// Lazy loading
const OfferingList = lazy(() => import('./OfferingList'))

export class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      restoredScroll: false,

      universities: [],
      terms: [],
      departments: [],
      offerings: props.offerings,

      uniSelected: '',
      departSelected: [],
      termSelected: [],
    }
  }

  componentDidMount() {
    /**
     * Get all universities
     */
    api.getUniversities().then(({data}) => {
      this.setState({ universities: data.filter(uni => uni.id !== '0000') })
      api.contentLoaded()
    })
    if (user.isLoggedIn()) {
      const userUniId = user.getUserInfo().universityId
      if (userUniId !== "0000") this.onUniSelected(null, {value: userUniId})
      else this.onUniSelected(null, {})
    } else {
      this.onUniSelected(null, {})
    }
    util.fixForAccessbitity('widgets/scripts')
    util.fixForAccessbitity('formSearchDropdown')
  }
  
  componentDidUpdate(prevProps) {
    /**
     * 1. Update offerings after the offering is loaded
     */
    if (this.props.offerings !== prevProps.offerings) {
      this.setState({ offerings: this.props.offerings })
    }
    /**
     * 2. Restore the scroll after
     */
    const { state } = this.props.history.location
    if (state && state.id && !this.state.restoredScroll) {
      const elem = document.getElementById(state.id)
      if (elem) {
        elem.scrollIntoView({ block: "nearest" })
        this.setState({ restoredScroll: true })
      }
    }

  }

  getDepartmentsByUniId = uniId => {
    api.getDepartsByUniId(uniId)
     .then(({data}) => {
        this.setState({ departments: data, departSelected: [] })
     })
  }

  getTermsByUniId = uniId => {
    api.getTermsByUniId(uniId)
      .then(({data}) => {
        this.setState({ terms: data, termSelected: [] })
      })
  }

  onUniSelected = (e, {value}) => {
    if (!value) {
      this.setState({ terms: [], departments: [] })
      api.getDepartments().then(({data}) => {
        data.forEach(depart => {
          const uni = handleData.findById(this.state.universities, depart.universityId)
          if (uni) depart.uniName = uni.name
        })
        this.setState({ departments: data })
      })
    } else {
      this.setState({ terms: [], departments: [] })
      this.getDepartmentsByUniId(value)
      this.getTermsByUniId(value)
    }
    this.setState({ uniSelected: value })
  }

  onDepartSelected = (e, {value}) => {
    this.setState({ departSelected: value })
  }

  onTermSelected = (e, {value}) => {
    this.setState({ termSelected: value })
  }

  render() {
    const { displaySearchHeader } = this.props
    return (
      <div className="sp-home">
        <div id="home-content">
          <Filter displaySearchHeader={displaySearchHeader} {...this} />
          <Suspense fallback={<OfferingListHolder />}>  
            <OfferingList {...this} />
          </Suspense>
          <ClassTranscribeFooter />
        </div>
      </div>
    )
  }
}
