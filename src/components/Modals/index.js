import React, { useEffect } from 'react';
import { Button } from 'pico-ui';
import './index.scss';

export function CTModal({
  show = false,
  title = '',
  large = false,
  middle = false,
  children,
  closeOnBlur = false,
  // actions
  actions,
  onClose,
  onSave,
  saveBtnText = 'Save',
  cancelBtnText = 'Cancel',
}) {
  const handleClose = () => {
    const modalEl = document.getElementById('ct-mdl-box');
    if (modalEl) {
      modalEl.classList.add('ctmdl-close');
      setTimeout(() => {
        if (onClose) onClose();
      }, 50);
    }
  };

  useEffect(() => {
    if (show) {
      const modalEl = document.getElementById('ct-mdl-box');
      if (modalEl) {
        modalEl.classList.add('ctmdl-open');
      }
    }
  }, [show]);

  const modalStyle = large ? ' large' : middle ? ' middle' : '';
  return show ? (
    <div className="ct-modal ct-d-c-center">
      <div className="ct-mdl-wrapper" onClick={closeOnBlur ? handleClose : null} />
      <div id="ct-mdl-box" className={`ct-mdl-con${modalStyle}`}>
        {/* Header */}
        <div className="ct-mdl-h-con">
          <h3>{title}</h3>
          <Button round icon="close" color="transparent" onClick={handleClose} />
        </div>

        {/* Content */}
        <div className="ct-mdl-text-con">
          <div className="ct-mdl-text" data-scroll>
            {children}
          </div>
        </div>

        <div className="ct-mdl-act">
          {actions || (
            <Button.Group>
              <Button
                uppercase
                compact
                text={saveBtnText}
                color="transparent teal"
                onClick={onSave}
              />
              <Button uppercase compact text={cancelBtnText} color="teal" onClick={handleClose} />
            </Button.Group>
          )}
        </div>
      </div>
    </div>
  ) : null;
}
