import React, { useState } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MuiCheckbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import { CTPopoverLabel, CTCheckbox, CTText } from 'layout';
import { mediaControl } from '../../../controllers';
import MediaName from './MediaName';
import MediaItemActions from './MediaItemActions';

function MediaItem({
  media,
  handleSelect,
  isSelected,
}) {
  const { mediaName, id } = media;
  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(mediaName);

  const stopPropagation = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
  }

  const handleEdit = (event) => {
    stopPropagation(event);
    setEditing(true);
    setInputValue(mediaName);
  };

  const handleRename = (event) => {
    stopPropagation(event);
    setEditing(false);
    mediaControl.renameMedia(id, inputValue);
  };

  const handleInputChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleCheck = (event) => {
    stopPropagation(event);
    handleSelect(media, event.target.checked);
  };

  const checkBoxClasses = CTCheckbox.useStyles();

  const buttonLabel = editing ? 'Save' : 'Rename';
  const buttonClick = editing ? handleRename : handleEdit;
  const buttonIcon = editing ? 'check' : 'edit';

  const checked = isSelected(media);

  return (
    <ExpansionPanel className="media-item">
      <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
        <div className="w-100 d-flex align-items-center">
          <MuiCheckbox
            classes={checkBoxClasses}
            onClick={stopPropagation}
            checked={checked}
            onChange={handleCheck}
            aria-label={checked ? 'Unselect' : 'Select'}
            className="media-check-box"
          />

          <MediaName 
            mediaName={mediaName}
            editing={editing}
            inputValue={inputValue}
            onSave={handleRename}
            onInputChange={handleInputChange}
          />
        </div>

        <CTPopoverLabel label={buttonLabel}>
          <IconButton 
            size="small" 
            className="ml-4" 
            onClick={buttonClick}
            aria-label={buttonLabel}
          >
            <i className="material-icons rename-icon">{buttonIcon}</i>
          </IconButton>
        </CTPopoverLabel>
      </ExpansionPanelSummary>

      <ExpansionPanelDetails>
        <CTText size="medium" padding={[0, 0, 5, 10]}>
          Created at: {(media.createdAt || '').slice(0, 10)}
        </CTText>
        <MediaItemActions mediaId={id} />
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
}

export default MediaItem;
