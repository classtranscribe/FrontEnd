import React from 'react';
import PropTypes from 'prop-types';
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

function MDToolBar(props) {
  const {
    ace,
    isPreview,
    imageTabs,
    defaultImage,
    openPreview,
    closePreview,
  } = props;

  return (
    <div className="ct-md-toolbar">
      <div className="ct-md-tool-l">
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
        <div className="ct-md-tool-r">
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
            imageTabs={imageTabs}
            defaultImage={defaultImage}
          />
        </div>
      )}
    </div>
  );
}

MDToolBar.propTypes = {
  ace: PropTypes.any.isRequired,
  isPreview: PropTypes.bool,
  imageTabs: InsertMedia.propTypes.imageTabs,
  defaultImage: InsertMedia.propTypes.defaultImage,
  openPreview: PropTypes.func,
  closePreview: PropTypes.func,
};

export default MDToolBar;
