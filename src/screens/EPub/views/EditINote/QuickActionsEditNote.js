import React, {useState} from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CTHeading, CTFragment, useButtonStyles } from 'layout';
import { connect } from 'dva'

function QuickActionsEditNote({ chapters = {}, items, currChIndex = 0, dispatch }) {
  const btnStyles = useButtonStyles();
  const btnClasses = cx(btnStyles.tealLink, 'justify-content-start');
  if (currChIndex >= chapters.length) {currChIndex = 0;}
  const showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  const showSplitAllBtn = chapters.length !== items.length;

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
}))(QuickActionsEditNote);
