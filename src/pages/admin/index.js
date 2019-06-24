import React from 'react'
import _ from 'lodash'
// UI
import { Tab } from 'semantic-ui-react'
import { SignOutHeader } from '../../components'
import TermPane from './term'
import UniPane from './universities'
import DepartPane from './department'
import './index.css'
// Vars
import { api } from '../../util'
const { initialTermData, initialUniData, initialDepartData } = api.initialData;

export class AdminPage extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      activePane: parseInt(localStorage.getItem('activePane')) || 0,

      terms: [],
      term: _.clone(initialTermData),
      editTerm: _.clone(initialTermData),

      universities: [],
      uni: _.clone(initialUniData),
      editUni: _.clone(initialUniData),

      departments: [],
      depart: _.clone(initialDepartData),
      editDepart: _.clone(initialDepartData),
    }
  }
  
  componentDidMount() {
    this.getAll('Terms');
    this.getAll('Universities');
    this.getAll('Departments');
  }

  componentWillMount() {
    localStorage.removeItem('activePane');
  }

  setActivePane = index => {
    this.setState({activePane: index})
    localStorage.setItem('activePane', `${index}`)
  }

  getAll = name => {
    const stateName = name.toLowerCase();
    api.getData(name)
      .then(responce => {
        // console.log(`get all ${name}`)
        this.setState({[stateName]: responce.data})
        // console.log(this.state[stateName])
      })
      .catch( error => {
        console.log(error)
      })
  }

  refresh() {
    document.location.reload(true);
  }

  resetState = name => {
    name = name.toLowerCase();
    if (name.includes('term')) this.setState({[name]: _.clone(initialTermData)});
    else if (name.includes('uni')) this.setState({[name]: _.clone(initialUniData)});
    else if (name.includes('depart')) this.setState({[name]: _.clone(initialDepartData)});
  }

  onFormSubmit = name => {
    const path = api.getApiPath(name);
    api.postData(path, this.state[name])
      .then(responce => {
        console.log(responce.data)
        this.resetState(name);
        this.getAll(path)
        this.refresh();
      })
      .catch( error => {
        console.log(error)
      })
  }

  onUpdate = (name, obj) => {
    const path = api.getApiPath(name)
    var data = _.clone(this.state[name]);
    for (var key in obj) {
      data[key] = data[key] || obj[key];
    }
    data.id = obj.id;
    api.updateData(path, data)
      .then(responce => {
        // console.log(responce.data)
        this.resetState(name)
        this.getAll(path)
        this.refresh();
      })
      .catch( error => {
        console.log(error)
      })
  }

  onDelete = (name, obj) => {
    const path = api.getApiPath(name);
    api.deleteData(path, obj.id)
      .then(responce => {
        // console.log(responce.data)
        this.getAll(path)
        this.refresh();
      })
      .catch( error => {
        console.log(error)
      })
  }

  onFormChange = (e, name, key) => {
    const newData = this.state[name];
    newData[key] = (key === 'universityId') ? e.value :
                   (key === 'acronym') ? e.target.value.toUpperCase() : 
                    e.target.value;
    this.setState({[name]: newData});
  }

  render() {
    const panes = [
      { menuItem: 'Terms', render: () => <TermPane {...this} /> },
      { menuItem: 'Universities', render: () => <UniPane {...this} /> },
      { menuItem: 'Departments', render: () => <DepartPane {...this} /> }
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

