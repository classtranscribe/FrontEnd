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
  const [cover, setCover] = useState('');
  const [filename, setFilename] = useState(media.mediaName);
  const [author, setAuthor] = useState('Anonymous');

  const onSaveTitle = value => setTitle(value);
  const onSaveCover = value => setCover(value);
  const onSaveAuthor = value => setAuthor(value);
  const onSaveFilename = value => setFilename(value);

  let screenshots = epub.getAllImagesInChapters(chapters);

  useEffect(() => {
    if (media && media.mediaName) {
      setFilename(media.mediaName);
    }
  }, [media]);

  useEffect(() => {
    setCover(screenshots[0] || '');
  }, [chapters]);

  return (
    <div className="msp-ee-step-con">
      <EpubEditor
        title={title}
        chapters={chapters}
        onSaveTitle={onSaveTitle}
      />
      <Toolbar
        cover={cover}
        title={title}
        author={author}
        filename={filename}
        screenshots={screenshots}
        onSaveCover={onSaveCover}
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
