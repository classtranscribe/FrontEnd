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
import { api, handleData, util } from '../../util'
const { initialTerm, initialUni, initialDepart, initialCourse } = api.initialData;

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
    this.getAll();
    [
      ['terms', 'termCurrUni', this.getTermsByUniId], 
      ['departments', 'departCurrUni', this.getDepartsByUniId], 
      ['courseCurrDeparts','courseCurrUni', this.getDepartsByUniId]
    ].map( key => {
      var uniId = localStorage.getItem(key[1]);
      var callBack = key[2];
      if (uniId) {
        api.getData('Universities', uniId)
          .then(response => {
            this.setState({[key[1]]: response.data})
            callBack(uniId, key[0])
            if (key[1].includes('course')) {
              var departId = localStorage.getItem('courseCurrDepart');
              if (departId) {
                api.getData('Departments', departId)
                  .then(response => {
                    this.setState({courseCurrDepart: response.data})
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

  setLoading = value => {
    this.setState({loading: value})
  }

  getDataCallBack = (response, name) => {
    this.setState({[name]: response.data})
    // console.log(response.data)
    // this.setLoading(false);
  }
  
  getAll() {
    api.getAll(['Universities'], this.getDataCallBack);

    const { courseCurrDepart, courseCurrUni, termCurrUni } = this.state;
    if (termCurrUni) this.getTermsByUniId(termCurrUni.id);
    if (courseCurrUni) this.getDepartsByUniId(courseCurrUni.id, 'courseCurrDeparts');
    if (courseCurrDepart) this.getCoursesByDepartId(courseCurrDepart.id);
  }

  getTermsByUniId = (uniId) => {
    console.log('hi')
    api.getTermsByUniId(uniId) 
      .then(response => {
        console.log(response.data)
        this.setState({terms: response.data.length > 0 ? response.data : null})
      })
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

  setActivePane = index => {
    this.setState({activePane: index})
    localStorage.setItem('activePane', `${index}`)
  }

  setCurrent = (name, data) => {
    if (name.includes('Uni')) {
      this.setState({[name]: handleData.findById(this.state.universities, data.value)})
      if (name.includes('term')) {
        localStorage.setItem('termCurrUni', data.value)
        this.getTermsByUniId(data.value)
      };
      if (name.includes('depart')) {
        localStorage.setItem('departCurrUni', data.value)
        this.getDepartsByUniId(data.value, 'departments');
      }
      if (name.includes('course')) {
        localStorage.setItem('courseCurrUni', data.value)
        this.getDepartsByUniId(data.value, 'courseCurrDeparts');
      }
    } else if (name.includes('Depart')) {
      this.setState({[name]: handleData.findById(this.state.courseCurrDeparts, data.value)})
      this.getCoursesByDepartId(data.value);
      localStorage.setItem('courseCurrDepart', data.value)
    } 
  } 

  render() {
    const panes = [
      { menuItem: 'Universities', render: () => <UniPane {...this} /> },
      { menuItem: 'Terms', render: () => <TermPane {...this} /> },
      { menuItem: 'Departments', render: () => <DepartPane {...this} /> },
      { menuItem: 'Courses', render: () => <CoursePane {...this} /> }
    ]
    return (
      <div>
        <SignOutHeader user={{name: '...'}} />
        <div className="admin-bg">
          <Tab 
            className="ap-tab"
            activeIndex={this.state.activePane}
            menu={{ borderless: true, attached: false, tabular: false }} 
            panes={panes}
            onTabChange={(event, data) => this.setActivePane(data.activeIndex)}
          />
        </div>
      </div>
    )
  }
}

