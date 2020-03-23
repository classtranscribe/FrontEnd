import React from 'react'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import { 
  // Admin
  Admin,
  // Instructor
  Instructor,
  MediaSettings,
  // Student
  OfferingViewing, 
  Watch,
  // General
  LoginAndLogout,
  NotFound404,
  Maintenance, 
} from './screens'
import './App.css'
import 'semantic-ui-css/semantic.min.css'

import { user } from './utils'

class App extends React.Component {
  componentDidMount() {
    user.validate()
  }

  render() {
    // return <Maintenance />
    return (
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/home" />} />
        <Route exact path="/login" component={LoginAndLogout} />
        <Route exact path="/logout" component={LoginAndLogout} />

        {/* Admin */}
        <Route path="/admin" component={Admin} />

        {/* Instructor */}
        <Route path={["/instructor", "/instructor/:offId"]} component={Instructor} />
        <Route exact path="/media-settings/:id" component={MediaSettings} />

        {/* Student */}
        <Route path="/home" component={OfferingViewing} />
        <Route exact path="/video" component={Watch} />

        <Route path="/404" component={NotFound404} />
        <Route component={NotFound404} />
      </Switch>
    )
  }
}

export default withRouter(App)
