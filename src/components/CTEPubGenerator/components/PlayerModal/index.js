import React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import { Button } from 'pico-ui';
import timestr from 'utils/use-time';
import { CTFragment, CTHeading, CTText } from 'layout';
import CTPlayer from '../../../CTPlayer';
import { epub } from '../../controllers';
import './index.scss';

function PlayerModal({
  open,
  title,
  media,
  begin,
  end,
}) {
  const onClose = epub.ctrl.closePlayerModal;

  return (
    <SwipeableDrawer
      id={epub.const.EPubPlayerModal}
      anchor="bottom"
      open={open}
      onClose={onClose}
      classes={{paperAnchorBottom: 'ct-epb player-modal'}}
    >
      <CTFragment sticky dark alignItCenter justConBetween padding="20">
        <CTFragment alignItCenter>
          <CTHeading as="h3" margin="0">{title}</CTHeading>
          <CTText highlighted size="medium" margin={[0, 20]}>
            {timestr.toTimeString(begin)} - {timestr.toTimeString(end)}
          </CTText>
        </CTFragment>
        <Button 
          round 
          icon="close" 
          aria-label="close" 
          color="black" 
          onClick={onClose}
          autoFocus
        />
      </CTFragment>

      <CTFragment dark justConCenter className="ct-epb player-modal-player-con">
        <CTPlayer
          fill
          defaultOpenCC
          hideWrapperOnMouseLeave
          allowTwoScreen
          // allowScreenshot
          // onScreenshotCaptured={alert}
          media={media}
          beginAt={begin}
          endAt={end}
        />
      </CTFragment>
    </SwipeableDrawer>
  );
}

export default PlayerModal;
