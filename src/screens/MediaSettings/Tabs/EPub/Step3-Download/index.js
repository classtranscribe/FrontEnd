import React, { useState, useEffect } from 'react';
import { epub, connectWithRedux } from 'screens/MediaSettings/controllers/epub';
import './index.scss';

import EpubEditor from './EpubEditor';
import Toolbar from './Toolbar';

function EpubDownloader({ media, chapters }) {
  const [title, setTitle] = useState(media.mediaName);
  const [cover, setCover] = useState('');
  const [filename, setFilename] = useState(media.mediaName);
  const [author, setAuthor] = useState('Anonymous');

  const onSaveTitle = ({ target: { value }}) => setTitle(value);
  const onSaveCover = ({ target: { value }}) => setCover(value);
  const onSaveAuthor = ({ target: { value }}) => setAuthor(value);
  const onSaveFilename = ({ target: { value }}) => setFilename(value);

  const screenshots = epub.getAllImagesInChapters(chapters);

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
      <EpubEditor title={title} chapters={chapters} onSaveTitle={onSaveTitle} />
      <Toolbar
        cover={cover}
        title={title}
        author={author}
        filename={filename}
        screenshots={screenshots}
        onSaveTitle={onSaveTitle}
        onSaveCover={onSaveCover}
        onSaveAuthor={onSaveAuthor}
        onSaveFilename={onSaveFilename}
      />
    </div>
  );
}

export default connectWithRedux(EpubDownloader, ['chapters'], [], ['media']);
