import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Icon } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { util, user, api } from 'utils';
import './index.css';

import { SectionShowMoreButton, SectionFoldButton } from './Overlays';
import DepartmentSection from './DepartmentSection';
import StarredSection from './StarredSection';
import HistorySection from './HistorySection';

const UNLOAD = ['unload'];
const EMPTY = ['empty'];

function Section({
  history,
  depart = {},
  state,
  offerings = [],
  starredOfferings = [],
  type,
  ...functions
}) {
  const { universities } = state;
  const uni = _.find(universities, { id: depart.universityId }) || {};

  const [showAll, setShowAll] = useState(false);
  const [isFolded, setisFolded] = useState(false);
  const [watchHistory, setWatchHistory] = useState(EMPTY);

  const getUserWatchHistories = async () => {
    try {
      setWatchHistory(UNLOAD);
      const { data } = await api.getUserWatchHistories();

      if (data.length < 1) {
        setWatchHistory(EMPTY);
        return;
      }

      setWatchHistory(data);
    } catch (error) {
      setWatchHistory(EMPTY);
      // prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' })
    }
  };

  useEffect(() => {
    if (user.isLoggedIn) {
      getUserWatchHistories();
    }
  }, []);

  // Functions handling states' changes
  const handleShowAll = () => {
    if (type === 'history') {
      history.push(util.links.history());
    } else {
      setShowAll((showAll_) => !showAll_);
    }
  };

  const handleFold = () => {
    setisFolded((isFolded_) => !isFolded_);
  };

  // Determine the section's type
  let sectionTitle = {};
  if (type === 'department') {
    offerings = offerings.filter((offering) => offering.departmentIds.includes(depart.id));
    if (offerings.length === 0) return null;
    sectionTitle = { title: depart.name, subtitle: uni.name };
  } else if (type === 'starred') {
    if (!starredOfferings.length) return null;
    sectionTitle = {
      title: (
        <>
          <Icon name="bookmark" /> Starred Courses
        </>
      ),
      subtitle: '',
    };
  } else if (type === 'history') {
    if (watchHistory === EMPTY) return null;
    sectionTitle = {
      title: (
        <>
          <Icon name="history" /> Continue Watching
        </>
      ),
      subtitle: '',
    };
  }

  return (
    <div className="section" id={depart.acronym} role="listitem">
      <hr />
      <h2 className="title">
        {sectionTitle.title} <span>{sectionTitle.subtitle}</span>
      </h2>
      {isFolded ? null : type === 'department' ? (
        <DepartmentSection
          {...functions}
          state={{ ...state, offerings }}
          depart={depart}
          showAll={showAll}
          offerings={offerings}
          starredOfferings={starredOfferings}
        />
      ) : type === 'starred' ? (
        <StarredSection
          {...functions}
          state={{ ...state, offerings }}
          showAll={showAll}
          offerings={offerings}
          starredOfferings={starredOfferings}
        />
      ) : type === 'history' ? (
        <HistorySection offerings={offerings} watchHistory={watchHistory} />
      ) : null}
      {/* Overlay Buttons */}
      <SectionShowMoreButton
        shouldDisplay={
          (type === 'starred' ? starredOfferings.length > 6 : offerings.length > 6) && !isFolded
        }
        showAll={showAll}
        handleShowAll={handleShowAll}
      />
      <SectionFoldButton shouldDisplay isFolded={isFolded} handleFold={handleFold} />
    </div>
  );
}

export default withRouter(Section);
