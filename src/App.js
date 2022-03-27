import React, { useEffect, useState } from 'react';
import { withRouter, Route, Switch, Redirect } from 'dva/router';
import dynamic from 'dva/dynamic';
import { LiveHLSPlayer } from 'screens/Watch/live_test';
// import AppInsightsProvider from './azure-app-insights';
import {
  // General
  NotFound404,
  // Maintenance,
  SignIn,
  AuthCallback,
  // Admin
  Admin,
  // Instructor
  MyCourses,
  NewCourse,
  CourseSettings,
  CourseAnalytics,
  InstPlaylist,
  MediaSettings,
  NewPlaylist,
  Embed,
  EPub,
  // Student
  Home,
  Course,
  Search,
  History,
  Analytics,
  Watch,
  // ComponentAPI,
  Example,
} from './screens';

import './App.css';
// import 'braft-editor/dist/index.scss';
import { altEl } from './layout';
import { user, env } from './utils';

function App(props) {
  const isAdminOrInstructor = user.isInstructor || user.isAdmin;
  useEffect(() => {
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme == 'dark') {
      var els = document.getElementsByTagName('*');
      for (var i = 0, all = els.length; i < all; i++) {
        els[i].classList.add('dark');
      }
    } else {
      var els = document.getElementsByTagName('*');
      for (var i = 0, all = els.length; i < all; i++) {
        els[i].classList.remove('dark');
      }
    }
  }, []);

  const adminRoute = altEl();
  // Lazy Load
  const WatchPage = dynamic({
    app: props.app,
    models: () => [],
    component: () => Watch,
  });
  const EPubPage = dynamic({
    app: props.app,
    models: () => [require('./screens/EPub/model').default],
    component: () => EPub,
  });
  const CoursePage = dynamic({
    app: props.app,
    models: () => [], // require('./screens/Course/model').default
    component: () => Course,
  });
  const MyCoursesPage = dynamic({
    app: props.app,
    models: () => [require('./screens/Instructor/MyCourses/model').default], //
    component: () => MyCourses,
  });
  const InstPlaylistPage = dynamic({
    app: props.app,
    models: () => [require('./screens/Instructor/InstPlaylist/model')],
    component: () => InstPlaylist,
  });
  const MediaSettingsPage = dynamic({
    app: props.app,
    models: () => [require('./screens/MediaSettings/model')],
    component: () => MediaSettings,
  });
  return (
    <div>
      <Switch>
        <Route exact path={user.callbackPaths} component={AuthCallback} />
        <Route exact path="/sign-in" component={SignIn} />

        {/* Admin */}
        {user.isAdmin && <Route path="/admin" component={Admin} />}

        {/* Instructor */}
        <Route exact path="/instructor" render={() => <Redirect to="/instructor/my-courses" />} />
        {isAdminOrInstructor && (
          <Route exact path="/instructor/my-courses" component={MyCoursesPage} />
        )}
        {isAdminOrInstructor && <Route exact path="/instructor/new-course" component={NewCourse} />}
        {isAdminOrInstructor && (
          <Route exact path="/offering/:id/settings" component={CourseSettings} />
        )}
        {isAdminOrInstructor && (
          <Route exact path="/offering/:id/analytics" component={CourseAnalytics} />
        )}
        {isAdminOrInstructor && (
          <Route exact path="/offering/:id/new-playlist" component={NewPlaylist} />
        )}
        {isAdminOrInstructor && <Route path="/media-settings/:id" component={MediaSettingsPage} />}

        {isAdminOrInstructor && <Route path="/epub/:id" component={EPubPage} />}

        {/* Student */}
        <Route exact path="/" component={Home} />
        <Route exact path="/home" render={() => <Redirect to="/" />} />
        <Route exact path="/offering/:id" component={CoursePage} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/history" component={History} />
        <Route exact path="/personal-analytics" component={Analytics} />
        <Route exact path="/video" component={WatchPage} />
        <Route exact path="/embed/:id" component={Embed} />
        <Route path="/playlist/:id" component={InstPlaylistPage} />

        <Route path="/404" component={NotFound404} />
        <Route path="/liveplayer" component={LiveHLSPlayer} />

        {env.dev && <Route exact path="/example" component={Example} />}

        <Route component={NotFound404} />
        {/* <Route exact path="/docs/component-api/:type" component={ComponentAPI} /> */}
      </Switch>
    </div>
  );
}

export default withRouter(App);
