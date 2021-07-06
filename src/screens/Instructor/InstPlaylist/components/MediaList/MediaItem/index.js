import React, { useState, useEffect } from 'react';
import { Accordion, AccordionSummary, AccordionDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiCheckbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { CTPopoverLabel, CTCheckbox, CTText } from 'layout';

import MediaName from './MediaName';
import MediaItemActions from './MediaItemActions';

function MediaItem({
  media,
  selecting,
  filtering,
  handleSelect,
  isSelected,
  handleExpand,
  isExpanded,
  dispatch,
}) {
  const { mediaName, id, isUnavailable } = media;
  const selected = isSelected(media);
  const expanded = isExpanded(media);

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(mediaName);

  const stopPropagation = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
  };

  const handleEdit = (event) => {
    stopPropagation(event);
    setEditing(true);
    setInputValue(mediaName);
  };

  const handleRename = (event) => {
    stopPropagation(event);
    setEditing(false);
    if (inputValue && inputValue !== mediaName) {
      dispatch({ type: 'instplaylist/renameMedia', payload: { mediaId: id, name: inputValue } });
    }
  };

  const handleInputChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleCheck = (event) => {
    stopPropagation(event);
    handleSelect(media, event.target.checked);
  };

  const handleExpansionChange = (event, expand) => {
    handleExpand(media, expand);
  };

  useEffect(() => {
    if (editing) {
      setEditing(false);
      setInputValue(mediaName);
    }
  }, [filtering, selecting]);

  const renameBtnIcon = editing ? 'check' : 'edit';
  const renameBtnLabel = editing ? 'Save' : 'Rename';
  const renameBtnClick = editing ? handleRename : handleEdit;

  const checkBoxClasses = CTCheckbox.useStyles();

  return (
    <Accordion className="media-item" expanded={expanded} onChange={handleExpansionChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        tabIndex={-1}
        IconButtonProps={{
          role: 'button',
          tabIndex: '0',
          onClick: () => handleExpand(media, !expanded),
          'aria-label': expanded ? 'collapse' : 'expand',
        }}
      >
        <div className="w-100 d-flex align-items-center">
          <MuiCheckbox
            classes={checkBoxClasses}
            onClick={stopPropagation}
            checked={selected}
            onChange={handleCheck}
            className="media-check-box"
            aria-label="Select this media"
          />

          <MediaName
            mediaName={mediaName}
            editing={editing}
            inputValue={inputValue}
            onSave={handleRename}
            onInputChange={handleInputChange}
          />
        </div>

        <CTPopoverLabel label={renameBtnLabel}>
          <IconButton
            size="small"
            className="ml-4"
            onClick={renameBtnClick}
            aria-label={renameBtnLabel}
          >
            <i className="material-icons rename-icon">{renameBtnIcon}</i>
          </IconButton>
        </CTPopoverLabel>
      </AccordionSummary>

      <AccordionDetails>
        <CTText muted padding={[0, 0, 5, 10]}>
          Created at {(media.createdAt || '').slice(0, 10)}
        </CTText>

        <MediaItemActions
          media={media}
          mediaId={id}
          isUnavailable={isUnavailable}
          dispatch={dispatch}
        />
      </AccordionDetails>
    </Accordion>
  );
}

export default MediaItem;
