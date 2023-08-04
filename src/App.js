import React, { useEffect } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
// import dynamic from "dva/dynamic";
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
  Glossary,
  Asl,
  Watch,
  // ComponentAPI,
  Example
} from './screens';

import './App.css';
// import 'braft-editor/dist/index.scss';
import { altEl } from './layout';
import { user, env } from './utils';

function App(props) {
  useEffect(() => user.validate(), []);

  const isAdminOrInstructor = user.isInstructor || user.isAdmin;

  const adminRoute = altEl();
  // Lazy Load
  // const WatchPage = dynamic({
  //   app: props.app,
  //   models: () => [],
  //   component: () => Watch
  // })
  // const EPubPage = dynamic({
  //   app: props.app,
  //   models: () => [require('./screens/EPub/model').default],
  //   component: () => EPub
  // })
  // const CoursePage = dynamic({
  //   app: props.app,
  //   models: () => [], // require('./screens/Course/model').default
  //   component: () => Course
  // })
  // const MyCoursesPage = dynamic({
  //   app: props.app,
  //   models: () => [require('./screens/Instructor/MyCourses/model').default], //
  //   component: () => MyCourses
  // })
  // const InstPlaylistPage = dynamic({
  //   app: props.app,
  //   models: () => [require('./screens/Instructor/InstPlaylist/model')],
  //   component: () => InstPlaylist
  // })
  // const MediaSettingsPage = dynamic({
  //   app: props.app,
  //   models: () => [require('./screens/MediaSettings/model')],
  //   component: () => MediaSettings
  // })


  // return <Maintenance />
  return (
    // <AppInsightsProvider>
    <Routes>
      {user.callbackPaths.map((callbackPath) => <Route exact path={callbackPath} element={<AuthCallback />} key={callbackPath} />)}

      <Route exact path="/sign-in" element={<SignIn />} />

      {/* Admin */}
      {user.isAdmin && <Route path="/admin" element={<Admin />} />}

      {/* Instructor */}
      <Route exact path="/instructor" render={() => <Navigate to="/instructor/my-courses" />} />
      {/* {
        isAdminOrInstructor
        &&
        <Route exact path="/instructor/my-courses" element={<MyCoursesPage />} />
      } */}
      {
        isAdminOrInstructor
        &&
        <Route exact path="/instructor/new-course" element={<NewCourse />} />
      }
      {
        isAdminOrInstructor
        &&
        <Route exact path="/offering/:id/settings" element={<CourseSettings />} />
      }
      {
        isAdminOrInstructor
        &&
        <Route exact path="/offering/:id/analytics" element={<CourseAnalytics />} />
      }
      {
        isAdminOrInstructor
        &&
        <Route exact path="/offering/:id/new-playlist" element={<NewPlaylist />} />
      }
      {/* {
        isAdminOrInstructor
        &&
        <Route path="/media-settings/:id" element={<MediaSettingsPage />} />
      }

      {
        isAdminOrInstructor
        &&
        <Route path="/epub/:id" element={<EPubPage />} />
      } */}

      {/* Student */}
      <Route exact path="/" element={<Home />} />
      <Route exact path="/home" render={() => <Navigate to="/" />} />
      {/* <Route exact path="/offering/:id" element={<CoursePage />} /> */}
      <Route exact path="/search" element={<Search />} />
      <Route exact path="/history" element={<History />} />
      <Route exact path="/personal-analytics" element={<Analytics />} />
      <Route exact path="/glossary" element={<Glossary />} />
      <Route exact path="/asl" element={<Asl />} />
      {/* <Route exact path="/video" element={<WatchPage />} /> */}
      <Route exact path="/embed/:id" element={<Embed />} />
      {/* <Route path="/playlist/:id" element={<InstPlaylistPage />} /> */}

      <Route path="/404" element={<NotFound404 />} />


      {
        env.dev
        &&
        <Route exact path="/example" element={<Example />} />
      }

      <Route element={<NotFound404 />} />
      {/* <Route exact path="/docs/component-api/:type" element={<ComponentAPI />} /> */}
    </Routes>
    // </AppInsightsProvider>
  );
}

export default App;
