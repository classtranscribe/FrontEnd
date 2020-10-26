import React from 'react';
import cx from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { connectWithRedux, epub } from '../../controllers';
import { CTPopoverLabel } from 'layout';
const Constants = epub.const;

function LabelIcon(saved) {
  switch (saved) {
    case Constants.EpbSaved:
      return (
        <span className="material-icons">check</span>
      );
    case Constants.EpbSaving:
      return (
        <CircularProgress disableShrink size={10} />
      );
    case Constants.EpbUnsaved:
      return (
        <span className="material-icons">north</span>
      );
    case Constants.EpbSaveFailed:
      return (
        <span className="material-icons">close</span>
      );
  
    default:
      return null;
  }
}

function LabelText(saved) {
  switch (saved) {
    case Constants.EpbSaved:
      return 'Saved';
    case Constants.EpbSaving:
      return 'Saving';
    case Constants.EpbUnsaved:
      return 'Unsaved';
    case Constants.EpbSaveFailed:
      return 'Auto-Save Failed';
  
    default:
      return null;
  }
}

function SaveStatusLabel({ saved }) {
  const iconElement = LabelIcon(saved);
  const text = LabelText(saved);

  const error = saved === Constants.EpbSaveFailed;
  const success = saved === Constants.EpbSaved;

  return (
    <CTPopoverLabel label="Auto-save in 3s">
      <div className={cx('ct-epb header-label', { error, success })}>
        <span className="ct-epb label-icon">
          {iconElement}
        </span>
        <span className="ct-epb label-text">
          {text}
        </span>
      </div>
    </CTPopoverLabel>
  );
}

export default connectWithRedux(
  SaveStatusLabel,
  ['saved']
);
