import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup'
import { CTFragment, useButtonStyles } from 'layout';
import { timestr } from 'utils';
import { epub as epubController, connectWithRedux } from '../../controllers';

function Toolbuttons({ currChIndex = 0, epub = {}, dispatch }) {
  const { chapters = [] } = epub;
  const btnStyles = useButtonStyles();
  const { start, end, title } = chapters[currChIndex];
  const startTimeStr = timestr.toPrettierTimeString(start);
  const endTimeStr = timestr.toPrettierTimeString(end);

  const watchInPlayer = () => {
    dispatch({
      type: 'epub/openPlayer', payload: {
        title: `Chapter ${currChIndex + 1}: ${title}`, start, end
      }
    });
  };

  const onEditStructure = () => {
    dispatch({ type: 'epub/setView', payload: epubController.const.EpbEditStructure });
  };

  const toPrevCh = () => {
    dispatch({ type: 'epub/navigateChapter', payload: chapters[currChIndex - 1].id });
  };

  const toNextCh = () => {
    if(chapters[currChIndex + 1]) {
      dispatch({ type: 'epub/navigateChapter', payload: chapters[currChIndex + 1].id });
    }
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
      <Button
        startIcon={<span className="material-icons">layers</span>}
        className={cx(btnStyles.tealLink, 'justify-content-start')}
        onClick={onEditStructure}
        size="large"
      >
        Edit Chapter Structure
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
            disabled={currChIndex >= chapters.length - 1}
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
  ['currChIndex', 'epub'],
);
