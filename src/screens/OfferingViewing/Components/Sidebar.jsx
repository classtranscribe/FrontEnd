import React from 'react'
import { Link } from 'react-router-dom'
import { ListGroup } from 'react-bootstrap';
import { user, util } from '../../../util';
import { Icon } from 'semantic-ui-react';

export function Sidebar({state: {displaySideBar}}) {
  const isLoggedIn = user.isLoggedIn()
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  return (
    <div className="op-sidebar" style={style}>
      <ListGroup>
        <ListGroup.Item 
          as={Link} 
          className="list" 
          title="courses" aria-label="courses"
          to={util.links.studentHome()}
        >
          <Icon name="book" /> Courses
        </ListGroup.Item>
        <ListGroup.Item 
          as={Link} 
          className="list" 
          title="starred" aria-label="starred"
          to={util.links.studentStarred()}
        >
          <Icon name="bookmark" /> Starred
        </ListGroup.Item>
        <ListGroup.Item className="list" title="history">
          <Icon name="history" /> History
        </ListGroup.Item>
      </ListGroup>
    </div>
  )
}