import React, { useState, useEffect } from 'react';
import cx from 'classnames';
import { Popup } from 'semantic-ui-react';
import { elem } from 'utils/use-elem';
import { MDPreviewer, MDEditor } from '../Markdown';
import ChapterEditButton from '../ChapterEditButton';
import './index.scss';

export function ChapterText({
  text = '',
  id = '',
  className,
  chapter,
  onSaveText,
  addNewText = 'Click to add content',
  screenshots,
  chapterScreenshots,
  attached
}) {
  const [editing, setEditing] = useState(false);

  const startEditing = () => setEditing(true);
  const closeEditing = () => setEditing(false);

  const onSave = (newText) => {
    if (typeof onSaveText === 'function') {
      onSaveText(newText);
    }
    closeEditing();
  };

  const { image } = chapter || {};

  const isNotEmpty = Boolean(text.trim());

  useEffect(() => {
    if (editing) {
      setEditing(false);
    }
  }, [chapter]);

  useEffect(() => {
    if (editing) {
      elem.scrollIntoCenter(id);
    }
  }, [editing]);

  const txtConClasses = cx('ct-epb', 'ch-text-con', { attached })

  return (
    <div id={id} className={txtConClasses}>
      {editing ? (
        <div className="w-100 mb-4">
          <MDEditor
            height="300px"
            id={`md-editor-${id}`}
            defaultValue={text}
            onSave={onSave}
            onClose={closeEditing}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
            defaultImage={image}
          />
        </div>
      ) : (
        <Popup
          inverted
          basic
          openOnTriggerFocus
          openOnTriggerClick={false}
          openOnTriggerMouseEnter
          closeOnTriggerMouseLeave
          closeOnTriggerBlur
          content="Click to edit"
          position="top center"
          disabled={!isNotEmpty}
          trigger={
            <ChapterEditButton 
              onClick={startEditing} 
              muted={!isNotEmpty} 
              attached={attached}
            >
              {isNotEmpty ? <MDPreviewer value={text} /> : addNewText}
            </ChapterEditButton>
          }
        />
      )}
    </div>
  );
}
