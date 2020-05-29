import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import AppInsightsProvider from './azure-app-insights';

import { 
  // Admin
  Admin,
  // Instructor
  Instructor,
  MediaSettings,
  // Student
  OfferingViewing, 
  Search,
  History,
  Analytics,
  Watch,
  // General
  SetupUser,
  NotFound404,
  Maintenance, 
} from './screens';

import './App.css';
import 'semantic-ui-css/semantic.min.css';
import 'braft-editor/dist/index.css';

import { user } from './utils/user';


class App extends React.Component {
  componentDidMount() {
    user.validate();
  }

  render() {
    // return <Maintenance />
    return (
      <AppInsightsProvider>
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/home" />} />
          <Route exact path={user.callbackPaths} component={SetupUser} />

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
          <Route path="/search" component={Search} />
          <Route path="/history" component={History} />
          <Route path="/personal-analytics" component={Analytics} />
          <Route exact path="/video" component={Watch} />

          <Route path="/404" component={NotFound404} />
          <Route component={NotFound404} />
        </Switch>
      </AppInsightsProvider>
    );
  }
}

export default withRouter(App);
