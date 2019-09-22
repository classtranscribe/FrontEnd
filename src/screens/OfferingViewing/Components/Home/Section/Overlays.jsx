import React, { useState } from 'react'
import { util } from 'utils'
import { Button, Popup } from 'semantic-ui-react'

export function StarredButton({ fullCourse, position, starOffering, unstarOffering }) {
  const [isStarred, setIsStarred] = useState(util.isOfferingStarred(fullCourse.id))

  const handleClick = () => {
    if (isStarred) {
      util.unstarOffering(fullCourse.id)
      unstarOffering(fullCourse.id)
    } else {
      util.starOffering(fullCourse)
      starOffering(fullCourse)
    }
    console.log(util.getStarredOfferingsArray())
    setIsStarred(isStarred => !isStarred)
  }

  const iconName = isStarred ? 'star' : 'star outline'
  const popupContent = isStarred ? 'Remove from Starred' : 'Add to Starred'

  return (
    <Popup 
      content={popupContent}
      position="right center"
      inverted
      trigger={
        <Button 
          circular compact
          className={`overlay-btn star-btn-${position} ${ isStarred ? 'starred-btn' : '' }`} 
          icon={iconName} 
          onClick={handleClick}
        />
      }
    />
  )
}