import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CTInput, CTCheckbox, CTFormRow, CTSelect } from 'layout/CTForm'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { api, uurl } from 'utils';
import { baseUrl } from 'utils/cthttp/statics'
import Modal from './Modal';

const useStyles = makeStyles({
  cancelBtn: {
    fontWeight: 'bold'
  },
  confirmBtn: {
    fontWeight: 'bold',
    marginLeft: 5,
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  },
  modal: {
    width: '40vw',
    marginLeft: '58vw',
    marginTop: '-42vh',
  }
});

function EmbedVideo(props) {
  const {
    open = false,
    responsive = true,
    title = 'Embed Video',
    text,
    children,
    onClose,
    onConfirm,
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Copy',
    parseSec,
    videoControl,
    ...otherProps
  } = props;

  const classes = useStyles();
  const inputRef = useRef();

  const contentElement = text ? <Modal.Text>{text}</Modal.Text> : children;
  const handleConform = () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
      inputRef.current.select();
      document.execCommand('copy');
    }
  }

  const actionElement = (
    <>
      <Button size="large" className={classes.cancelBtn} onClick={onClose}>
        {cancelButtonText}
      </Button>
      <Button size="large" className={classes.confirmBtn} onClick={handleConform}>
        {confirmButtonText}
      </Button>
    </>
  );

  const modalProps = {
    open,
    title,
    size: 'xs',
    responsive,
    onClose,
    action: actionElement,
    ...otherProps
  };

  return (
    <Modal {...modalProps} className={classes.modal}>
      <CTInput
        inputRef={inputRef}
        textarea
        underlined
        value={`${window.location.origin}/embed/c9a54a76-9cf0-4ec2-ab2f-89d496326562?padded=true`}
      />

      <CTFormRow>
        <CTCheckbox
          id="begin-time"
          label="Set begin time"
        // checked={isChecked}
        // onChange={handleCheckChange}
        />
        <CTInput
          value={parseSec(parseInt(videoControl.currTime(), 10))}
        />
      </CTFormRow>
      <CTFormRow>
        <CTCheckbox
          id="open-cc"
          label="Default open closed caption"
        // checked={isChecked}
        // onChange={handleCheckChange}
        />
      </CTFormRow>
      <CTFormRow>
        <CTSelect
          id="sel-2"
          label="Closed caption language"
          options={[]}
          value="1"
        // onChange={handleTermChange}
        />
      </CTFormRow>
      <CTFormRow>
        <CTSelect
          id="sel-3"
          label="Playback rate"
          options={[]}
          value="1"
        // onChange={handleTermChange}
        />
      </CTFormRow>

    </Modal>
  );
}

EmbedVideo.propTypes = {
  /** True if open the modal */
  open: Modal.propTypes.open,

  /** The size of the modal can be responsive to window's width */
  responsive: Modal.propTypes.responsive,

  /** The confirmation title */
  title: PropTypes.node,

  /** The confirmation text */
  text: PropTypes.node,

  /** Primary content */
  children: PropTypes.node,

  /** callback on close */
  onClose: PropTypes.func,

  /** callback on confirm */
  onConfirm: PropTypes.func,

  /** Customize the cancel-button's text */
  cancelButtonText: PropTypes.string,

  /** Customize the confirm-button's text */
  confirmButtonText: PropTypes.string,
};

export default EmbedVideo;

