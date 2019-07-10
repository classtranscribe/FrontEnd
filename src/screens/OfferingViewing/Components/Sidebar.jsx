import React from 'react'
import { ListGroup } from 'react-bootstrap';
import { user } from '../../../util';
import { Icon } from 'semantic-ui-react';

export function Sidebar({state: {displaySideBar}}) {
  const isLoggedIn = user.isLoggedIn()
  const style = {marginLeft: displaySideBar ? '0' : '-20rem'}
  return (
    <div className="op-sidebar" style={style}>
      <ListGroup>
        <ListGroup.Item className="list" title="courses">
          <Icon name="book" /> Courses
        </ListGroup.Item>
        <ListGroup.Item className="list" title="starred">
          <Icon name="bookmark" /> Starred
        </ListGroup.Item>
        <ListGroup.Item className="list" title="history">
          <Icon name="history" /> History
        </ListGroup.Item>
      </ListGroup>
    </div>
  )
}