import React from 'react'
// UI
import { Tab } from 'semantic-ui-react'
import { SignOutHeader } from '../../components'
import TermPane from './term'
import UniPane from './universities'
import DepartPane from './department'
import './index.css'
// Vars
import { api, handleData, refresh } from '../../util'
const { initialTerm, initialUni, initialDepart } = api.initialData;

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
    }
  }

  getDataCallBack = (responce, name) => this.setState({[name]: responce.data})
  
  componentDidMount() {
    api.getAll(['Terms', 'Universities', 'Departments'], this.getDataCallBack);
  }

  componentWillMount() {
    // localStorage.removeItem('activePane');
  }

  setActivePane = index => {
    this.setState({activePane: index})
    localStorage.setItem('activePane', `${index}`)
  }

  resetState = name => {
    name = name.toLowerCase();
    if (name.includes('term')) this.setState({[name]: handleData.copy(initialTerm)});
    else if (name.includes('uni')) this.setState({[name]: handleData.copy(initialUni)});
    else if (name.includes('depart')) this.setState({[name]: handleData.copy(initialDepart)});
  }

  onFormSubmit = name => {
    const path = api.getApiPath(name);
    api.postData(path, this.state[name], 
      () => {
        this.resetState(name);
        api.getAll(path)
        refresh();
      })
  }

  onUpdate = (name, obj) => {
    const path = api.getApiPath(name)
    var data = handleData.updateJson(this.state[name], obj)
    data.id = obj.id;
    api.updateData(path, data, 
      () => {
        this.resetState(name)
        api.getAll(path)
        refresh();
      })
  }

  onDelete = (name, obj) => {
    const path = api.getApiPath(name);
    api.deleteData(path, obj.id, 
      () => {
        api.getAll(path)
        refresh();
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

