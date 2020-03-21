/**
 * Home sub-screen for Offering Viewing screen
 */

import React from 'react'
// UI
import Filter from  './Filter'
import { ClassTranscribeFooter, MaintenanceMessage, CTContext } from '../../../../components'
import SectionList from './SectionList'
import './index.css'
// Vars
import { api, user, handleData, util } from '../../../../utils'

export class Home extends React.Component {
  constructor(props) {
    super(props)
    util.links.title()
    this.state = {
      universities: [],
      terms: [],
      departments: ['unloaded'],

      uniSelected: '',
      departSelected: [],
      termSelected: [],
    }
  }

  componentDidMount() {
    /**
     * Get all universities
     */
    api.getUniversities()
      .then(({data}) => {
        this.setState({ universities: data.filter(uni => uni.id !== '0000') })
        api.contentLoaded()
      })
      .catch( error => {
        const { generalError } = this.context
        api.contentLoaded()
        generalError({ header: "Couldn't load universities." })
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
      api.getDepartments().then(({data}) => {
        data.forEach(depart => {
          const uni = handleData.findById(this.state.universities, depart.universityId)
          if (uni) depart.uniName = uni.name
        })
        this.setState({ departments: data })
      })
    } else {
      this.getDepartmentsByUniId(value)
      this.getTermsByUniId(value)
    }
    this.setState({ terms: [], departments: ['unloaded'], uniSelected: value })
  }

  onDepartSelected = (e, {value}) => {
    this.setState({ departSelected: value })
  }

  onTermSelected = (e, {value}) => {
    this.setState({ termSelected: value })
  }

  render() {
    const { starOffering, unstarOffering, state } = this.props
    const { displaySearchHeader, starredOfferings, offerings, watchHistory, onboarded } = state

    return (
      <div className="sp-home ct-a-fade-in">
        <div id="home-content">
          <h1 className="accessbility_hide">ClassTranscribe Home - Courses</h1>
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

Home.contextType = CTContext