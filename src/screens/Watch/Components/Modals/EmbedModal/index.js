import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import {
  CTFragment,
  CTModal,
  CTInput,
  CTCheckbox,
  CTFormRow,
  CTSelect,
  CTFormHeading
} from 'layout';
import { uurl, prompt, timestr } from 'utils';
import {
  CTPlayerConstants as Constants,
  LanguageConstants as LangConstants
} from 'components/CTPlayer';
import './index.scss';

function EmbedModal(props) {
  const { onClose, media } = props;

  const inputRef = useRef();
  const iframeRef = useRef();
  const [confirmButtonText, setconfirmButtonText] = useState('Copy');
  const [ccLanguage, setCCLanguage] = useState('en-US');
  const [playbackRate, setplaybackRate] = useState(4);
  const [embedHTML, setEmbedHTML] = useState('');
  const [enableBeginTime, setEnableBeginTime] = useState(false);
  const [beginTime, setBeginTime] = useState('0:00');
  const [enableCaption, setEnableCaption] = useState(false);
  const [enablePadded, setEnablePadded] = useState(false);

  const handleEmbedHTMLChange =
    ({ target: { value } }) => setEmbedHTML(value);

  const handleCCLanguageChange =
    ({ target: { value } }) => setCCLanguage(value);

  const handlePlaybackRateChange =
    ({ target: { value } }) => setplaybackRate(value);

  const handleEnableBeginTime =
    ({ target: { checked } }) => setEnableBeginTime(checked);

  const handleBeginTime =
    ({ target: { value } }) => setBeginTime(value);

  const handleEnableCaption =
    ({ target: { checked } }) => setEnableCaption(checked);

  const handleEnablePadded =
    ({ target: { checked } }) => setEnablePadded(checked);

  const handleConform = () => {
    setconfirmButtonText('Copied');
    inputRef.current.select();
    document.execCommand('copy');
    setTimeout(() => {
      setconfirmButtonText('Copy');
    }, 2000);
    prompt.addOne({
      text: 'Content copied to clipboard.',
      status: 'success',
      timeout: 3000,
      position: 'bottom left',
      offset: [60, 40]
    }, true);
  };

  const handleFocus = () => {
    inputRef.current.select();
  };

  const ccLanguageOptions = LangConstants.LanguageOptions;
  const playbackRatesOptions = Constants.PlaybackRates.map(
    (plb, index) => ({ text: plb, value: index })
  );

  useEffect(() => {
    // validate the begin time
    /* NOT IMPLEMENTED
    if (videoControl.duration < timestr.toSeconds(beginTime)) {
      setBeginTime(timestr.toTimeString(videoControl.duration));
    }
    */
  }, [beginTime]);

  useEffect(() => {
    // update the embedable code
    const iframeEl = iframeRef.current;
    if (iframeEl) {
      let vid = uurl.useSearch().id;
      let embedQuery = uurl.createSearch({
        begin: enableBeginTime ? timestr.toSeconds(beginTime) : null,
        playbackRate: playbackRate === 4 ? null : playbackRatesOptions[playbackRate].text,
        openCC: enableCaption ? 'true' : null,
        lang: ccLanguage === Constants.English ? null : ccLanguage,
        padded: enablePadded ? 'true' : null
      });
      iframeEl.src = `${window.location.origin}/embed/${vid}${embedQuery}`;
      setEmbedHTML(iframeEl.outerHTML.replace(/&amp;/g, '&'));
    }
  });

  useEffect(() => {
    if (enableBeginTime) {
      // setBeginTime(timestr.toTimeString(videoControl.currTime())); NOT IMPLEMENTED
    }
  }, [enableBeginTime]);

  const actionElement = (
    <Button color="teal" onClick={handleConform}>
      {confirmButtonText}
    </Button>
  );

  const modalProps = {
    id: 'wp-embed-modal',
    open: true,
    title: 'Embed Video',
    size: 'md',
    responsive: true,
    onClose,
    action: actionElement,
    withCloseButton: true
  };

  return (
    <CTModal {...modalProps} darkMode>
      <CTFragment justConCenter id="wp-embed-iframe">
        <iframe ref={iframeRef} width="560" height="315" title={media.mediaName} frameBorder="0" />
      </CTFragment>
      <CTFragment padding={[20, 0, 5, 0]}>
        <CTInput
          label="Embedable code"
          inputRef={inputRef}
          textarea
          value={embedHTML}
          onFocus={handleFocus}
          onChange={handleEmbedHTMLChange}
          className="wp-embed-code"
        />
      </CTFragment>
      <CTFormHeading padding={[5, 0]}>Default player options</CTFormHeading>
      <CTFragment>
        <CTCheckbox
          id="begin-time"
          label="Start at"
          checked={enableBeginTime}
          onChange={handleEnableBeginTime}
        />
        <CTInput
          underlined
          disabled={!enableBeginTime}
          value={beginTime}
          onChange={handleBeginTime}
          className="wp-embed-btime"
          aria-label="time"
        />
      </CTFragment>
      <CTFormRow>
        <CTCheckbox
          id="open-cc"
          label="Default open subtitles"
          checked={enableCaption}
          onChange={handleEnableCaption}
        />
      </CTFormRow>
      <CTFormRow>
        <CTSelect
          id="sel-lang"
          label="Default subtitle language"
          options={ccLanguageOptions}
          value={ccLanguage}
          onChange={handleCCLanguageChange}
        />
        <CTSelect
          id="sel-rate"
          label="Default playback rate"
          options={playbackRatesOptions}
          value={playbackRate}
          onChange={handlePlaybackRateChange}
        />
      </CTFormRow>
      <CTFormRow>
        <CTCheckbox
          id="padded"
          label="Padding for tool bars"
          checked={enablePadded}
          onChange={handleEnablePadded}
          helpText="The player can have paddings so that the video will not be covered by the top an bottom tool bars."
        />
      </CTFormRow>
    </CTModal>
  );
}

EmbedModal.propTypes = {
  /** callback on close */
  onClose: PropTypes.func
};
export default EmbedModal;