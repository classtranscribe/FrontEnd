import React, { useState } from 'react';
import { Button } from '@material-ui/core';
import { CTModal, CTFragment, useButtonStyles, CTInput, CTCheckbox, CTFormRow } from 'layout';
import { elem } from 'utils';
import { epub, connectWithRedux } from '../controllers';
import ChapterImage from './ChapterImage';

function EPubFileInfoModal({ open, onClose, ...props }) {
  const { teal } = useButtonStyles();

  const [epubData, setEPubData] = useState(props.epub);

  const onInputChange = (attrName) => ({ target: { value }}) =>
    setEPubData({ ...epubData, [attrName]: value });

  const onSaveCover = (newCover) => 
    setEPubData({ ...epubData, cover: newCover });

  const onPublishChange = ({ target: { checked } }) => 
    setEPubData({ ...epubData, isPublished: checked });

  const onSaveChanges = () => {
    const newEPubData = { ...epub.state.epub, ...epubData };
    epub.state.setEPub(newEPubData);
    epub.data.setEPubInfo(newEPubData);
    onClose();
  };

  const modalActions = (
    <CTFragment justConEnd alignItCenter padding={[5, 10]}>
      <Button className={teal} variant="contained" onClick={onSaveChanges}>
        Done
      </Button>
    </CTFragment>
  );

  return (
    <CTModal
      open={open}
      title="File Settings"
      size="sm"
      transition
      withCloseButton
      disableBackdropClick
      onClose={onClose}
      action={modalActions}
    >
      <CTFragment role="form" onSubmit={elem.preventDefault}>
        <ChapterImage 
          id="ct-epb-cover"
          image={epubData.cover}
          screenshots={epub.data.data.images}
          onChooseImage={onSaveCover}
          disableDescription
        />

        <CTFormRow>
          <CTInput 
            id="ct-epb-title-input"
            label="ePub Title"
            placeholder="ePub Title"
            value={epubData.title}
            onChange={onInputChange('title')}
            underlined
          />
          <CTInput 
            id="ct-epb-author-input"
            label="ePub Author"
            placeholder="ePub Author"
            value={epubData.author}
            onChange={onInputChange('author')}
            underlined
          />
        </CTFormRow>
        <CTFormRow>
          <CTInput 
            id="ct-epb-filename-input"
            label="ePub Filename"
            placeholder="ePub Filename"
            value={epubData.filename}
            onChange={onInputChange('filename')}
            underlined
          />
        </CTFormRow>
        <CTFormRow>
          <CTCheckbox
            id="ct-epb-is-pub-checkbox"
            label="Publish the ePub file"
            checked={epubData.isPublished}
            onChange={onPublishChange}
          />
        </CTFormRow>
      </CTFragment>
    </CTModal>
  );
}

export default connectWithRedux(
  EPubFileInfoModal,
  ['epub']
);
