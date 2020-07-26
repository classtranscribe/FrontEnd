import React from 'react';
import { SwipeableDrawer } from '@material-ui/core';
import { Button } from 'pico-ui';
import timestr from 'utils/use-time';
import { CTFragment, CTHeading, CTText } from 'layout';
import { CTPlayer } from '../../../CTPlayer';
import { epub } from '../../controllers';
import './index.scss';

function PlayerModal({
  open,
  title,
  mediaId,
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
      <CTFragment sticky dark vCenter hBetween padding="20">
        <CTHeading as="h3" margin="0">{title}</CTHeading>
        <CTText highlighted>
          {timestr.toTimeString(begin)} - {timestr.toTimeString(end)}
        </CTText>
        <Button 
          round 
          icon="close" 
          aria-label="close" 
          color="black" 
          onClick={onClose}
          autoFocus
        />
      </CTFragment>

      <CTFragment dark hCenter className="ct-epb player-modal-player-con">
        <CTPlayer
          fill
          defaultOpenCC
          hideWrapperOnMouseLeave
          mediaId={mediaId}
          beginAt={begin}
          endAt={end}
        />
      </CTFragment>
    </SwipeableDrawer>
  );
}

export default PlayerModal;
