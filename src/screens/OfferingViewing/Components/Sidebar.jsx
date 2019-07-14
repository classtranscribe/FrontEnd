import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup, Button } from 'react-bootstrap';
import { user, util } from '../../../util';
import { Icon } from 'semantic-ui-react';

export function Sidebar({state: {displaySideBar}, showSiderBar}) {
  const isLoggedIn = user.isLoggedIn()
  const home = isLoggedIn ? util.links.studentHome() : util.links.home()
  const search = isLoggedIn ? util.links.studentSearch() : util.links.search()
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  // onMouseLeave={showSiderBar}
  return (
    <div className="op-sidebar" style={style} >
      <ListGroup>
        <ListGroup.Item 
          as={Link} 
          className="list" 
          title="courses" aria-label="courses"
          to={home}
        >
          <Icon name="book" /> &emsp; Courses
        </ListGroup.Item>
        {
          isLoggedIn 
          &&
          <>
            <ListGroup.Item 
              as={Link} 
              className="list" 
              title="starred" aria-label="starred"
              to={util.links.studentStarred()}
            >
              <Icon name="bookmark" /> &emsp; Starred
            </ListGroup.Item>
            <ListGroup.Item className="list" title="history">
              <Icon name="history" /> &emsp; History
            </ListGroup.Item>
          </>
        }
        </ListGroup>
    </div>
  )
}