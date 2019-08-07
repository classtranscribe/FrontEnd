/**
 * Component for Instructor Profile Page
 * - contents instructor info
 */

import React from 'react'
import { Card } from 'react-bootstrap'
const profileImg = require('images/icons/profile1.png')

export function ProfileCard({ userInfo, university }) {
  return (
    <Card className="ip-profile" border="light">
      <Card.Img className="img" src={profileImg}/>
      <Card.Text className="name">
        {userInfo.fullName}<br/>
        <span>{university.name}</span>
      </Card.Text>
    </Card>
  );
}