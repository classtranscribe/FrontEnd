import React from 'react'
import { RichTextEditor } from './RichTextEditor'
import { HTMLEditor     } from './HTMLEditor'
import { MarkDownEditor } from './MarkDownEditor'
import { 
  EDITOR_RICHTEXT, 
  EDITOR_HTML, 
  EDITOR_MARKDOWN,
  EDITOR_NONE
} from 'screens/MediaSettings/Utils'
import './index.scss'
import './braft-editor.scss'
import './ace-editor.scss'

export default function EpubEditor({
  text,
  type,
}) {
  return (
    <div className="w-100 mt-3">
      {
        type === EDITOR_RICHTEXT
        &&
        <RichTextEditor text={text} />
      }
      {
        type === EDITOR_HTML
        &&
        <HTMLEditor text={text} />
      }
      {
        type === EDITOR_MARKDOWN
        &&
        <MarkDownEditor text={text} />
      }
      {
        type === EDITOR_NONE
        &&
        <div className="msp-e-v-text ct-a-fade-in" dangerouslySetInnerHTML={{__html: text}} />
      }
    </div>
  )
}
