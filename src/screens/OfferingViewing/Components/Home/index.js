/**
 * Home sub-screen for Offering Viewing screen
 */

import React from 'react'
// UI
import Filter from  './Filter'
import { ClassTranscribeFooter, MaintenanceMessage } from 'components'
import SectionList from './SectionList'
import './index.css'
// Vars
import { api, user, handleData, util } from 'utils'

export class Home extends React.Component {
  constructor(props) {
    super(props)
    util.links.title()
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
     .catch( () => {
       this.setState({ departments: ['retry']})
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
    const { starOffering, unstarOffering, state } = this.props
    const { displaySearchHeader, starredOfferings, offerings, watchHistory } = state

    return (
      <div className="sp-home">
        <div id="home-content">
          <MaintenanceMessage />
          <Filter 
            {...this} 
            displaySearchHeader={displaySearchHeader} 
          />
          <SectionList 
            {...this} 
            offerings={offerings}
            watchHistory={watchHistory}
            starOffering={starOffering}
            unstarOffering={unstarOffering}
            starredOfferings={starredOfferings}  
          />
          <ClassTranscribeFooter />
        </div>
      </div>
    )
  }
}
