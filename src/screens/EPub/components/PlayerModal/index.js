import React from 'react';
import { connect } from 'dva'
import { SwipeableDrawer } from '@material-ui/core';
import { Button } from 'pico-ui';
import SourceTypes from 'entities/SourceTypes';
import timestr from 'utils/use-time';
import { CTFragment, CTHeading, CTText } from 'layout';
import CTPlayer from 'components/CTPlayer';
import './index.scss';

function PlayerModal({
  playerData,
  media,
  epub,
  dispatch
}) {
  const isOpen = Boolean(playerData) && media;
  if(!isOpen) {
    return null;
  }
  const { title, begin, end } = playerData;
  const onClose = () => {
    if (!media) return;
    dispatch({ type: 'epub/setPlayerData', payload: null })
  }
  const screenshotSource = {
    id: epub.id,
    type: SourceTypes.EPub
  };

  return (
    <SwipeableDrawer
      id="ct-epb-player-modal" // NOT CONFIRMED
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      classes={{ paperAnchorBottom: 'ct-epb player-modal' }}
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
          allowScreenshot
          screenshotSource={screenshotSource}
          // onScreenshotCaptured={alert}
          media={media}
          beginAt={begin}
          endAt={end}
        />
      </CTFragment>
    </SwipeableDrawer>
  );
}

export default connect(({ epub: { playerData, media, epub }, loading }) => ({
  playerData, media, epub
}))(PlayerModal);
