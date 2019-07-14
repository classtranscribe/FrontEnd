import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Divider } from 'semantic-ui-react';

export default function OfferingDetail({state: {currentOffering}, setCurrentOffering}) {
  if (!currentOffering) return null
  const { fullNumber, courseName, term, section, description } = currentOffering
  return (
    <div className="offering-detail" >
      <div className="d-flex justify-content-end w-100">
        <Link className="del-icon" onClick={() => setCurrentOffering(null)}>
          <Icon name="chevron left" /> Back to Courses
        </Link>
      </div>
      <h1>{fullNumber}</h1><br/><br/>
      <h2>
        {courseName}&emsp;
        <span>{term.name}&ensp;{section}</span>
      </h2><br/>
      <h5>{description}</h5><br/><br/>
      <Divider />
      <h4>Playlists</h4>
    </div>
  )
}