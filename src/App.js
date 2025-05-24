// src/App.js
import React, { Suspense, useEffect } from 'react';
import {
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';

import { env, user } from 'utils';
import './App.css';

// Lazy load screens
const WatchPage = React.lazy(() => import('./screens/Watch'));
const EPubPage = React.lazy(() => import('./screens/EPub'));
const CoursePage = React.lazy(() => import('./screens/Course'));
const MyCoursesPage = React.lazy(() => import('./screens/Instructor/MyCourses'));
const InstPlaylistPage = React.lazy(() => import('./screens/Instructor/InstPlaylist'));
const MediaSettingsPage = React.lazy(() => import('./screens/MediaSettings'));

const NotFound404 = React.lazy(() => import('./screens/NotFound404'));
const Maintenance = React.lazy(() => import('./screens/Maintenance'));
const SignIn = React.lazy(() =>
  import('./screens').then(module => ({ default: module.SignIn }))
);
const AuthCallback = React.lazy(() =>
  import('./screens').then(module => ({ default: module.AuthCallback }))
);
const Admin = React.lazy(() => import('./screens/Admin'));
const NewCourse = React.lazy(() => import('./screens/Instructor/NewCourse'));
const CourseSettings = React.lazy(() => import('./screens/Instructor/CourseSettings'));
const CourseAnalytics = React.lazy(() => import('./screens/Instructor/CourseAnalytics'));
const NewPlaylist = React.lazy(() => import('./screens/Instructor/NewPlaylist'));
const Embed = React.lazy(() =>
  import('./screens/Instructor').then(module => ({ default: module.Embed }))
);
const Home = React.lazy(() =>
  import('./screens/Home').then(module => ({ default: module.Home }))
);
const Search = React.lazy(() => import('./screens/Search'));
const History = React.lazy(() => import('./screens/History'));
const Analytics = React.lazy(() => import('./screens/Analytics'));
const Glossary = React.lazy(() => import('./screens/Glossary'));
const Asl = React.lazy(() => import('./screens/Asl'));

function App() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("AUTHING")
    user.validate();
  }, []);

  const isAdminOrInstructor = user.isInstructor || user.isAdmin;

  if (env.classTranscribeDownMessage) return <Maintenance />;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {user.callbackPaths.map((path) => (
          <Route exact path={path} key={path} element={<AuthCallback />} />
        ))}
        <Route exact path="/sign-in" element={<SignIn />} />

        {/* Admin */}
        {user.isAdmin && <Route path="/admin" element={<Admin />} />}

        {/* Instructor */}
        <Route path="/instructor" element={<Navigate to="/instructor/my-courses" replace />} />
        {isAdminOrInstructor && (
          <>
            <Route exact path="/instructor/my-courses" element={<MyCoursesPage />} />
            <Route exact path="/instructor/new-course" component={NewCourse} />
            <Route exact path="/offering/:id/settings" component={CourseSettings} />
            <Route exact path="/offering/:id/analytics" component={CourseAnalytics} />
            <Route exact path="/offering/:id/new-playlist" component={NewPlaylist} />
            <Route path="/media-settings/:id" component={MediaSettingsPage} />
            <Route path="/epub/:id" component={EPubPage} />
          </>
        )}

        {/* Student */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Navigate to="/" replace />} />
        <Route exact path="/offering/:id" component={<CoursePage />} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/history" component={History} />
        <Route exact path="/personal-analytics" component={Analytics} />
        <Route exact path="/glossary" component={Glossary} />
        <Route exact path="/asl" component={Asl} />
        <Route exact path="/video" component={WatchPage} />
        <Route exact path="/embed/:id" component={Embed} />
        <Route path="/playlist/:id" component={InstPlaylistPage} />

        <Route path="/404" component={NotFound404} />
        <Route component={NotFound404} />
      </Routes>
    </Suspense>
  );
}

export default App;


