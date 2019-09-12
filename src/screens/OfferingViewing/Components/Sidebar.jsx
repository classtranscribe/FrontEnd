/**
 * Sidebar Component of Student page/OV page
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap'
import { user, util } from 'utils'
import { Icon, Button } from 'semantic-ui-react'

export function Sidebar({state: {displaySideBar}, props: {history}, showSiderBar}) {
  const isLoggedIn = user.isLoggedIn()
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  return (
    <aside className="op-sidebar" style={style} >
      
      <ListGroup defaultActiveKey="courses">
        <ListGroup.Item 
          className="list" action eventKey="courses"
          as={Link} to={util.links.home()}
          title="courses" aria-label="courses"
          onClick={() => showSiderBar(window.innerWidth > 900)}
        >
          <Icon name="book" /> &emsp; Courses
        </ListGroup.Item>
        {
          (isLoggedIn && false) // incompleted feature
          &&
          <>
            <ListGroup.Item 
              className="list" action eventKey="starred"
              as={Link} to={util.links.starred()}
              title="starred" aria-label="starred"
              onClick={() => showSiderBar(window.innerWidth > 900)}
            >
              <Icon name="bookmark" /> &emsp; Starred
            </ListGroup.Item>
            <ListGroup.Item 
              className="list" action eventKey="history" 
              as={Link} to={util.links.home()}
              title="history" aria-label="history"
              onClick={() => showSiderBar(window.innerWidth > 900)}
            >
              <Icon name="history" /> &emsp; History
            </ListGroup.Item>
          </>
        }
        {
          !isLoggedIn
          &&
          <div className="signin-prompt">
            <p>Can't Find Your Courses?<br/>
            Sign In to See More</p>
            <Button 
              title="sign in" aria-label="sign in"
              onClick={() => user.login(history)}
            >
              Sign In
            </Button>
          </div>
        }
        </ListGroup>
    </aside>
  )
}