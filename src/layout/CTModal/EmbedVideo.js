import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { CTInput, CTCheckbox, CTFormRow, CTSelect } from 'layout/CTForm'
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { api, uurl } from 'utils';
import { baseUrl } from 'utils/cthttp/statics'
import { CTPlayerConstants as Constants } from 'components/CTPlayer';
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
    marginTop: '-32vh',
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
    ccLanguage,
    handleCCLanguageChange,
    playbackRate,
    handlePlaybackRateChange,
    ...otherProps
  } = props;
  const classes = useStyles();
  const inputRef = useRef();
  const [embedHTML, setEmbedHTML] = useState('')

  const ccLanguageOptions = [
    { text: 'English', value: 'en-US' },
    { text: 'Simplified Chinese', value: 'zh-Hans' },
    { text: 'Korean', value: 'ko' },
    { text: 'Spanish', value: 'es' },
    { text: 'French', value: 'fr' }
  ]
  const playbackRatesOptions = [
    { text: '2', value: 0 },
    { text: '1.75', value: 1 },
    { text: '1.5', value: 2 },
    { text: '1.25', value: 3 },
    { text: '1', value: 4 },
    { text: '0.75', value: 5 },
    { text: '0.5', value: 6 },
    { text: '0.25', value: 7 },
  ]

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

  useEffect(() => {
    setEmbedHTML('<iframe width="560" height="315" src="' +
      `${window.location.origin}/embed/${uurl.useSearch().id}`
      +
      '" ></iframe>')
  }
    , [ccLanguage, playbackRate])

  return (
    <Modal {...modalProps} className={classes.modal} darkMode>
      <CTInput
        inputRef={inputRef}
        textarea
        underlined
        value={embedHTML}
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
          id="sel-lang"
          label="Closed caption language"
          options={ccLanguageOptions}
          value={ccLanguage}
          onChange={handleCCLanguageChange}
        />
      </CTFormRow>
      <CTFormRow>
        <CTSelect
          id="sel-rate"
          label="Playback rate"
          options={playbackRatesOptions}
          value={playbackRate}
          onChange={handlePlaybackRateChange}
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

