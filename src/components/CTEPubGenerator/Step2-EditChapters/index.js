import React from 'react';
import { CTEPubConstants as Constants } from '../controllers';
import ChapterNavigator from './ChapterNavigator';
import ChapterEditor from './ChapterEditor';
import Toolbar from './Toolbar';
import './index.scss';

function EditChapters() {
  return (
    <div 
      id={Constants.EditChapterContainerID}
      className="ct-epb step-con ct-a-fade-in"
    >
      <ChapterNavigator />
      <ChapterEditor />
      <Toolbar />
    </div>
  );
}

export default EditChapters;