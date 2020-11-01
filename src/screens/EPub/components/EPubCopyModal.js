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
import { LanguageConstants } from 'components/CTPlayer';
import { elem } from 'utils';
import { epub, connectWithRedux } from '../controllers';

function EPubCopyModal({ open, onClose, ...props }) {
  const { teal } = useButtonStyles();

  const epubData = props.epub;
  const title = useInput(`Copy of ${epubData.title}`);
  const filename = useInput(`Copy of ${epubData.filename}`);
  const language = useInput(epubData.language);
  const author = useInput(epubData.author);
  const copyChapterStructure = useCheckbox(true);

  const onCopyEPub = () => {
    const newEPubData = {
      ...epubData,
      title: title.value,
      filename: filename.value,
      author: author.value,
      language: language.value
    };
    epub.ctrl.duplicateEPub(newEPubData, copyChapterStructure.checked);
    onClose();
  };

  const langOptions = epub.ctrl.languages.map(
    lang => ({ value: lang, text: LanguageConstants.decode(lang) })
  );

  const isDiffLanguage = language.value !== epubData.language;

  const modalActions = (
    <CTFragment justConEnd alignItCenter padding={[5, 10]}>
      <Button className={teal} variant="contained" onClick={onCopyEPub}>
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
          />
          <CTInput 
            id="ct-epb-author-input"
            label="ePub Author"
            placeholder="ePub Author"
            value={author.value}
            onChange={author.onChange}
            underlined
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
          />
        </CTFormRow>

        <CTFormHeading padding="0" margin={[10, 0]}>Language</CTFormHeading>

        <CTFormHelp title="Copy ePub into a different language">
          When copying this ePub in a different language, 
          you can choose to copy your current chapter structure, 
          but the content will not be translated, 
          and some of the chapter contents might be lost since.
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
  ['epub']
);
