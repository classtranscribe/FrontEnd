import React from 'react'
import { withRouter, Route, Switch, Redirect } from 'react-router-dom'
import AppInsightsProvider from './azure-app-insights'
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
      <AppInsightsProvider>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path="/login" component={LoginAndLogout} />
          <Route exact path="/logout" component={LoginAndLogout} />

          {/* Admin */}
          {
            user.isAdmin
            &&
            <Route path="/admin" component={Admin} />
          }

          {/* Instructor */}
          {
            user.isInstructor
            &&
            <Route path={["/instructor", "/instructor/:offId"]} component={Instructor} />
          }
          {
            user.isInstructor
            &&
            <Route path="/media-settings/:id" component={MediaSettings} />
          }

          {/* Student */}
          <Route path="/home" component={OfferingViewing} />
          <Route exact path="/video" component={Watch} />

          <Route path="/404" component={NotFound404} />
          <Route component={NotFound404} />
        </Switch>
      </AppInsightsProvider>
    )
  }
}

export default withRouter(App)
