import React from 'react'
import { Button, Popup } from 'semantic-ui-react'

export function StarredButton({ offeringId, position, starredOfferings, starredUpdated, starOffering, unstarOffering }) {  
  const isStarred = starredOfferings.includes(offeringId)
  const handleClick = () => {
    if (isStarred) {
      unstarOffering(offeringId)
    } else {
      starOffering(offeringId)
    }
    // console.log('starred Offerings', util.getStarredOfferingsArray())
  }

  const iconName = isStarred ? 'star' : 'star outline'
  const popupContent = isStarred ? 'Remove from Starred' : 'Add to Starred'

  return (
    <Popup 
      content={popupContent}
      position="right center"
      inverted
      openOnTriggerFocus
      closeOnTriggerBlur
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
      <span tabIndex="-1">
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
          <span tabIndex="-1">
            {isFolded ? <i className="material-icons">expand_more</i> : <i className="material-icons">expand_less</i>} 
          </span>
        </Button>
      }
    />
  )
}