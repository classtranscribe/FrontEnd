import React from 'react'
import { Card } from 'react-bootstrap'

function Profile(props) {
  return (
    <Card className="ip-profile" border="light">
      <Card.Img className="img" src={require('../../images/icons/profile1.png')}/>
      <Card.Text className="name">
        {props.instructor.name}<p>{props.instructor.university}</p>
      </Card.Text>
    </Card>
  );
}

export default Profile;