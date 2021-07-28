import React from 'react';
import { Button } from 'semantic-ui-react';
import { keydownControl, MENU_SHORTCUTS } from '../../../Utils';
import './index.scss';

export function TabEventHelperButtons(props) {
  const { dispatch } = props;
  return (
    <div className="watch-tab-helper">
      <Button.Group>
        {/* <Button
          id="skip-to-continue"
          className="skip-btn"
          onClick={() => keydownControl.skipToContinue()}
        >
          Continue
        </Button> */}
        <Button
          id="skip-to-ctrl-bar"
          className="skip-btn"
          onClick={() => keydownControl.skipToControlBar()}
        >
          Skip to Player Control Bar
        </Button>
        <Button
          id="skip-to-caption-box"
          className="skip-btn"
          onClick={() => keydownControl.skipToCaptionBox()}
        >
          Skip to Transcriptions
        </Button>
        <Button
          id="tab-open-shortcuts"
          className="skip-btn"
          onClick={() => dispatch({type: 'watch/menu_open', payload: { type: MENU_SHORTCUTS }})}
        >
          See Shortcuts
        </Button>
      </Button.Group>
    </div>
  );
}
