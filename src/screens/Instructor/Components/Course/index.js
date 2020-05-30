import React, { useEffect, useState, createRef } from 'react';
import { useLocation } from 'react-router-dom';
import { CTLoader } from 'layout';
import { links } from 'utils/links';
import './index.css';
import {
  connectWithRedux,
  setup,
  offControl,
  filterControl,
  NEW_OFFERING,
  // OFF_SETTINGS,
} from '../../Utils';

import { EditCourse } from '../EditCourse';
import CourseInfo from './CourseInfo';
import Playlists from './Playlists';
import Analytics from './Analytics';
import NoOfferingHolder from './NoOfferingHolder';

function CourseWithRedux({
  offering = {},
  playlists = [],
  playlist = {},

  isEditingOffering = false,
  setIsEditingOffering,

  isViewingAnalytics = false,
  setIsViewingAnalytics,
}) {
  const [results, setResults] = useState([]);
  const stickyContextRef = createRef();

  const handleDelete = () => {
    setup.confirm({
      text: (
        <div>
          Are you sure to delete the course <span>{offering.courseName}</span> ?
        </div>
      ),
      onConfirm: () => offControl.deleteOffering(offering.id),
    });
  };

  const handlePlaylistClick = (pl) => () => {
    setup.changePlaylist(pl);
  };

  const handleEdit = () => {
    offControl.offering(offering);
    setIsEditingOffering(true);
    // setup.changePlaylist(OFF_SETTINGS)
  };

  const viewAnalytics = () => {
    setIsViewingAnalytics(true);
  };

  const onFilter = (value) => filterControl.filterPlaylists(value, playlists, setResults);
  const onReverse = () => filterControl.reverse(results, setResults);

  useEffect(() => {
    if (offering.courseNumber) {
      if (offering === NEW_OFFERING) return;
      setup.setUpPlaylists(offering.id);
    }
  }, [offering]);

  useEffect(() => {
    setup.setupPlaylist(setResults);
  }, [playlists]);

  const { pathname } = useLocation();
  if (pathname === links.instNewOffering()) return null;

  if (!offering.id) return <NoOfferingHolder />;
  // if (offering === NEW_OFFERING) return <EditCourse newCourse />
  if (isEditingOffering) return <EditCourse />;
  if (isViewingAnalytics) return <Analytics />;

  return (
    <div className="ip-course" ref={stickyContextRef}>
      {offering.id && playlists.length > 0 ? (
        <>
          <div className="ct-a-fade-in ip-course-con" data-scroll>
            {/* Course Info */}
            <CourseInfo
              offering={offering}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
              viewAnalytics={viewAnalytics}
              stickyContextRef={stickyContextRef}
            />

            <Playlists
              results={results}
              playlist={playlist}
              playlists={playlists}
              onFilter={onFilter}
              onReverse={onReverse}
              handlePlaylistClick={handlePlaylistClick}
            />
          </div>
        </>
      ) : (
        <CTLoader />
      )}
    </div>
  );
}

export const Course = connectWithRedux(
  CourseWithRedux,
  ['offering', 'playlists', 'playlist', 'isEditingOffering', 'isViewingAnalytics'],
  ['setIsEditingOffering', 'setIsViewingAnalytics'],
);
