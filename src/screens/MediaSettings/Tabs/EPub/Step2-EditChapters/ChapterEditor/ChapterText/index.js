import React, { useState, useEffect } from 'react';
import {
  MarkdownPreviewer,
  MarkdownEditor
} from '../../../Markdown';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils/epub';
import { Popup } from 'semantic-ui-react';
import { util } from 'utils';

function ChapterText({
  text = '',
  id = '',
  chapter,
  onSaveText,
  screenshots,
  chapterScreenshots,
}) {

  const [editing, setEditing] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 13 || keyCode === 32) {
      startEditing();
    }
  }

  const onSave = newText => {
    if (onSaveText) onSaveText(newText);
    closeEditing();
  }

  const { content } = epub.parseText(text);
  const { image } = chapter;

  const isNotEmpty = Boolean(content.trim());

  useEffect(() => {
    if (editing) {
      setEditing(false);
    }
  }, [chapter]);

  useEffect(() => {
    if (editing) {
      util.elem.scrollIntoCenter(id);
    }
  }, [editing])

  return (
    <div id={id} className="ee-ech-ch-text-con">
      {
        editing
        ?
        <div className="w-100 mb-4">
          <MarkdownEditor
            height='300px'
            id={'md-editor' + id}
            defaultValue={content}
            onSave={onSave}
            onClose={closeEditing}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
            defaultImage={image}
          />
        </div>
        :
        <Popup inverted basic
          openOnTriggerFocus
          openOnTriggerClick={false}
          openOnTriggerMouseEnter
          closeOnTriggerMouseLeave
          closeOnTriggerBlur
          content="Click to Edit"
          position="bottom center"
          disabled={!isNotEmpty}
          trigger={
            <div
              className="ee-ech-ch-text"
              tabIndex={0}
              onClick={startEditing}
              onKeyDown={handleKeyDown}
            >
              {
                isNotEmpty
                ?
                <MarkdownPreviewer value={text} />
                :
                <div className="text-muted">Click to add content</div>
              }
            </div>
          }
        />
      }
    </div>
  );
}

export default ChapterText;
