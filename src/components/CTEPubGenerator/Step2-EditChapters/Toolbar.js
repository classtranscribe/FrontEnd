import React from 'react';
import { Button } from 'pico-ui';
import { CTFragment } from 'layout';
import timestr from 'utils/use-time';
import { epub } from '../controllers';
import { EPubStepper } from '../components';
import { connectWithRedux } from '../redux';
import './index.scss';

function Toolbar({
  chapters,
  currChIndex,
}) {
  const currChapter = chapters[currChIndex] || {};
  const beginstr = timestr.toPrettierTimeString(currChapter.start);
  const endstr = timestr.toPrettierTimeString(currChapter.end);

  const watchInPlayer = () => {
    epub.ctrl.openPlayerModal(currChapter.title, currChapter.start, currChapter.end);
  };

  return (
    <CTFragment list className="ct-epb ech tool-bar" data-scroll>
      <EPubStepper vertical />

      <CTFragment>
        <Button
          round
          outlined
          uppercase
          className="ech tool-bar-btn"
          icon="play_circle_filled"
          onClick={watchInPlayer}
        >
          Watch the video ({beginstr} - {endstr})
        </Button>

        <CTFragment vCenter margin={[0, 0, 20, 0]}>
          <Button
            round
            outlined
            uppercase
            className="ech tool-bar-btn mr-1"
            icon="undo"
            disabled={!epub.history.canUndo}
            onClick={epub.history.undo}
          >
            undo
          </Button>

          <Button
            round
            outlined
            uppercase
            className="ech tool-bar-btn ml-1"
            icon="redo"
            disabled={!epub.history.canRedo}
            onClick={epub.history.redo}
          >
            redo
          </Button>
        </CTFragment>

        <Button
          round
          className="ech tool-bar-btn ct-epb shadow-btn"
          color="teal"
          icon="arrow_forward"
          onClick={epub.ctrl.proceedToStep3}
        >
          Proceed to ePub Downloader
        </Button>
      </CTFragment>
    </CTFragment>
  );
}

export default connectWithRedux(
  Toolbar,
  ['chapters', 'currChIndex']
);