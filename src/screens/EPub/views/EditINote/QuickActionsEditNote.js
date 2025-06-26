import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';

import ButtonGroup from '@material-ui/core/ButtonGroup';
import { CTFragment, useButtonStyles } from 'layout';
import { connect } from 'react-redux';

function QuickActionsEditNote({ chapters = {}, images, currChIndex = 0, dispatch }) {
  const btnStyles = useButtonStyles();
  const btnClasses = cx(btnStyles.tealLink, 'justify-content-start');
  if (currChIndex >= chapters.length) { currChIndex = 0; }
  // const showResetBtn = chapters.length > 1; // || chapters[0].subChapters.length > 0;
  const showResetBtn = false; // currently disabled, since there are no default chapters stored
  const showSplitAllBtn = chapters.length !== images.length;

  return (
    <CTFragment margin="10" padding={[15, 10]} width="auto">
      {/* <CTHeading uppercase as="h4" icon="offline_bolt">Quick Split</CTHeading> */}


      {
        showResetBtn
        &&
        <CTFragment margin="7" width="auto">
          <ButtonGroup fullWidth>
            <Button
              className={btnClasses}
              onClick={() => dispatch({ type: 'epub/resetToDefaultChapters' })}
            >
              Reset to Default Chapters
            </Button>
          </ButtonGroup>
        </CTFragment>
      }

      {
        showSplitAllBtn
        &&
        <CTFragment margin="7" width="auto">
          <ButtonGroup fullWidth>
            <Button
              className={btnClasses}
              onClick={() => dispatch({ type: 'epub/splitChaptersByScreenshots', payload: {} })}
            >
              Split Chapters by Screenshots
            </Button>
          </ButtonGroup>
        </CTFragment>
      }



      {/* 
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
      </CTFragment> */}
    </CTFragment>

  );
}

export default connect(({ epub: { currChIndex, epub: { chapters }, images } }) => ({
  currChIndex, chapters, images
}))(QuickActionsEditNote);
