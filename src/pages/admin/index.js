import React from 'react'
// UI
import { Tab } from 'semantic-ui-react'
import { SignOutHeader } from '../../components'
import TermPane from './terms'
import UniPane from './universities'
import DepartPane from './departments'
import CoursePane from './courses'
import './index.css'
// Vars
import { api, handleData, util, user } from '../../util'

export class AdminPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activePane: parseInt(localStorage.getItem('activePane')) || 0,
      loading: true,
    
      universities: [],
      uniLoading: true,

      terms: [],
      termLoading: false,
      termCurrUni: null,

      departments: [],
      departLoading: false,
      departCurrUni: null,

      courses: [],
      courseLoading: false,
      courseCurrUni: null,
      courseCurrDeparts: [],
      courseCurrDepart: null,
    }
    this.getSelectOptions = util.getSelectOptions;
  }

  componentDidMount() {
    // get userId and authToken
    user.setUpUser();
    // first load of data
    this.getAll();
    /**
     * Used for jumping back from edit page
     * load data from last selected options after jump back from editing page.
     */
    [
      ['terms', 'termCurrUni', this.getTermsByUniId], 
      ['departments', 'departCurrUni', this.getDepartsByUniId], 
      ['courseCurrDeparts','courseCurrUni', this.getDepartsByUniId]
    ].forEach( key => {
      var uniId = localStorage.getItem(key[1]);
      var callBack = key[2];
      if (uniId) {
        // get University by id in localStorage
        api.getData('Universities', uniId)
          .then(response => {
            this.setState({[key[1]]: response.data})
            // get terms or departs based on loaded univeristy data
            callBack(uniId, key[0])
            // To load courses. first load courseCurrDepart 
            if (key[1].includes('course')) {
              var departId = localStorage.getItem('courseCurrDepart');
              if (departId) {
                // load courseCurrDepart by id
                api.getData('Departments', departId)
                  .then(response => {
                    this.setState({courseCurrDepart: response.data})
                    // load courses based on this department
                    this.getCoursesByDepartId(departId)
                  })
              };
            }
          })
      }
    })
  }

  componentWillMount() {
    // localStorage.removeItem('activePane');
  }

  /**
   * on admin sign out, clear all the localStorages
   */
  onSignOut = () => {
    [
      'activePane', 'termCurrUni', 
      'departCurrUni', 'courseCurrUni', 
      'courseCurrDepart'
    ].forEach( key => {
      localStorage.removeItem(key);
    })
    user.signout();
    this.props.history.goBack();
  }

  /**
   * determine whether to show the loader while loading the data
   */
  setLoading = (name, value) => {
    this.setState({[`${name}Loading`]: value})
  }

  /**
   * GET function for every refreshing
   */
  getAll() {
    this.setLoading('uni', true)
    api.getAll(['Universities'], this.getDataCallBack);
    // loading data based on existing current values
    const { courseCurrDepart, courseCurrUni, termCurrUni } = this.state;
    if (termCurrUni) this.getTermsByUniId(termCurrUni.id);
    if (courseCurrUni) this.getDepartsByUniId(courseCurrUni.id, 'courseCurrDeparts');
    if (courseCurrDepart) this.getCoursesByDepartId(courseCurrDepart.id);
  }
  // helper function for getAll
  getDataCallBack = (response, name) => {
    this.setState({[name]: response.data, uniLoading: false})
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
   */
  setCurrent = (name, data) => { 
    const value = data.value;
    // set **CurrUni store in localStorage, then get terms/departs cased on this uni id
    if (name.includes('Uni')) { 
      this.setState({[name]: handleData.findById(this.state.universities, value)})
      if (name.includes('term')) { // termCurrUni
        localStorage.setItem('termCurrUni', value)
        this.getTermsByUniId(value) 
      } else if (name.includes('depart')) { // departCurrUni
        localStorage.setItem('departCurrUni', value)
        this.getDepartsByUniId(value, 'departments');
      } else if (name.includes('course')) { // courseCurrUni
        localStorage.setItem('courseCurrUni', value)
        localStorage.setItem('courseCurrDepart', null)
        this.setState({courseCurrDepart: null, courses: []})
        this.getDepartsByUniId(value, 'courseCurrDeparts');
      }
    } else if (name.includes('Depart')) { // set courseCurrDepart, then get its courses
      this.setState({[name]: handleData.findById(this.state.courseCurrDeparts, value)})
      this.getCoursesByDepartId(value);
      localStorage.setItem('courseCurrDepart', value)
    } 
  } 

  /**
   * Specific get-by-id functions
   */
  getTermsByUniId = (uniId) => {
    this.setLoading('term', true)
    api.getTermsByUniId(uniId) 
      .then(response => {
        this.setState({terms: response.data})
        this.setLoading('term', false)
      })
  }
  getDepartsByUniId = (uniId, name) => {
    this.setLoading('depart', true)
    api.getDepartsByUniId(uniId) 
      .then(response => {
        this.setState({[name]: response.data})
        this.setLoading('depart', false)
      })
  }
  getCoursesByDepartId = (departId) => {
    this.setLoading('course', true)
    api.getCoursesByDepartId(departId) 
      .then(response => {
        this.setState({courses: response.data})
        this.setLoading('course', false)
      })
  }

  render() {
    const panes = [
      { menuItem: 'Universities'  , render: () => <UniPane {...this} /> },
      { menuItem: 'Terms'         , render: () => <TermPane {...this} /> },
      { menuItem: 'Departments'   , render: () => <DepartPane {...this} /> },
      { menuItem: 'Courses'       , render: () => <CoursePane {...this} /> }
    ]
    return (
      <div>
        <SignOutHeader user={{name: user.firstName()}} onSignOut={this.onSignOut}/>
        <div className="admin-bg">
          <Tab 
            menuPosition="left"
            className="ap-tab"
            activeIndex={this.state.activePane}
            menu={{ borderless: true, attached: false, tabular: false, fluid: true, vertical: (window.innerWidth > 520) }} 
            panes={panes}
            onTabChange={(event, data) => this.setActivePane(data.activeIndex)}
          />
        </div>
      </div>
    )
  }
}

