/**
 * Admin Page
 * - where admins can create and make changes on 
 *   universities, departments, terms, and courses
 */

import React from 'react'
// UI
import { Tab } from 'semantic-ui-react'
import './index.css'
// Layouts
import { ClassTranscribeHeader } from '../../components'
import TermPane from './Terms'
import UniPane from './Universities'
import DepartPane from './Departments'
import CoursePane from './Courses'
import InstructorPane from './Instructors'
import More from './More'
// Vars
import { api, handleData, util, user } from '../../utils'
import LoginAsUser from './LoginAsUser'

export class Admin extends React.Component {
  constructor(props) {
    super(props)
    util.links.title('Admin')
    this.state = {
      activePane: parseInt(localStorage.getItem('activePane')) || 0,
      verticalSidebar: window.innerWidth > 700,
      loading: true,
    
      universities: [],

      terms: [],
      termCurrUni: null,

      departments: [],
      departCurrUni: null,

      courses: [],
      courseCurrUni: null,
      courseCurrDeparts: [],
      courseCurrDepart: null,

      instructors: [],
    }
    this.getSelectOptions = util.getSelectOptions
    this.getAll = this.getAll.bind(this)
  }

  /**
   * Function for GET values after every page refreshing
   */
  getAll() {
    api.getUniversities().then( ({data}) => {
      this.setState({ universities: data })
      /**
       * Hide the loading page
       */
      api.contentLoaded()
    })
    // loading data based on existing current values
    const { courseCurrDepart, courseCurrUni, termCurrUni } = this.state
    if (termCurrUni) this.getTermsByUniId(termCurrUni.id)
    if (courseCurrUni) this.getDepartsByUniId(courseCurrUni.id, 'courseCurrDeparts')
    if (courseCurrDepart) this.getCoursesByDepartId(courseCurrDepart.id)
  }

  /**
   * Specific get-by-id functions
   */
  getTermsByUniId = (uniId) => {
    api.getTermsByUniId(uniId) 
      .then(response => {
        this.setState({terms: response.data})
      })
      .catch( error => console.log(error) )
  }
  getDepartsByUniId = (uniId, name) => {
    api.getDepartsByUniId(uniId) 
      .then(response => {
        this.setState({[name]: response.data})
      })
  }
  getCoursesByDepartId = (departId) => {
    api.getCoursesByDepartId(departId) 
      .then(response => {
        this.setState({courses: response.data})
      })
  }

  /**
   * GET all info needed based on an admin
   */
  componentDidMount() {
    /**
     * 1. get userId and authToken
     */
    if (!user.isLoggedIn()) {
      user.signin()
    } else {
      if (!user.isAdmin()) window.location = util.links.notfound404()
    }
    /**
     * 2. first load of values
     */
    this.getAll();
    /**
     * 3. Load data from last selected options after jump back from editing page.
     */
    [
      ['terms', 'termCurrUni', this.getTermsByUniId], 
      ['departments', 'departCurrUni', this.getDepartsByUniId], 
      ['courseCurrDeparts','courseCurrUni', this.getDepartsByUniId]
    ].forEach( key => {
      var uniId = localStorage.getItem(key[1])
      var callBack = key[2]
      if (uniId) {
        // get University by id in localStorage
        api.getUniversityById(uniId)
          .then(response => {
            this.setState({[key[1]]: response.data})
            // get terms or departs based on loaded univeristy data
            callBack(uniId, key[0])
            // To load courses. first load courseCurrDepart 
            if (key[1].includes('course')) {
              var departId = localStorage.getItem('courseCurrDepart')
              if (departId) {
                // load courseCurrDepart by id
                api.getDepartById(departId)
                  .then(response => {
                    this.setState({courseCurrDepart: response.data})
                    // load courses based on this department
                    this.getCoursesByDepartId(departId)
                  })
              }
            }
          })
      }
    })

    window.addEventListener('resize', ()=>{
      if (window.innerWidth < 700 && this.state.verticalSidebar)
        this.setState({ verticalSidebar: false })
      else if (window.innerWidth >= 700 && !this.state.verticalSidebar)
      this.setState({ verticalSidebar: true })
    })
  }

  onSignOut = () => {
    user.signout()
    this.props.history.goBack()
  }

  /**
   * Used for jumping back from edit page
   * Set selected active pane, and store in localStorage
   */
  setActivePane = index => {
    this.setState({activePane: index})
    localStorage.setItem('activePane', `${index}`)
  }

  /**
   * set current selected options and get corresponding data
   * @param name the state name to set
   * @param value the value to assign
   */
  setCurrent = (name, {value}) => { 
    // set **CurrUni store in localStorage, then get terms/departs cased on this uni id
    if (name.includes('Uni')) { 
      this.setState({[name]: handleData.findById(this.state.universities, value)})
      if (name.includes('term')) { // termCurrUni
        localStorage.setItem('termCurrUni', value)
        this.getTermsByUniId(value) 
      } else if (name.includes('depart')) { // departCurrUni
        localStorage.setItem('departCurrUni', value)
        this.getDepartsByUniId(value, 'departments')
      } else if (name.includes('course')) { // courseCurrUni
        localStorage.setItem('courseCurrUni', value)
        // reset the 'courseCurrDepart' after change the 'courseCurrUni'
        localStorage.removeItem('courseCurrDepart') 
        this.setState({courseCurrDepart: null, courses: []})
        this.getDepartsByUniId(value, 'courseCurrDeparts')
      }
    } else if (name.includes('Depart')) { // set courseCurrDepart, then get its courses
      this.setState({[name]: handleData.findById(this.state.courseCurrDeparts, value)})
      this.getCoursesByDepartId(value)
      localStorage.setItem('courseCurrDepart', value)
    } 
  } 

  render() {
    // Tab panes of the contents
    const panes = [
      { menuItem: 'Universities'  , render: () => <UniPane {...this} /> },
      { menuItem: 'Terms'         , render: () => <TermPane {...this} /> },
      { menuItem: 'Departments'   , render: () => <DepartPane {...this} /> },
      { menuItem: 'Courses'       , render: () => <CoursePane {...this} /> },
      { menuItem: 'Instructors'   , render: () => <InstructorPane {...this} />},
      { menuItem: 'More'          , render: () => <More {...this} />},
      { menuItem: 'Login As User' , render: () => <LoginAsUser {...this} />}
    ]

    const { verticalSidebar } = this.state

    return (
      <div>
        <ClassTranscribeHeader subtitle="Admin" />
        <div className="admin-bg">
          <Tab 
            menuPosition="left"
            className="ap-tab"
            activeIndex={this.state.activePane}
            menu={{ borderless: true, attached: false, tabular: false, fluid: true, vertical: verticalSidebar }} 
            panes={panes}
            onTabChange={(event, data) => this.setActivePane(data.activeIndex)}
          />
        </div>
      </div>
    )
  }
}

