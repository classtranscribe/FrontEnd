import React, { useEffect } from 'react';
import classNames from 'classnames';
import { RichTextEditor } from './RichTextEditor';
import { HTMLEditor     } from './HTMLEditor';
import { MarkDownEditor } from './MarkDownEditor';
import { 
  EDITOR_RICHTEXT, 
  EDITOR_HTML, 
  EDITOR_MARKDOWN,
  EDITOR_DISPLAY,
  epub
} from 'screens/MediaSettings/Utils';
import './index.scss';
import './braft-editor.scss';
import './ace-editor.scss';
import './text-preview.scss';

export default function EpubEditor({
  text,
  type,
  description,
  title,
}) {
  const { previewHTML, content } = epub.chapterToPreviewHTML(text);
  

  let previewClass = classNames('ee-preview-text-con ct-a-fade-in', {
    description: description
  });

  useEffect(() => {
    let editorEl = document.getElementById('msp-ee-editor');
    if (editorEl) {
      editorEl.scrollIntoView({ block: 'center' });
    }
  }, [type]);

  // console.log(content)
  return (
    <div className="w-100">
      {
        type === EDITOR_RICHTEXT
        &&
        <RichTextEditor title={title} text={content} />
      }
      {
        type === EDITOR_HTML
        &&
        <HTMLEditor title={title} text={content} />
      }
      {
        type === EDITOR_MARKDOWN
        &&
        <MarkDownEditor title={title} text={content} />
      }
      {
        (type === EDITOR_DISPLAY && previewHTML)
        &&
        <div data-scroll
          className={previewClass}
          dangerouslySetInnerHTML={{__html: previewHTML}}
        />
      }
    </div>
  );
}
