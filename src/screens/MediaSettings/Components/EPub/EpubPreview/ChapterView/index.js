import React, { /** useState, useEffect */ } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
// import { Button } from 'pico-ui';

import EpubEditor from '../EpubEditor';
import './index.scss';

// import { epub } from 'screens/MediaSettings/Utils/epub';

const ChapterView = ({
  txtEditor,
  // adEditor,
  chapter,
  shadow=false,
  round=false,
  // contentEditable=false,
}) => {
  const { text, /** title='', id */ } = chapter;

  // const [titleInput, setTitleInput] = useState(title);

  // const handleTitleInput = e => {
  //   setTitleInput(e.target.value);
  // }

  // const saveTitle = () => {
  //   let chapterIndex = _.findIndex(epub.chapters, { id });
  //   epub.handleChapterTitleChange(chapterIndex, titleInput);
  // }

  // const handleTitleKeyDown = ({ keyCode, target }) => {
  //   if (keyCode === 13) {
  //     saveTitle();
  //     target.blur();
  //   }
  // }

  // useEffect(() => {
  //   setTitleInput(title);
  // }, [title]);

  // const isEditingTitle = titleInput !== title;
  const style = classNames("msp-e-view ct-a-fade-in", {shadow, round});

  return (
    <div className={style}>
      <EpubEditor 
        title="ePub Content Editor"
        text={text}
        type={txtEditor}
      />
    </div>
  );
}

export default ChapterView;