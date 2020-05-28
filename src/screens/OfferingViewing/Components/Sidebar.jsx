/**
 * Sidebar Component of Student page/OV page
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListGroup } from 'react-bootstrap';
import { Icon } from 'semantic-ui-react';
import { Button } from 'pico-ui';
import { SignInMenu } from 'components';
import { user, util } from 'utils';

const EK_COURSES = 'courses';
const EK_STARRED = 'starred';
const EK_SEARCH = 'search';
const EK_HISTORY = 'history';
const EK_ANALYTICS = 'personal-analytics';
const EK_NAN = 'NaN';

function currentActiveKey() {
  let { home, starred, history, personalAnalytics, search } = util.links;
  switch (window.location.pathname) {
    case home():
      return EK_COURSES;
    case search():
      return EK_SEARCH;
    case starred():
      return EK_STARRED;
    case history():
      return EK_HISTORY;
    case personalAnalytics():
      return EK_ANALYTICS;
    default:
      return EK_NAN;
  }
}

export function Sidebar({ state: { displaySideBar }, handleShowSidebar }) {
  let activeKey = currentActiveKey();
  let isLoggedIn = user.isLoggedIn;

  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setTimeout(() => setAnchorEl(null), 200);
  };

  const style = { marginLeft: displaySideBar ? '0' : '-20rem' };

  const handleTabChange = () => handleShowSidebar(window.innerWidth > 900);

  return (
    <aside className="op-sidebar" style={style}>
      <ListGroup activeKey={activeKey} onSelect={() => {}}>
        {/* Home Tab */}
        <ListGroup.Item
          action
          className="list"
          eventKey={EK_COURSES}
          as={Link}
          to={util.links.home()}
          title="courses"
          aria-label="courses"
          onClick={handleTabChange}
        >
          <Icon name="book" /> &emsp; Courses
        </ListGroup.Item>

        <ListGroup.Item
          action
          id="hp-search-tab"
          className="list"
          eventKey={EK_SEARCH}
          as={Link}
          to={util.links.search()}
          title="search"
          aria-label="seach"
          onClick={handleTabChange}
        >
          <Icon name="search" /> &emsp; Search
        </ListGroup.Item>

        {isLoggedIn && (
          <>
            {/* History Tab */}
            <ListGroup.Item
              action
              id="hp-history-tab"
              className="list"
              eventKey={EK_HISTORY}
              as={Link}
              to={util.links.history()}
              title="history"
              aria-label="history"
              onClick={handleTabChange}
            >
              <Icon name="history" /> &emsp; History
            </ListGroup.Item>
            {/* Analytics Tab */}
            <ListGroup.Item
              action
              className="list"
              eventKey={EK_ANALYTICS}
              as={Link}
              to={util.links.personalAnalytics()}
              title="personal analytics"
              aria-label="personal analytics"
              onClick={handleTabChange}
            >
              <Icon name="user" /> &emsp; Analytics
            </ListGroup.Item>
          </>
        )}

        {/* If not logged in show login prompt */}
        {!isLoggedIn && (
          <div className="signin-prompt">
            <p>
              Cannot Find Your Courses?
              <br />
              Sign In to See More
            </p>
            <Button aria-label="sign in" onClick={handleClick}>
              Sign In
            </Button>
            <SignInMenu open={Boolean(anchorEl)} anchorEl={anchorEl} handleClose={handleClose} />
          </div>
        )}
      </ListGroup>
    </aside>
  );
}
