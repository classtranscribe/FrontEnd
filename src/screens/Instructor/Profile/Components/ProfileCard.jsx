/**
 * Component for Instructor Profile Page
 * - contents instructor info
 */

import React, { useEffect, useState } from 'react'
import { Card } from 'react-bootstrap'
import { handleData } from 'utils'
const profileImg = require('images/icons/profile1.png')

export function ProfileCard({ userInfo, universities }) {
  const [userUni, setUserUni] = useState('Loading...')

  useEffect(() => {
    if (universities.length && userInfo.universityId) {
      setUserUni(() => handleData.find(universities, {id: userInfo.universityId}))
    }
  }, [userInfo, universities])

  return (
    <Card className="ip-profile" border="light">
      <Card.Img className="img" src={profileImg}/>
      <Card.Text className="name">
        {userInfo.fullName}<br/>
        <span>{userUni.name}</span>
      </Card.Text>
    </Card>
  );
}