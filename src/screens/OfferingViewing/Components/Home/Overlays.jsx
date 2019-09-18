import React, { useState } from 'react'
import { util } from 'utils'
import { Button, Popup } from 'semantic-ui-react'

export function StarredButton({ offeringId }) {
  const [isStarred, setIsStarred] = useState(util.isOfferingStarred(offeringId))

  const handleClick = () => {
    if (isStarred) {
      util.unstarOffering(offeringId)
    } else {
      util.starOffering(offeringId)
    }
    setIsStarred(isStarred => !isStarred)
  }

  const iconName = isStarred ? 'star' : 'star outline'
  const popupContent = (isStarred ? 'Remove from Starred' : 'Add to Starred') + ' (In Progress)'

  return (
    <Popup 
      content={popupContent}
      position="right center"
      inverted
      trigger={
        <Button 
          circular compact
          className={`overlay-btn star-btn ${ isStarred ? 'starred-btn' : '' }`} 
          icon={iconName} 
          onClick={handleClick}
        />
      }
    />
  )
}