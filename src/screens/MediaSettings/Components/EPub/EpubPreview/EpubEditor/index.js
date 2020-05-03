import React, { useEffect } from 'react';
import classNames from 'classnames';
import { RichTextEditor } from './RichTextEditor';
import { HTMLEditor     } from './HTMLEditor';
import { MarkDownEditor } from './MarkDownEditor';
import { 
  epub
} from 'screens/MediaSettings/Utils/epub';
import './index.scss';
import './braft-editor.scss';
import './ace-editor.scss';
import './text-preview.scss';
import { util } from 'utils';

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
    util.elem.scrollIntoCenter('msp-ee-editor');
  }, [type]);

  return (
    <div className="w-100 h-100">
      {
        type === epub.EDITOR_RICHTEXT
        &&
        <RichTextEditor title={title} text={content} />
      }
      {
        type === epub.EDITOR_HTML
        &&
        <HTMLEditor title={title} text={content} />
      }
      {
        type === epub.EDITOR_MARKDOWN
        &&
        <MarkDownEditor title={title} text={content} />
      }
      {
        (type === epub.EDITOR_DISPLAY && previewHTML)
        &&
        <div data-scroll
          className={previewClass}
          dangerouslySetInnerHTML={{__html: previewHTML}}
        />
      }
    </div>
  );
}
