import React from 'react';
import { CTFragment } from 'layout';
import ViewDropdown from './ViewDropdown';

function EPubRightActions() {
  return (
    <CTFragment alignItCenter width="auto" margin={[0,20,0,0]}>
      <ViewDropdown />
    </CTFragment>
  );
}

export default EPubRightActions;
