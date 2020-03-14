/**
 * Sidebar Component of Student page/OV page
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { user, util, env } from '../../../utils'
import { Icon, Button } from 'semantic-ui-react'

const EK_COURSES = 'courses'
const EK_STARRED = 'starred'
const EK_HISTORY = 'history'
const EK_ANALYTICS = 'personal-analytics'
const EK_NAN = 'NaN'


function currentActiveKey() {
  let { home, starred, history, personalAnalytics } = util.links
  switch (window.location.pathname) {
    case home()               : return EK_COURSES
    case starred()            : return EK_STARRED
    case history()            : return EK_HISTORY
    case personalAnalytics()  : return EK_ANALYTICS
    default: return EK_NAN
  }
}

export function Sidebar({
  state: { displaySideBar },
  showSiderBar
}) {
  let activeKey = currentActiveKey()
  let isLoggedIn = user.isLoggedIn()

  const style = { marginLeft: displaySideBar ? '0' : '-20rem' }

  const signin = () => env.dev ? user.testAccountSignIn() : user.signin()
  const handleTabChange = () => showSiderBar(window.innerWidth > 900)

  return (
    <aside className="op-sidebar" style={style} >
      <ListGroup activeKey={activeKey} onSelect={() => {}}>
        {/* Home Tab */}
        <ListGroup.Item action
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

        {
          isLoggedIn
          &&
          <>
            {/* History Tab */}
            <ListGroup.Item action
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
            <ListGroup.Item action
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
        }

        {/* If not logged in show login prompt */}
        {
          !isLoggedIn
          &&
          <div className="signin-prompt">
            <p>Can't Find Your Courses?<br/>Sign In to See More</p>
            <Button 
              title="sign in" 
              aria-label="sign in"
              onClick={signin}
            >
              Sign In
            </Button>
          </div>
        }
        </ListGroup>
    </aside>
  )
}