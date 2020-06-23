import React from 'react';
import { withRouter, Route, Switch, Redirect } from 'react-router-dom';
import AppInsightsProvider from './azure-app-insights';

import {
  // Admin
  Admin,
  // Instructor
  MyCourses,
  NewCourse,
  CourseSettings,
  CourseAnalytics,
  InstPlaylist,
  MediaSettings,
  // Student
  Home,
  Course,
  Search,
  History,
  Analytics,
  Watch,
  // General
  SetupUser,
  NotFound404,
  Maintenance,
  ComponentAPI,
  Example,
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
          <Route exact path={user.callbackPaths} component={SetupUser} />

          {/* Admin */}
          {user.isAdmin && <Route path="/admin" component={Admin} />}

          {/* Instructor */}
          <Route exact path="/instructor" render={() => <Redirect to="/instructor/my-courses" />} />
          {user.isInstructor && <Route exact path="/instructor/my-courses" component={MyCourses} />}
          {user.isInstructor && <Route exact path="/instructor/new-course" component={NewCourse} />}
          {user.isInstructor && (
            <Route exact path="/instructor/course-settings/:id" component={CourseSettings} />
          )}
          {user.isInstructor && (
            <Route exact path="/instructor/course-analytics/:id" component={CourseAnalytics} />
          )}
          {user.isInstructor && (
            <Route exact path="/instructor/playlist/:id" component={InstPlaylist} />
          )}

          {user.isInstructor && <Route path="/media-settings/:id" component={MediaSettings} />}

          {/* Student */}
          <Route exact path="/" component={Home} />
          <Route exact path="/home" render={() => <Redirect to="/" />} />
          <Route exact path="/offering/:id" component={Course} />
          <Route exact path="/search" component={Search} />
          <Route exact path="/history" component={History} />
          <Route exact path="/personal-analytics" component={Analytics} />
          <Route exact path="/video" component={Watch} />
          <Route exact path="/docs/component-api/:name" component={ComponentAPI} />

          <Route exact path="/example" component={Example} />

          <Route path="/404" component={NotFound404} />
          <Route component={NotFound404} />
        </Switch>
      </AppInsightsProvider>
    );
  }
}

export default withRouter(App);
