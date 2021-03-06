import React from 'react';
import cx from 'classnames';
import CircularProgress from '@material-ui/core/CircularProgress';
import { CTPopoverLabel } from 'layout';
import { connectWithRedux, epub as epubController } from '../../controllers';

const Constants = epubController.const;

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
        <span className="material-icons">arrow_upward</span>
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
      return ['Saved', `Last saved at ${ new Date().toLocaleString()}`];
    case Constants.EpbSaving:
      return ['Saving...', 'Saving to cloud...'];
    case Constants.EpbUnsaved:
      return ['Unsaved', 'Auto-save in 3 seconds'];
    case Constants.EpbSaveFailed:
      return ['Auto-Save Failed', 'Couldn\'t save your changes, please try again'];
  
    default:
      return null;
  }
}

function SaveStatusLabel({ saved }) {
  const iconElement = LabelIcon(saved);
  const [text, label] = LabelText(saved);

  const error = saved === Constants.EpbSaveFailed;
  const success = saved === Constants.EpbSaved;

  return (
    <CTPopoverLabel label={label}>
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
  ['saved'/** , 'epub' */]
);
