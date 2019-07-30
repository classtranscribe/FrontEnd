/**
 * Sidebar Component of Student page/OV page
 */
import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap';
import { user, util } from 'utils';
import { Icon, Button } from 'semantic-ui-react';

export function Sidebar({state: {displaySideBar}}) {
  const isLoggedIn = user.isLoggedIn()
  const home = isLoggedIn ? util.links.studentHome() : util.links.home()
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  return (
    <div className="op-sidebar" style={style} >
      <ListGroup defaultActiveKey="courses">
        <ListGroup.Item 
          className="list" action eventKey="courses"
          as={Link} to={home}
          title="courses" aria-label="courses"
        >
          <Icon name="book" /> &emsp; Courses
        </ListGroup.Item>
        {
          isLoggedIn 
          &&
          <>
            <ListGroup.Item 
              className="list" action eventKey="starred"
              as={Link} to={util.links.studentStarred()}
              title="starred" aria-label="starred"
            >
              <Icon name="bookmark" /> &emsp; Starred
            </ListGroup.Item>
            <ListGroup.Item className="list" title="history" as={Link}  action eventKey="history">
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
              as={Link} to={util.links.studentHome()}
            >
              Sign In
            </Button>
          </div>
        }
        </ListGroup>
    </div>
  )
}