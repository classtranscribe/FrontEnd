import React from 'react'
// UI
import { Tab } from 'semantic-ui-react'
import { SignOutHeader } from '../../components'
import TermPane from './term'
import UniPane from './universities'
import DepartPane from './department'
import CoursePane from './course'
import './index.css'
// Vars
import { api, handleData, util } from '../../util'
const { initialTerm, initialUni, initialDepart, initialCourse } = api.initialData;

export class AdminPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activePane: parseInt(localStorage.getItem('activePane')) || 0,

      terms: [],
      term: handleData.copy(initialTerm),
      editTerm: handleData.copy(initialTerm),

      universities: [],
      uni: handleData.copy(initialUni),
      editUni: handleData.copy(initialUni),

      departments: [],
      depart: handleData.copy(initialDepart),
      editDepart: handleData.copy(initialDepart),
      departCurrUni: null,

      courses: [],
      course: handleData.copy(initialCourse),
      editCourse: handleData.copy(initialCourse),
      courseCurrUni: null,
      courseCurrDeparts: [],
      courseCurrDepart: null,
    }
    this.getSelectOptions = util.getSelectOptions;
  }

  componentDidMount() {
    this.getAll();
  }

  componentWillMount() {
    // localStorage.removeItem('activePane');
  }

  getDataCallBack = (response, name) => this.setState({[name]: response.data})
  
  getAll() {
    api.getAll(['Terms', 'Universities', 'Departments'], this.getDataCallBack);
    const { courseCurrDepart, courseCurrUni } = this.state;
    if (courseCurrUni) this.getDepartsByUniId(courseCurrUni.id);
    if (courseCurrDepart) this.getCoursesByDepartId(courseCurrDepart.id);
  }

  getDepartsByUniId = (uniId) => {
    api.getData('Departments/ByUniversity', uniId) 
      .then(response => {
        this.setState({courseCurrDeparts: response.data})
      })
  }

  getCoursesByDepartId = (departId) => {
    api.getData('Courses/ByDepartment', departId) 
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
      this.getDepartsByUniId(data.value);
    } else if (name.includes('Depart')) {
      this.setState({[name]: handleData.findById(this.state.courseCurrDeparts, data.value)})
      this.getCoursesByDepartId(data.value);
    } 
  } 

  resetState = name => {
    name = name.toLowerCase();
    if (name.includes('term')) this.setState({[name]: handleData.copy(initialTerm)});
    else if (name.includes('uni')) this.setState({[name]: handleData.copy(initialUni)});
    else if (name.includes('depart')) this.setState({[name]: handleData.copy(initialDepart)});
    else if (name.includes('course')) this.setState({[name]: handleData.copy(initialCourse)});
  }

  onFormChange = (e, name, key) => {
    const newData = this.state[name];
    newData[key] = (key.includes('Id')) ? e.value :
                   (key === 'acronym') ? e.target.value.toUpperCase() : 
                    e.target.value;
    this.setState({[name]: newData});
  }

  onFormSubmit = name => {
    const path = api.getApiPath(name);
    const data = this.state[name];
    if (name.includes('depart')) data.universityId = this.state.departCurrUni.id;
    else if (name.includes('course')) data.departmentId = this.state.courseCurrDepart.id;
    api.postData(path, data, 
      () => {
        this.resetState(name);
        this.getAll();
      })
  }

  onUpdate = (name, obj) => {
    const path = api.getApiPath(name)
    var data = handleData.updateJson(this.state[name], obj)
    data.id = obj.id;
    api.updateData(path, data, 
      () => {
        this.resetState(name)
        this.getAll();
      })
  }

  onDelete = (name, obj) => {
    const path = api.getApiPath(name);
    api.deleteData(path, obj.id, 
      () => {
        this.getAll();
      })
  }

  render() {
    const panes = [
      { menuItem: 'Terms', render: () => <TermPane {...this} /> },
      { menuItem: 'Universities', render: () => <UniPane {...this} /> },
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

