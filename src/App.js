import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import authentication from 'react-azure-adb2c'

import { 
  OfferingViewing, 
  InstructorProfile, 
  InstructorOffering,
  LoginAndLogout,
  Admin,
  Watch,
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'

class App extends React.Component {
  render() {
    const NotFound404 = () => <div>404</div>
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/login" component={authentication.required(LoginAndLogout)} />
          <Route exact path="/logout" component={authentication.required(LoginAndLogout)} />
          <Route path="/home" component={OfferingViewing} />
          <Route exact path="/video/:states" component={Watch} />
          <Route path="/admin" component={authentication.required(Admin)} />
          <Route path="/instructor" component={InstructorProfile} />
          <Route path="/offering/:id" component={InstructorOffering} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    )
  }
}

export default App
