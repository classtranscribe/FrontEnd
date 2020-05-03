import React, { useState, useEffect } from 'react';
import AceEditor from 'react-ace';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';

import MDToolbar from './MDToolbar';

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/theme-xcode";
import "ace-builds/src-min-noconflict/ext-searchbox";
import "ace-builds/src-min-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/snippets/markdown";


export function MarkDownEditorWithRedux({
  text='',
  editorTheme,
  editorFullscreen,
}) {

  const dark = editorTheme === epub.EDITOR_THEME_MONOKAI;

  const [value, setValue] = useState(text);
  const [cursor, setCursor] = useState(null);

  const onChange = (newValue, event) => {
    setValue(newValue)
  };

  useEffect(() => {
    if (value) {
      epub.updateText(value);
    } 
  }, [value]);

  useEffect(() => {
    epub.addEditorFullscreenChangeEventListener();

    return () => {
      epub.removeEditorFullscreenChangeEventListener();
    }
  }, []);

  return (
    <div 
      id="msp-ee-editor" 
      className="msp-ee-editor msp-ee-html-editor ct-a-fade-in" 
      data-editorFullscreen={editorFullscreen}
      data-dark={dark}
    >
      <MDToolbar 
        dark={dark}
        editorFullscreen={editorFullscreen}
      />


      <div className="msp-ee-ace-editor-con">
        <AceEditor focus
          className="msp-ee-ace-editor"
          mode="markdown"
          theme={editorTheme}
          showGutter={false}
          onChange={onChange}
          name="msp-ee-ace-editor"
          editorProps={{ $blockScrolling: true }}
          value={value}
          data-scroll
          width="100%"
          height={editorFullscreen ? `${window.innerHeight - 50 - 10}px` : `${window.innerHeight - 87 - 50}px`}
          wrapEnabled
          enableLiveAutocompletion
          // markers={cursor}
          onCursorChange={(e) => console.log(e.doc.getValue())}
          // onSelection={e => console.log(e.doc)}
          // onSelectionChange={e => console.log(e.doc)}
          fontSize={14}
        />
      </div>
    </div>
  );
}

export const MarkDownEditor = connectWithRedux(
  MarkDownEditorWithRedux,
  [
    'editorTheme',
    'editorFullscreen'
  ]
);
