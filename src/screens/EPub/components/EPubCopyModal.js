import React from 'react';
import { Button } from '@material-ui/core';
import {
  useButtonStyles,
  CTModal,
  CTFragment,
  CTInput,
  CTFormRow,
  CTSelect,
  CTFormHelp,
  CTFormHeading,
  CTCheckbox
} from 'layout';
import { useInput, useCheckbox } from 'hooks';
import { LanguageConstants as LConstants } from 'components/CTPlayer';
import { elem } from 'utils';
import { EPubListCtrl } from 'components/CTEPubListScreen/controllers/EPubListController';
import { connectWithRedux } from '../controllers';

function EPubCopyModal({ open, onClose, dispatch, ...props }) {
  const { teal } = useButtonStyles();

  const epubData = props.epub;
  const title = useInput(`Copy of ${epubData.title}`);
  const filename = useInput(`Copy of ${epubData.filename}`);
  const language = useInput(epubData.language);
  const author = useInput(epubData.author);
  const copyChapterStructure = useCheckbox(true);

  const canSave = title.value && filename.value && author.value;

  const onCopyEPub = () => {
    const newEPubData = {
      ...epubData,
      title: title.value,
      filename: filename.value,
      author: author.value,
      language: language.value
    };
    dispatch({ type: 'epub/duplicateEPub', payload: { newData: newEPubData, copyChapterStructure: copyChapterStructure.checked } });
    onClose();
  };
  // NOT IMPLEMENTED
  const languages = EPubListCtrl.getLanguages(props.epub.sourceType, props.media);
  const langOptions = languages.map(lang => ({
    value: lang,
    text: LConstants.decode(lang) + (lang === epubData.language ? ' (current)' : '')
  }));

  const isDiffLanguage = language.value !== epubData.language;

  const modalActions = (
    <CTFragment justConEnd alignItCenter padding={[5, 10]}>
      <Button
        disabled={!canSave}
        className={teal}
        variant="contained"
        onClick={onCopyEPub}
      >
        Done
      </Button>
    </CTFragment>
  );

  return (
    <CTModal
      open={open}
      title="Make a Copy"
      size="sm"
      transition
      withCloseButton
      disableBackdropClick
      onClose={onClose}
      action={modalActions}
    >
      <CTFragment role="form" onSubmit={elem.preventDefault}>
        <CTFormHeading padding="0">File Information</CTFormHeading>
        <CTFormRow>
          <CTInput
            id="ct-epb-title-input"
            label="ePub Title"
            placeholder="ePub Title"
            value={title.value}
            onChange={title.onChange}
            underlined
            required
          />
          <CTInput
            id="ct-epb-author-input"
            label="ePub Author"
            placeholder="ePub Author"
            value={author.value}
            onChange={author.onChange}
            underlined
            required
          />
        </CTFormRow>
        <CTFormRow>
          <CTInput
            id="ct-epb-filename-input"
            label="ePub Filename"
            placeholder="ePub Filename"
            value={filename.value}
            onChange={filename.onChange}
            underlined
            required
          />
        </CTFormRow>

        <CTFormHeading padding="0" margin={[10, 0]}>Language</CTFormHeading>

        <CTFormHelp title="Copy ePub with a different language">
          When copying this ePub with a different language,
          you are able to copy your current chapter structure based on timestamps,
          but the texts will not be translated,
          and some of the chapter contents might be lost.
        </CTFormHelp>

        <CTFormRow>
          <CTSelect
            value={language.value}
            id="ct-epb-lang-select"
            label="ePub Language"
            options={langOptions}
            onChange={language.onChange}
            underlined
          />
        </CTFormRow>

        {
          isDiffLanguage
          &&
          <CTFormRow>
            <CTCheckbox
              label="Copy chapter structure"
              checked={copyChapterStructure.checked}
              onChange={copyChapterStructure.onChange}
              helpText="Initialize new ePub with current chapter structure based on timestamps."
            />
          </CTFormRow>
        }
      </CTFragment>
    </CTModal>
  );
}

export default connectWithRedux(
  EPubCopyModal,
  ['epub', 'media']
);
