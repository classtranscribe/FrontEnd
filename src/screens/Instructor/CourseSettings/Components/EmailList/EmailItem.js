import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import MuiCheckbox from '@material-ui/core/Checkbox';
import { CTPopoverLabel, CTCheckbox, CTFragment } from 'layout';

function EmailItem({
  email,
  isSelected,
  handleSelectEmail,
  handleRemoveEmail,
}) {
  const checkBoxClasses = CTCheckbox.useStyles();
  const handleCheckChange = ({ target: { checked } }) => {
    handleSelectEmail(email, checked);
  };

  return (
    <CTFragment role="listitem" vCenter className="cs-email-filter-li">
      <div className="d-flex align-items-center">
        <MuiCheckbox
          classes={checkBoxClasses}
          checked={isSelected(email)}
          onChange={handleCheckChange}
        />
        <span>{email}</span>
      </div>

      <div>
        <CTPopoverLabel label="Remove this email">
          <IconButton size="small" onClick={() => handleRemoveEmail(email)}>
            <DeleteIcon />
          </IconButton>
        </CTPopoverLabel>
      </div>
    </CTFragment>
  );
}

export default EmailItem;

