import React, { /** useState, useEffect */ } from 'react';
import _ from 'lodash';
import classNames from 'classnames';
// import { Button } from 'pico-ui';

import EpubEditor from '../EpubEditor';
import './index.scss';
import { epub } from 'screens/MediaSettings/Utils';

// import { epub } from 'screens/MediaSettings/Utils/epub';

const ChapterView = ({
  txtEditor,
  chapter,
  shadow=false,
  round=false,
}) => {
  const { text } = chapter;

  const style = classNames("msp-e-view ct-a-fade-in", {
    shadow, round,
    editor: txtEditor !== epub.EDITOR_DISPLAY
  });

  return (
    <div className={style} data-scroll>
      <EpubEditor 
        title="ePub Content Editor"
        text={text}
        type={txtEditor}
      />
    </div>
  );
}

export default ChapterView;