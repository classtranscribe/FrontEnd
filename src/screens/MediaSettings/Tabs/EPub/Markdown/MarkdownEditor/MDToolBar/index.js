import React from 'react';
import { Button } from 'pico-ui';
import './index.scss';

import HeaderTextTrigger from './HeaderTextTrigger';
import BoldTextTrigger from './BoldTextTrigger';
import ItalicTextTrigger from './ItalicTextTrigger';
import QuoteTrigger from './QuoteTrigger';
import CodeTrigger from './CodeTrigger';
import BulletedListTrigger from './BulletedListTrigger';
import NumberedListTrigger from './NumberedListTrigger';
import InsertLinkTrigger from './InsertLinkTrigger';
import InsertMedia from './InsertMedia';

function MDToolBar({
  ace,
  isPreview,
  screenshots,
  chapterScreenshots,
  defaultImage,

  openPreview,
  closePreview,
}) {
  return (
    <div className="ee-md-toolbar">
      <div className="ee-md-tool-l">
        <Button.Group>
          <Button
            compact
            color={isPreview ? 'transparent teal' : 'teal'}
            text="Edit"
            onClick={closePreview}
          />

          <Button
            compact
            color={!isPreview ? 'transparent teal' : 'teal'}
            text="Preview"
            onClick={openPreview}
          />
        </Button.Group>
      </div>

      {!isPreview && (
        <div className="ee-md-tool-r">
          <HeaderTextTrigger ace={ace} />
          <BoldTextTrigger ace={ace} />
          <ItalicTextTrigger ace={ace} />
          <QuoteTrigger ace={ace} />
          <CodeTrigger ace={ace} />
          <BulletedListTrigger ace={ace} />
          <NumberedListTrigger ace={ace} />

          <InsertLinkTrigger ace={ace} />
          <InsertMedia
            ace={ace}
            screenshots={screenshots}
            chapterScreenshots={chapterScreenshots}
            defaultImage={defaultImage}
          />
        </div>
      )}
    </div>
  );
}

export default MDToolBar;
