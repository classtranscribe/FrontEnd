import React from 'react';
import Button from '@material-ui/core/Button';
import { connect } from 'dva'
import Image from 'components/Image';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import { CTFragment, CTHeading, CTParagraph, useButtonStyles, CTPopoverLabel } from 'layout';
import { uurl, timestr, elem } from 'utils';
import { epub } from '../../../controllers';
import './index.scss';

function EPubItemView({
  item,
  setEPubItem,
  dispatch,
  items
}) {
  const btnStyles = useButtonStyles();

  const itemIdx = items.findIndex((it) => it.id === item.id);
  const startTimeStr = timestr.toPrettierTimeString(item.start);
  const endTimeStr = timestr.toPrettierTimeString(item.end);

  const onClose = () => setEPubItem(null);
  const toNext = () => {
    setEPubItem(items[itemIdx + 1]);
    elem.scrollIntoCenter(items[itemIdx + 1].id, { focus: true });
  };
  const toPrev = () => {
    setEPubItem(items[itemIdx - 1]);
    elem.scrollIntoCenter(items[itemIdx - 1].id, { focus: true });
  };
  const watchInPlayer = () => {
    dispatch({
      type: 'epub/openPlayer', payload: {
        title: `Screenshot #${itemIdx + 1}`, start: item.start, end: item.end
      }
    });
  }

  return (
    <CTFragment className="ct-epb epb-item-view" fadeIn id={epub.id.epbItemViewId(item.id)}>
      <CTFragment justConBetween alignItCenter margin={[0, 0, 10, 0]}>
        <CTHeading as="h3" compact>Screenshot {(itemIdx + 1)}/{items.length}</CTHeading>
        <IconButton onClick={onClose} aria-label="Close">
          <span className="material-icons">close</span>
        </IconButton>
      </CTFragment>

      <CTFragment className="epb-carl-img-con">
        <Image src={uurl.getMediaUrl(item.image)} />
      </CTFragment>

      <CTFragment>
        <CTFragment justConBetween padding={[10, 5]}>
          <CTPopoverLabel label={`Watch the video ${startTimeStr} - ${endTimeStr}`}>
            <Button
              startIcon={<span className="material-icons">play_circle_filled</span>}
              className={btnStyles.tealLink}
              onClick={watchInPlayer}
            >
              <span>{startTimeStr} - {endTimeStr}</span>
            </Button>
          </CTPopoverLabel>

          <ButtonGroup size="small">
            <IconButton
              disabled={itemIdx === 0}
              onClick={toPrev}
              aria-label="Previous screenshot"
              title="Previous screenshot"
            >
              <span className="material-icons">chevron_left</span>
            </IconButton>
            <IconButton
              disabled={itemIdx === items.length - 1}
              onClick={toNext}
              aria-label="Next screenshot"
              title="Next screenshot"
            >
              <span className="material-icons">chevron_right</span>
            </IconButton>
          </ButtonGroup>
        </CTFragment>

        <CTParagraph fontSize="14px">
          {item.text || <i className="text-muted">No Transcriptions</i>}
        </CTParagraph>
      </CTFragment>
    </CTFragment>
  );
}

export default connect(({ epub: { items } }) => ({
  items
}))(EPubItemView);
