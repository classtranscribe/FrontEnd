import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import { CTHeading, CTFragment, useButtonStyles, CTInput } from 'layout';
import { timestr } from 'utils';
import { connect } from 'dva'
import { epub as epubOld } from '../../controllers';
import { useInput } from 'hooks';

function QuickActions({ chapters = {}, items, currChIndex = 0, dispatch }) {
  const btnStyles = useButtonStyles();
  const btnClasses = cx(btnStyles.tealLink, 'justify-content-start');
  const { start, end, title } = chapters[currChIndex];
  const startTimeStr = timestr.toPrettierTimeString(start);
  const endTimeStr = timestr.toPrettierTimeString(end);
  const showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  const showSplitAllBtn = chapters.length === 1;
  const minimumWordCountForSplit = useInput(0);
  // const showSubdivideAllBtn = true;

  const watchInPlayer = () => {
    dispatch({
      type: 'epub/openPlayer', payload: {
        title: `Chapter ${currChIndex + 1}: ${title}`, start, end
      }
    });
  };

  const onEditChapters = () => {
    dispatch({ type: 'epub/setView', payload: epubOld.const.EpbEditChapter });
  };

  return (
    <CTFragment margin="10" padding={[15, 10]} width="auto">
      <CTHeading uppercase as="h4" icon="home_repair_service">Actions</CTHeading>
      <CTFragment dFlexCol>
        <Button
          startIcon={<span className="material-icons">play_circle_filled</span>}
          className={cx(btnStyles.tealLink, 'justify-content-start')}
          onClick={watchInPlayer}
          size="large"
        >
          Watch <span className="ml-1">{startTimeStr} - {endTimeStr}</span>
        </Button>
        <Button
          startIcon={<span className="material-icons">dashboard</span>}
          className={btnClasses}
          onClick={onEditChapters}
          size="large"
        >
          Edit chapter content
        </Button>
      </CTFragment>

      <CTHeading uppercase as="h4" icon="offline_bolt">Quick Split</CTHeading>
      <ButtonGroup fullWidth>
        {
          showResetBtn
          &&
          <Button
            className={btnClasses}
            onClick={() => dispatch({type: 'epub/resetToDefaultChapters'})}
          >
            Reset to Default Chapters
          </Button>
        }
        {
          showSplitAllBtn
          &&
          <CTFragment>
              <CTInput
                id="ct-epb-min-word-count"
                label="Min Word Count"
                placeholder="0"
                onChange = {minimumWordCountForSplit.onChange}
              />
              <Button
                className={btnClasses}
                onClick={() => dispatch({type: 'epub/splitChaptersByScreenshots', payload: { minimumWordCount: minimumWordCountForSplit}})}
              >
                Split Chapters by Screenshots
              </Button>
          </CTFragment>
        }
        {/* {
          showSubdivideAllBtn
          &&
          <Button className={btnClasses} onClick={epub.data.subdivideChaptersByScreenshots}>
            Subdivide Chapters by Screenshots
          </Button>
        } */}
      </ButtonGroup>
    </CTFragment>
  );
}

export default connect(({ epub: { currChIndex, epub: { chapters }, items }, loading }) => ({
  currChIndex, chapters, items
}))(QuickActions);