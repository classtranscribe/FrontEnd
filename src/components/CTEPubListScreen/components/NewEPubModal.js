import React from 'react';
import cx from 'classnames';
import { Button } from '@material-ui/core';
import {
  CTModal,
  CTFragment,
  CTInput,
  CTSelect,
  CTFormRow,
  useButtonStyles
} from 'layout';
import { useInput } from 'hooks';
import { elem } from 'utils/use-elem';
import { LanguageConstants } from '../../CTPlayer';

function NewEPubModal({
  open,
  onClose,
  onCreate,
  languages = [],
  defaultTitle
}) {
  const btnStyles = useButtonStyles();
  const title = useInput(defaultTitle);
  const language = useInput(LanguageConstants.English);

  const langOptions = languages.map(
    lang => ({ value: lang, text: LanguageConstants.decode(lang) })
  );

  const handleCreate = () => {
    if (typeof onCreate === 'function') {
      onCreate({
        title: title.value,
        language: language.value
      });

      if (typeof onClose === 'function') {
        onClose();
      }
    }
  }

  const actionElement = (
    <CTFragment justConEnd className="pb-2 pr-2">
      <Button
        className={cx(btnStyles.teal, 'mr-2')}
        onClick={handleCreate}
        variant="contained"
        disabled={!title.value}
      >
        Create
      </Button>
      <Button className={btnStyles.tealLink} onClick={onClose}>
        Cancel
      </Button>
    </CTFragment>
  );

  return (
    <CTModal
      open={open}
      title="CREATE NEW I-Note"
      onClose={onClose}
      transition
      action={actionElement}
    >
      <CTFragment dFlexCol padding={[0, 10]} onSubmit={elem.preventDefault}>
        <CTFormRow>
          <CTInput
            id="ct-epb-title-input"
            label="I-Note Title"
            value={title.value}
            placeholder="I-Note Title ..."
            onChange={title.onChange}
            underlined
            autoFocus
            required
          />
        </CTFormRow>

        <CTFormRow>
          <CTSelect 
            id="ct-epb-lang-select"
            label="I-Note Language"
            value={language.value}
            options={langOptions}
            onChange={language.onChange}
            required
            underlined
          />
        </CTFormRow>
      </CTFragment>
    </CTModal>
  );
}

export default NewEPubModal;
