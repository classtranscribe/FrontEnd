import _ from 'lodash';
import React from 'react';
import { Button } from 'pico-ui';
import { SwipeableDrawer } from '@material-ui/core';
import { CTFragment, CTHeading, CTText, CTParagraph } from 'layout';
import { uurl, elem, timestr } from 'utils';
import { epub } from '../../controllers';
import { connectWithRedux } from '../../redux';
import CarouselButton from './CarouselButton';
import './index.scss';

const getEPubItem = (rawEPubData, ePubItemId) => {
  if (ePubItemId) {
    let itemIdx = _.findIndex(rawEPubData, { id: ePubItemId });
    if (itemIdx >= 0) {
      return [rawEPubData[itemIdx], itemIdx];
    }
  }

  return [{}, 0];
};

function EPubItemCarousel({
  ePubItemId,
  rawEPubData
}) {
  const [item, itemIdx] = getEPubItem(rawEPubData, ePubItemId);
  const onClose = epub.ctrl.closeEPubItemCarousel;
  const open = Boolean(item.id);
  const startTimeStr = timestr.toPrettierTimeString(item.start);
  const endTimeStr = timestr.toPrettierTimeString(item.end);

  const toPrev = () => {
    if (itemIdx > 0) {
      epub.ctrl.openEPubItemCarousel(rawEPubData[itemIdx-1].id);
    }
  };

  const toNext = () => {
    if (itemIdx < rawEPubData.length - 1) {
      epub.ctrl.openEPubItemCarousel(rawEPubData[itemIdx+1].id);
    }
  };

  const handleKeyDown = ({ keyCode }) => {
    if (keyCode === 39) {
      toNext();
    } else if (keyCode === 37) {
      toPrev();
    }
  };

  const navigate = () => {
    onClose();
    setTimeout(() => {
      elem.scrollIntoCenter(item.id, { focus: true, smooth: true });
    }, 300);
  };

  return (
    <SwipeableDrawer
      id={epub.const.SplitChapterItemCarouselID}
      anchor="bottom"
      open={open}
      onClose={onClose}
      classes={{paperAnchorBottom: 'epb-ch-item-carousel'}}
      onKeyDown={handleKeyDown}
    >
      <CTFragment sticky vCenter hBetween padding="20">
        <CTHeading as="h3" margin="0">ePub Screenshots</CTHeading>
        <CarouselButton
          outlined
          disabled={itemIdx <= 0}
          startIcon={<span className="material-icons">chevron_left</span>}
          onClick={toPrev}
        >
          Previous screenshot
        </CarouselButton>

        <CarouselButton
          disabled={itemIdx >= rawEPubData.length - 1}
          startIcon={<span className="material-icons">near_me</span>}
          onClick={navigate}
        >
          Navigate to this item
        </CarouselButton>
        
        <CarouselButton
          outlined
          disabled={itemIdx >= rawEPubData.length - 1}
          endIcon={<span className="material-icons">chevron_right</span>}
          onClick={toNext}
        >
          Next screenshot
        </CarouselButton>
        <Button round icon="close" aria-label="close" onClick={onClose} autoFocus />
      </CTFragment>

      <CTFragment list padding={[0, 20, 20, 20]}>
        <CTFragment id="epb-carousel-con" padding={[0, 20]}>
          <CTFragment className="epb-carl-img">
            <img src={uurl.getMediaUrl(item.image)} />
          </CTFragment>

          <CTFragment list className="epb-carl-txt-con" padding={[0, 20]} data-scroll>
            <CTText celadon bold margin={[10, 0]} size="medium">
              {startTimeStr} - {endTimeStr}
            </CTText>
            <CTParagraph size="medium">
              {item.text}
            </CTParagraph>
          </CTFragment>
        </CTFragment>
      </CTFragment>
    </SwipeableDrawer>
  );
}

export default connectWithRedux(
  EPubItemCarousel,
  ['ePubItemId', 'rawEPubData']
);
