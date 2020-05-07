import React from 'react';
import './index.scss';

import ChapterEditor from './ChapterEditor';
import Toolbar from './Toolbar';

function EditChapters() {
  return (
    <div 
      id="msp-ee-ech-con"
      className="msp-ee-ech-con ct-a-fade-in"
    >
      <ChapterEditor />
      <Toolbar />
    </div>
  );
}

export default EditChapters;
