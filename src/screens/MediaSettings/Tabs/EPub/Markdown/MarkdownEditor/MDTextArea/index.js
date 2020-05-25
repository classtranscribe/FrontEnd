import React from 'react';
import classNames from 'classnames';
import AceEditor from 'react-ace';
import './index.scss';

import 'ace-builds/src-noconflict/theme-xcode';
// import "ace-builds/src-noconflict/theme-github";
// import "ace-builds/src-noconflict/theme-monokai";
import 'ace-builds/src-min-noconflict/ext-searchbox';
import 'ace-builds/src-min-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/mode-markdown';
import 'ace-builds/src-noconflict/snippets/markdown';

function AceTextArea({
  id = '',
  value = '',
  height = '400px',
  onLoad,
  onFocus,
  onChange,
  onCursorChange,
  isPreview = false,
}) {
  const style = classNames('ee-md-textarea-con', {
    preview: isPreview,
  });

  return (
    <div className={style}>
      <AceEditor
        focus
        wrapEnabled
        highlightActiveLine
        enableLiveAutocompletion
        enableBasicAutocompletion
        className="ee-md-textarea"
        showGutter={false}
        name={`ace-md-${id}`}
        mode="markdown"
        theme="xcode"
        value={value}
        cursorStart={0}
        fontSize={13}
        width="100%"
        height={height}
        onLoad={onLoad}
        onFocus={onFocus}
        onChange={onChange}
        onCursorChange={onCursorChange}
        // onSelection={e => console.log(e.doc)}
        // onSelectionChange={e => console.log(e.doc)}
      />
    </div>
  );
}

export default AceTextArea;
