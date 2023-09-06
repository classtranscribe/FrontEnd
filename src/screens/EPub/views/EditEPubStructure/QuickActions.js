import React, {useState} from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CTHeading, CTFragment, useButtonStyles } from 'layout';
import { timestr } from 'utils';
import { connect } from 'dva'
import { epub as epubOld } from '../../controllers';

function QuickActions({ chapters = {}, items, currChIndex = 0, dispatch }) {
  const btnStyles = useButtonStyles();
  const btnClasses = cx(btnStyles.tealLink, 'justify-content-start');
  if (currChIndex >= chapters.length) {currChIndex = 0;}
  const { start, end, title } = chapters[currChIndex];
  const startTimeStr = timestr.toPrettierTimeString(start);
  const endTimeStr = timestr.toPrettierTimeString(end);
  const showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  const showSplitAllBtn = chapters.length !== items.length;
  
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

  // default state is min word count of 25 for split by screenshots
  const [wordInput, setWordInput] = useState("25");
  const handleOnSubmit = (event) => {
    event.preventDefault();
    dispatch({type: 'epub/splitChaptersByScreenshots', payload:{wc: wordInput}});
  };
  const handleOnWcChange = (event) => {
    setWordInput(event.target.value);
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
          <Button
            className={btnClasses}
            onClick={() => dispatch({type: 'epub/splitChaptersByScreenshots', payload:{wc: wordInput}})}
          >
            Split Chapters by Screenshots
          </Button>
        }
        {/* {
          showSubdivideAllBtn
          &&
          <Button className={btnClasses} onClick={epub.data.subdivideChaptersByScreenshots}>
            Subdivide Chapters by Screenshots
          </Button>
        } */}
      </ButtonGroup>
      <CTFragment dFlexCol>
        <form onSubmit={handleOnSubmit}> 
          <TextField
            fullWidth
            variant='standard'
            size='small'
            value={wordInput}
            onChange={handleOnWcChange}
            sx={{
              backgroundColor: "#F0F0F0",
              border: "1px solid black",
              borderRadius: "5px",
              padding: "10px",
              margin: "10rem 1rem"
            }}
            defaultValue='30'
            helperText='Enter Minimum Word Count For Each Chapter (Default = 25)'
          />  
        </form>
      </CTFragment>
    </CTFragment>
    
  );
}

export default connect(({ epub: { currChIndex, epub: { chapters }, items }, loading }) => ({
  currChIndex, chapters, items
}))(QuickActions);
