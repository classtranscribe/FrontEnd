import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import {
  CTModal,
  CTFragment,
  useButtonStyles,
  useCTConfirmation,
  CTInput,
  CTCheckbox,
  CTFormRow
} from 'layout';
import { elem } from 'utils';
import { connectWithRedux } from '../controllers';
import ChapterImage from './ChapterImage';

function EPubFileInfoModal({ showFileSettings, dispatch, epub }) {
  const { teal, danger } = useButtonStyles();
  const [epubData, setEPubData] = useState(epub);
  if (!epubData.condition) {
    epubData.condition = {'default':true};
  }
  useEffect(() => {
    // update state everytime onShow, in case the user did not save
    if(showFileSettings) {
      setEPubData(epub)
    }
  }, [showFileSettings])
  const onClose = () => dispatch({ type: 'epub/setShowFileSettings', payload: false });

  const onInputChange = (attrName) => ({ target: { value } }) =>
    setEPubData({ ...epubData, [attrName]: value });

  const onSaveCover = (newCover) =>
    setEPubData({ ...epubData, cover: newCover });

  const onPublishChange = ({ target: { checked } }) =>
    setEPubData({ ...epubData, isPublished: checked });
  
  const onHeaderChange = ({ target: { checked } }) =>
  setEPubData({ ...epubData, isH4: checked });

  const onConditionChange = ({target:{id, checked}}) => {
    epubData.condition[id] = checked;
    setEPubData({...epubData});
  }

  const canSave = epubData.title && epubData.filename && epubData.author;

  const handleSave = () => {
    const newEPubData = { ...epub, ...epubData };
    dispatch({ type: 'epub/updateEPubBasicInfo', payload: newEPubData });
    onClose();
  };

  const handleDelete = () => {
    dispatch({ type: 'epub/deleteEPub', payload: epub.id });
  };

  const delConfirmation = useCTConfirmation('Are you sure to delete this ePub?', handleDelete);

  let conditions = [];
  for (let i = 0; i < epubData.chapters.length; i+=1) {
    for (let j = 0; j < epubData.chapters[i].condition.length; j += 1) {
      if (conditions.find(e => e === epubData.chapters[i].condition[j]) === undefined) {
        conditions.push(epubData.chapters[i].condition[j]);
      }
    }
  }

  const modalActions = (
    <CTFragment justConEnd alignItCenter padding={[5, 10]}>
      <Button
        variant
        className={danger}
        onClick={delConfirmation.onOpen}
      >
        Delete
      </Button>
      <Button
        disabled={!canSave}
        className={teal}
        variant="contained"
        onClick={handleSave}
      >
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
            label="ePub Title"
            placeholder="ePub Title"
            value={epubData.title}
            onChange={onInputChange('title')}
            onReturn={handleSave}
            underlined
            required
          />
          <CTInput
            id="ct-epb-author-input"
            label="ePub Author"
            placeholder="ePub Author"
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
            label="ePub Filename"
            placeholder="ePub Filename"
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
            label="Publish the ePub file"
            checked={epubData.isPublished}
            onChange={onPublishChange}
          />
        </CTFormRow>
        <CTFormRow>
          <CTCheckbox
            id="ct-epb-is-pub-checkbox"
            label="Enable future merge of ePubs"
            checked={epubData.isH4}
            onChange={onHeaderChange}
          />
        </CTFormRow>
        <CTFormRow>
          {conditions.map((data, index) => {
                  return (
                    <CTCheckbox id={data} label={data} checked={epubData.condition[data]} onChange={onConditionChange} />
                  );
                })}
        </CTFormRow>
        {delConfirmation.element}
      </CTFragment>
    </CTModal>
  );
}

export default connectWithRedux(
  EPubFileInfoModal,
  ['epub', 'showFileSettings']
);
