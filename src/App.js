import React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'

import { 
  NotFound404,
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
    return (
      <Router basename="/">
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/login" component={LoginAndLogout} />
          <Route exact path="/logout" component={LoginAndLogout} />
          <Route path="/home" component={OfferingViewing} />
          <Route exact path="/video" component={Watch} />
          <Route path="/admin" component={Admin} />
          <Route path="/instructor" component={InstructorProfile} />
          <Route path="/offering/:id" component={InstructorOffering} />

          <Route path="/404" component={NotFound404} />
          <Route component={NotFound404} />
        </Switch>
      </Router>
    )
  }
}

export default App
