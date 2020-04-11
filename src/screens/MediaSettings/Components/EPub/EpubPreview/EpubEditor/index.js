import React from 'react'
import { RichTextEditor } from './RichTextEditor'
import { HTMLEditor     } from './HTMLEditor'
import { MarkDownEditor } from './MarkDownEditor'
import { 
  EDITOR_RICHTEXT, 
  EDITOR_HTML, 
  EDITOR_MARKDOWN,
  EDITOR_NONE,
  epub
} from 'screens/MediaSettings/Utils'
import './index.scss'
import './braft-editor.scss'
import './ace-editor.scss'
import './text-preview.scss'

export default function EpubEditor({
  text,
  type,
}) {

  const { content, editorType } = epub.parseText(text, EDITOR_NONE)
  // console.log(content)
  return (
    <div className="w-100 mt-3">
      {
        type === EDITOR_RICHTEXT
        &&
        <RichTextEditor text={content} />
      }
      {
        type === EDITOR_HTML
        &&
        <HTMLEditor text={content} />
      }
      {
        type === EDITOR_MARKDOWN
        &&
        <MarkDownEditor text={content} />
      }
      {
        type === EDITOR_NONE
        &&
        <div 
          className={"ee-preview-text-con ct-a-fade-in " + editorType} 
          dangerouslySetInnerHTML={{__html: content}}
        />
      }
    </div>
  )
}
