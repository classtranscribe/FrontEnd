import React, { useState, useEffect } from 'react';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils/epub';
import { getAceShortcutHandler } from './ace/ace-shortcut';

import MDTextArea from './MDTextArea';
import MDToolBar from './MDToolBar';
import ActionButtonGroup from './ActionButtonGroup';
import { MarkdownPreviewer } from '../MarkdownPreviewer';


export function MarkdownEditor({
  id = '',
  defaultValue='',
  placeholder='\n\n#### Transcript\n\n',
  height='400px',
  screenshots=[],
  chapterScreenshots=[],
  defaultImage,

  onSave,
  onClose,
}) {

  const [value, setValue] = useState(
    defaultValue.trim()
    ? defaultValue
    : placeholder
  );
  const [ace, setAce] = useState(null);
  const [preview, setPreview] = useState(null);

  const isPreview = Boolean(preview);

  const onChange = newValue => {
    setValue(newValue);
  };

  const onLoad = ace_ => {
    setAce(ace_);
  }

  const handleSave = () => {
    let newText = ace.getValue();
    if (onSave) onSave(newText);
  }

  const openPreview = () => {
    setPreview(epub.markdown2HTML(value));
  }

  const closePreview = () => {
    setPreview(null);
  }

  useEffect(() => {
    if (!isPreview && ace) {
      ace.textInput.focus();
    } 
  }, [preview])

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue])

  return (
    <div className="ee-md-editor-con">
      <div 
        className="ee-md-editor" 
        onKeyDown={getAceShortcutHandler(ace)}
      >
        <MDToolBar
          ace={ace}
          isPreview={isPreview}
          screenshots={screenshots}
          chapterScreenshots={chapterScreenshots}
          defaultImage={defaultImage}
          openPreview={openPreview}
          closePreview={closePreview}
        />

        <div data-scroll className="ee-md-editor-preview" style={{height}}>
          {
            isPreview
            &&
            <MarkdownPreviewer value={preview} className="p-4" />
          }

          <MDTextArea
            id={id}
            value={value}
            height={height}
            onLoad={onLoad}
            onChange={onChange}
            isPreview={isPreview}
          />
        </div>
      </div>

      <ActionButtonGroup
        onSave={handleSave}
        onClose={onClose}
      />
    </div>
  );
}
