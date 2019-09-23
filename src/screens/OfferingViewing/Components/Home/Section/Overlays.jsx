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
          aria-label="Star Button"
        />
      }
    />
  )
}

export function SectionShowMoreButton({ shouldDisplay, showAll, handleShowAll }) {
  if (!shouldDisplay) return null
  const content = showAll ? 'Collapse' : 'Show More'

  return (
    <Button type="offering-show-all-btn" compact onClick={handleShowAll} aria-label={content}>
      <span tabindex="-1">
        {content}
      </span>
    </Button>
  )
}

export function SectionFoldButton({ shouldDisplay, isFolded, handleFold }) {
  if (!shouldDisplay) return null
  const content = isFolded ? 'Unfold' : 'Fold'

  return (
    <Popup 
      content={content}
      position="left center"
      inverted
      trigger={
        <Button type="offering-close-btn" compact onClick={handleFold} aria-label={content}>
          <span tabindex="-1">
            {isFolded ? <i class="material-icons">expand_more</i> : <i class="material-icons">expand_less</i>} 
          </span>
        </Button>
      }
    />
  )
}