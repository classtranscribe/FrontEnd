/**
 * Offering detail screen for a offering
 * - contains offering info and playlists
 */

import React from 'react'
import { Link } from 'react-router-dom'
import { Icon, Divider } from 'semantic-ui-react';

export default function OfferingDetail({state: { currentOffering, wasOnSearching }, setCurrentOffering}) {
  if (!currentOffering) return null
  const { fullNumber, courseName, termName, 
    section, description, acronym } = currentOffering
    
  return (
    <div className="offering-detail" >
      <div className="goback-container">
        <Link className="del-icon" onClick={() => setCurrentOffering(null, acronym)}>
          <Icon name="chevron left" /> Back to { wasOnSearching ? 'Search Results' : 'Courses'}
        </Link>
      </div>
      <h1>{fullNumber}</h1><br/><br/>
      <h2>
        {courseName}&emsp;
        <span>{termName}&ensp;{section}</span>
      </h2><br/>
      <h5>{description}</h5><br/><br/>
      <Divider />
      <h4>Playlists</h4>
    </div>
  )
}