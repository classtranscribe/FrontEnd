import React from 'react';
import cx from 'classnames';
import { Button, ButtonGroup } from '@material-ui/core';
import { CTFragment, useButtonStyles } from 'layout';
import { timestr } from 'utils';
import { epub, connectWithRedux } from '../../controllers';

function Toolbuttons({ currChIndex = 0, chapters = [] }) {
  const btnStyles = useButtonStyles();
  const { start, end, title } = chapters[currChIndex];
  const startTimeStr = timestr.toPrettierTimeString(start);
  const endTimeStr = timestr.toPrettierTimeString(end);

  const watchInPlayer = () => {
    epub.ctrl.openPlayer(`Chapter ${currChIndex + 1}: ${title}`, start, end);
  };

  const toPrevCh = () => {
    epub.nav.navigateChapter(chapters[currChIndex - 1].id);
  };

  const toNextCh = () => {
    epub.nav.navigateChapter(chapters[currChIndex + 1].id);
  };

  return (
    <CTFragment dFlexCol padding={[10]}>
      <Button 
        startIcon={<span className="material-icons">play_circle_filled</span>}
        className={cx(btnStyles.tealLink, 'justify-content-start')}
        onClick={watchInPlayer}
        size="large"
      >
        Watch <span className="ml-1">{startTimeStr} - {endTimeStr}</span>
      </Button>

      <CTFragment margin={[10, 0]}>
        <ButtonGroup fullWidth>
          <Button 
            variant="outlined" 
            startIcon={<span className="material-icons">navigate_before</span>}
            className={btnStyles.tealLink}
            disabled={currChIndex <= 0}
            onClick={toPrevCh}
          >
            Previous
          </Button>
          <Button 
            variant="outlined" 
            endIcon={<span className="material-icons">navigate_next</span>}
            disabled={currChIndex >= chapters.length}
            className={btnStyles.tealLink}
            onClick={toNextCh}
          >
            Next
          </Button>
        </ButtonGroup>
      </CTFragment>
    </CTFragment>
  );
}

export default connectWithRedux(
  Toolbuttons,
  ['currChIndex', 'chapters'],
);
