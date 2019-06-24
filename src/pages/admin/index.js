import React from 'react'
import { api } from '../../util'
import _ from 'lodash'

import { Tab } from 'semantic-ui-react'
import { SignOutHeader } from '../../components'
import TermPane from './term'
import UniPane from './universities'
import DepartPane from './department'

import './index.css'

const initialTermData = {name: '', startDate: ''};
const initialUniData = {name: '', domain: ''};
const initialDepart = {name: '', acronym: '', universityId: ''};

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
      depart: _.clone(initialDepart),
      editDepart: _.clone(initialDepart),
    }
  }
  
  componentDidMount() {
    this.getAll('Terms');
    this.getAll('Universities');
    this.getAll('Departments');
  }

  componentWillMount() {
    // localStorage.removeItem('activePane');
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
    if (name === 'term' || name === 'editTerm') this.setState({[name]: _.clone(initialTermData)});
    else if (name === 'uni' || name === 'editUni') this.setState({[name]: _.clone(initialUniData)});
    else if (name === 'depart' || name === 'editDepart') this.setState({[name]: _.clone(initialDepart)});
  }

  onFormSubmit = name => {
    const path = name === 'term' ? 'Terms' : 
                 name === 'uni' ? 'Universities' : 'Departments';
    api.postData(path, this.state[name])
      .then(responce => {
        // console.log(responce.data)
        this.resetState(name);
        this.getAll(path)
        this.refresh();
      })
      .catch( error => {
        console.log(error)
      })
  }

  onUpdate = (name, obj) => {
    var path, data = _.clone(this.state[name]);
    data.id = obj.id;
    if (name === 'editTerm') {
      path = 'Terms';
      data.name = data.name || obj.name;
      data.startDate = data.startDate || obj.startDate;
    } else if (name === 'editUni') {
      path = 'Universities';
      data.name = data.name || obj.name;
      data.domain = data.domain || obj.domain;
    } else if (name === 'editDepart') {
      path = 'Departments';
      data.name = data.name || obj.name;
      data.acronym = data.acronym || obj.acronym;
      data.universityId = data.universityId || obj.universityId;
    }
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
    const path = name === 'term' ? 'Terms' : 
                 name === 'uni' ? 'Universities' : 'Departments';
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

  onFormChange = (e, name, target) => {
    const newData = this.state[name];
    newData[target] = (target === 'universityId') ? e.value :
                      (target === 'acronym') ? e.target.value.toUpperCase() : 
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

