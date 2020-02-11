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
            <li>The content of the chapter.</li>
          </ul>
          <h5>When you are editing a paragraph:</h5>
          <ul>
            <li>Hit return to create a new paragraph.</li>
            <li>Use Ctrl + delete to remove current textarea.</li>
          </ul>
        </div>
      }
    />
  )
}

export function UserTipsForCombining() {
  return (
    <InfoIcon
      header="Combing Texts"
      content="After combining, the text of this chapter will be added to the previous/next chapter, while the image will be discarded."
    />
  )
}
