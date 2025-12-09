import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import {
  CTModal,
  CTFragment,
  useButtonStyles,
  useCTConfirmation,
  CTInput,
  CTCheckbox,
  CTFormRow,
} from 'layout';
import { elem } from 'utils';
import { connectWithRedux } from '../controllers';
import ChapterImage from './ChapterImage';

function EPubFileInfoModal({ showFileSettings, dispatch, epub }) {
  const { teal, danger } = useButtonStyles();
  const [epubData, setEPubData] = useState(epub);
  if (!epubData.condition) {
    setEPubData({ ...epubData, condition: { default: true } })
  }
  if (!('enableGlossary' in epubData)) {
    setEPubData({ ...epubData, enableGlossary: true });
  }
  useEffect(() => {
    // update state everytime onShow, in case the user did not save
    if (showFileSettings) {
      setEPubData(epub);
    }
  }, [showFileSettings]);
  const onClose = () => dispatch({ type: 'epub/setShowFileSettings', payload: false });

  const onInputChange = (attrName) => ({ target: { value } }) =>
    setEPubData({ ...epubData, [attrName]: value });

  const onSaveCover = (newCover) => setEPubData({ ...epubData, cover: newCover });

  const onPublishChange = ({ target: { checked } }) =>
    setEPubData({ ...epubData, isPublished: checked });

  const canSave = epubData.title && epubData.filename && epubData.author;

  const handleSave = () => {
    const newEPubData = { ...epub, ...epubData };
    dispatch({ type: 'epub/updateEPubBasicInfo', payload: newEPubData });
    onClose();
  };

  const handleDelete = () => {
    dispatch({ type: 'epub/deleteEPub', payload: epub.id });
  };

  const delConfirmation = useCTConfirmation('Are you sure to delete this I-Note?', handleDelete);

  let conditions = [];
  for (let i = 0; i < epubData.chapters.length; i += 1) {
    for (let j = 0; j < epubData.chapters[i].condition.length; j += 1) {
      if (conditions.find((e) => e === epubData.chapters[i].condition[j]) === undefined) {
        conditions.push(epubData.chapters[i].condition[j]);
      }
    }
  }

  const modalActions = (
    <CTFragment justConEnd alignItCenter padding={[5, 10]}>
      <Button variant className={danger} onClick={delConfirmation.onOpen}>
        Delete
      </Button>
      <Button disabled={!canSave} className={teal} variant="contained" onClick={handleSave}>
        Done
      </Button>
    </CTFragment>
  );

  return (
    <CTModal
      open={showFileSettings}
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
          screenshots={epub.images}
          onChooseImage={onSaveCover}
          disableDescription
        />

        <CTFormRow>
          <CTInput
            id="ct-epb-title-input"
            label="I-Note Title"
            placeholder="I-Note Title"
            value={epubData.title}
            onChange={onInputChange('title')}
            onReturn={handleSave}
            underlined
            required
          />
          <CTInput
            id="ct-epb-author-input"
            label="I-Note Author"
            placeholder="I-Note Author"
            value={epubData.author}
            onChange={onInputChange('author')}
            onReturn={handleSave}
            underlined
            required
          />
        </CTFormRow>
        <CTFormRow>
          <CTInput
            id="ct-epb-filename-input"
            label="I-Note Filename"
            placeholder="I-Note Filename"
            value={epubData.filename}
            onChange={onInputChange('filename')}
            onReturn={handleSave}
            underlined
            required
          />
        </CTFormRow>
        <CTFormRow>
          <CTCheckbox
            id="ct-epb-is-pub-checkbox"
            label="Publish the I-Note file"
            checked={epubData.isPublished}
            onChange={onPublishChange}
          />
        </CTFormRow>
        {delConfirmation.element}
      </CTFragment>
    </CTModal>
  );
}

export default connectWithRedux(EPubFileInfoModal, ['epub', 'showFileSettings']);
