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
const lazyImport = (exportName) =>
  React.lazy(() =>
    import(`./screens`).then(module => ({ default: module[exportName] }))
  );
const WatchPage = lazyImport('Watch');
const EPubPage = lazyImport('EPub');
const CoursePage = lazyImport('Course');
const MyCoursesPage = lazyImport('MyCourses');
const InstPlaylistPage = lazyImport('InstPlaylist');
const MediaSettingsPage = lazyImport('MediaSettings');

const NotFound404 = lazyImport('NotFound404');
const Maintenance = lazyImport('Maintenance');
const SignIn = lazyImport('SignIn');
const AuthCallback = lazyImport('AuthCallback');
const Admin = lazyImport('Admin');
const NewCourse = lazyImport('NewCourse');
const CourseSettings = lazyImport('CourseSettings');
const CourseAnalytics = lazyImport('CourseAnalytics');
const NewPlaylist = lazyImport('NewPlaylist');
const Embed = lazyImport('Embed');
const Home = lazyImport('Home');
const Search = lazyImport('Search');
const History = lazyImport('History');
const Analytics = lazyImport('Analytics');
const Glossary = lazyImport('Glossary');
const Asl = lazyImport('Asl');

function App() {
  useEffect(() => {
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
            <Route exact path="/instructor/new-course" element={<NewCourse />} />
            <Route exact path="/offering/:id/settings" element={<CourseSettings />} />
            <Route exact path="/offering/:id/analytics" element={<CourseAnalytics />} />
            <Route exact path="/offering/:id/new-playlist" element={<NewPlaylist />} />
            <Route path="/media-settings/:id" element={<MediaSettingsPage />} />
            <Route path="/epub/:id" element={<EPubPage />} />
          </>
        )}

        {/* Student */}
        <Route exact path="/" element={<Home />} />
        <Route exact path="/home" element={<Navigate to="/" replace />} />
        <Route exact path="/offering/:id" element={<CoursePage />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/history" element={<History />} />
        <Route exact path="/personal-analytics" element={<Analytics />} />
        <Route exact path="/glossary" element={<Glossary />} />
        <Route exact path="/asl" element={<Asl />} />
        <Route exact path="/video" element={<WatchPage />} />
        <Route exact path="/embed/:id" element={<Embed />} />
        <Route path="/playlist/:id" element={<InstPlaylistPage />} />

        <Route path="/404" element={<NotFound404 />} />
        <Route element={<NotFound404 />} />
      </Routes>
    </Suspense>
  );
}

export default App;


