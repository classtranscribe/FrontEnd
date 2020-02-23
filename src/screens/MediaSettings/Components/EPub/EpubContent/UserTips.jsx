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
          <h5>When you are editing a paragraph:</h5>
          <ul>
            <li>Hit return to add a new paragraph after this paragraph.</li>
            <li>Use <kbd>Ctrl + Shift + delete</kbd> to remove current paragraph.</li>
            <li>Hit <kbd>delete</kbd> in an empty paragraph to remove this paragraph.</li>
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
