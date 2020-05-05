import React, { useState, useEffect } from 'react';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import './index.scss';

import EpubEditor from './EpubEditor'
import Toolbar from './Toolbar';

function EpubDownloader({
  media,
  chapters,
}) {

  const [title, setTitle] = useState(media.mediaName);
  const [filename, setFilename] = useState(media.mediaName);
  const [author, setAuthor] = useState('Anonymous');

  const onSaveTitle = value => setTitle(value);
  const onSaveAuthor = value => setAuthor(value);
  const onSaveFilename = value => setFilename(value);

  useEffect(() => {
    if (media && media.mediaName) {
      setFilename(media.mediaName);
    }
  }, [media]);

  return (
    <div className="msp-ee-step-con">
      <EpubEditor
        title={title}
        chapters={chapters}
        onSaveTitle={onSaveTitle}
      />
      <Toolbar
        title={title}
        author={author}
        filename={filename}
        onSaveAuthor={onSaveAuthor}
        onSaveFilename={onSaveFilename}
      />
    </div>
  );
}

export default connectWithRedux(
  EpubDownloader,
  ['chapters'],
  [],
  ['media']
);
