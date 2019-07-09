import React from 'react'
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import authentication from 'react-azure-adb2c'

import { 
  LoginPage as Homepage, 
  StudentsPage, 
  InstructorProfile, 
  InstructorOffering,
  VideoPage,
  Admin,
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
    }
  }

  setAuth = () => {
    this.setState({auth: !this.state.auth})
  }

  render() {
    const NotFound404 = () => <div>404</div>
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" component={Homepage} />
          <Route path="/admin" component={authentication.required(Admin)} />
          <Route path="/student" component={authentication.required(StudentsPage)} />
          <Route path="/instructor" component={authentication.required(InstructorProfile)} />
          <Route path="/offering/:id" component={authentication.required(InstructorOffering)} />
          <Route path="/video" component={VideoPage} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    )
  }
}

export default App
