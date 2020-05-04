import React from 'react';
import { connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import './index.scss';

import ChapterInfo from './ChapterInfo';

function ChapterEditor({
  currChapter
}) {
  return (
    <div data-scroll 
      id="ee-ech-ch"
      className="ee-ech-ch-con"
    >
      <div className="ee-ech-ch">
        <ChapterInfo chapter={currChapter} />
      </div>
    </div>
  );
}

export default connectWithRedux(
  ChapterEditor,
  ['currChapter']
);
