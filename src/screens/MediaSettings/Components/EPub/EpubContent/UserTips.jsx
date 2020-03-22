import React from 'react'
import { InfoIcon } from '../../../../Instructor/Components'

export function UserTipsForEditing() {
  return (
    <InfoIcon
      content={
        <div>
          <h3>Tips for editing the chapter</h3>
          <h5>What you can edit</h5>
          <ul>
            <li>The title of the chapter.</li>
            <li>The paragraphs of the chapter.</li>
          </ul>
        </div>
      }
    />
  )
}

export function UserTipsForCombining() {
  return (
    <InfoIcon important
      header="Combing Texts"
      content={
        <div>
        After combining, <strong>ONLY</strong> the text will be added to the previous/next chapter, <strong>while the cover image of this chapter will be DISCARDED</strong>.
        </div>
      }
    />
  )
}
