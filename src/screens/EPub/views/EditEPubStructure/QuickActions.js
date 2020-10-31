import React from 'react';
import cx from 'classnames';
import Button from '@material-ui/core/Button';
import { CTHeading, CTFragment, useButtonStyles } from 'layout';
import { epub, connectWithRedux } from '../../controllers';

function QuickActions({ chapters }) {
  const btnStyles = useButtonStyles();
  const btnClasses = cx(btnStyles.tealLink, 'justify-content-start');
  const items = epub.data.data.items;

  const showResetBtn = chapters.length > 1 || chapters[0].subChapters.length > 0;
  const showSplitAllBtn = chapters.length !== items.length;
  const showSubdivideAllBtn = true;

  return (
    <CTFragment bordered borderRadius="5" margin="10" padding={[15,10]} width="auto">
      <CTHeading uppercase as="h4" icon="offline_bolt">Quick Actions</CTHeading>

      <CTFragment dFlexCol>
        {
          showResetBtn
          &&
          <Button
            className={btnClasses}
            onClick={epub.data.resetToDefaultChapters}
          >
            Reset to Default Chapters
          </Button>
        }
        {
          showSplitAllBtn
          &&
          <Button
            className={btnClasses} 
            onClick={epub.data.splitChaptersByScreenshots}
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
      </CTFragment>
    </CTFragment>
  );
}

export default connectWithRedux(
  QuickActions,
  ['chapters']
);
