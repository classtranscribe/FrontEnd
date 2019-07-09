/**
 * Component for Instructor Profile Page
 * - contents instructor info
 */

import React from 'react'
import { Card } from 'react-bootstrap'
const profileImg = require('../../../../images/icons/profile1.png')

export function ProfileCard(props) {
  return (
    <Card className="ip-profile" border="light">
      <Card.Img className="img" src={profileImg}/>
      <Card.Text className="name">
        {props.instructor.name}<br/>
        <span>University of Illinois at Urbana Champaign</span>
      </Card.Text>
    </Card>
  );
}