import React from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'dva'
import './index.scss';

import {
  PlayButton,
  RewindButton,
  ForwardButton,
  SettingButton,
  NextVideoButton,
  FullscreenButton,
  SwitchScreenButton,
  PlaybackRateButton,
  ClosedCaptionButton,
  LanguagePickerButton,
  TranscriptionPickerButton,
  AudioDescriptionButton,
  ScreenModeSettingButton,
  ShowASLButton,
  GlossaryButton, // May 20 Jiaxi
} from './CtrlButtons';

import VolumeControl from './VolumeControl';
import TimeDisplay from './TimeDisplay';
import ProgressBar from './ProgressBar';

// eslint-disable-next-line complexity
export function ControlBarWithRedux(props) {
  const { dispatch, media = {}, bulkEditing = false } = props;
  const { isTwoScreen, transcriptions, hasASL , aslCorner} = media;
  const hasTrans = Array.isArray(transcriptions) && transcriptions.length > 0;
  // eslint-disable-next-line no-console
  const showScreenModes = isTwoScreen && !bulkEditing && !isMobile;

  return (
    <div
      id="watch-ctrl-bar"
      className="watch-ctrl-bar-container"
      role="region"
      aria-label='Video Controls'
    >
      <ProgressBar />
      <div className="watch-ctrl-bar-left-elems">
        {isMobile ? <RewindButton /> : <NextVideoButton nextBtn={false} />}

        <PlayButton dispatch={dispatch} />

        {isMobile ? <ForwardButton /> : <NextVideoButton />}

        {isTwoScreen && <SwitchScreenButton />}

        <VolumeControl />
        <TimeDisplay />
      </div>
      <div className="watch-ctrl-bar-right-elems">
        
        <GlossaryButton />

        {isMobile && <NextVideoButton nextBtn={false} />}
        {isMobile && <NextVideoButton />}

        <PlaybackRateButton />
        <ClosedCaptionButton />
        <AudioDescriptionButton />

        {/* marked for removal in future version */}
        {false && hasTrans && <LanguagePickerButton />}
        
        {hasTrans && <TranscriptionPickerButton />}

        {showScreenModes && <ScreenModeSettingButton isTwoScreen={isTwoScreen} />}
        {hasASL && <ShowASLButton hasASL={hasASL} aslCorner={aslCorner} />}
        <SettingButton />
        <FullscreenButton />
      </div>
    </div>
  );
}

export const ControlBar = connect(({ watch : { media, bulkEditing} }) => ({
  media, bulkEditing
}))(ControlBarWithRedux);
