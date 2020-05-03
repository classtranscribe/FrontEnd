import React, { useState } from 'react';
import _ from 'lodash';
import { Button } from 'pico-ui';
import { EpubMenu } from '../../../../EpubMenu';
import { epub } from 'screens/MediaSettings/Utils';

const { 
  EPUB_HEADING_1,
  EPUB_HEADING_2,
  EPUB_HEADING_3
} = epub;

let fontStyle = {
  color: 'black',
  fontWeight: 'bold',
  fontFamily: '"Arial", sans-serif'
}

const headings = [
  { text: EPUB_HEADING_1, value: EPUB_HEADING_1, style: { ...fontStyle, fontSize: '1.41428571rem' } },
  { text: EPUB_HEADING_2, value: EPUB_HEADING_2, style: { ...fontStyle, fontSize: '1.28571429rem' } },
  { text: EPUB_HEADING_3, value: EPUB_HEADING_3, style: { ...fontStyle, fontSize: '1.07142857rem' } },
]

const headingPrefix = {
  [EPUB_HEADING_1]: '<!-- Chapter -->\n## ',
  [EPUB_HEADING_2]: '<!-- Sub-chapter -->\n### ',
  [EPUB_HEADING_3]: '#### ',
}

function HeadingPicker({
  dark,
  cursor,
}) {

  const [anchorEl, setAnchorEl] = useState(null);

  const handlePickHeading = value => {
    if (!cursor) return;

    let prefix = headingPrefix[value];
    let row = cursor.cursor.row;
    let doc = cursor.doc;
    doc.insert({ row, column: 0 }, prefix);
  }

  return (
    <EpubMenu
      trigger={
        <Button 
          classNames="mr-2"
          icon="arrow_drop_down"
          color={dark ? "black" : 'transparent'}
          onClick={e => setAnchorEl(e.currentTarget)}
        >
          Headings
        </Button>
      }
      items={headings}
      anchorEl={anchorEl}
      setAnchorEl={setAnchorEl}
      handleItemClick={handlePickHeading}
    />
  );
}

export default HeadingPicker;
