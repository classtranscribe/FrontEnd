import React from 'react';
import CTFragment from '../CTFragment';

/**
 * A general footer for ClassTranscribe
 */
function CTFooter() {
  return (
    <CTFragment 
      padding={[50, 20]}
      dFlexCol
      alignItCenter
      as="footer"
      id="ct-footer"
      className="text-center"
    >
      <span>ClassTranscribe source code &copy; 2016-2021 University of Illinois.</span>
      <span>
        Media, including video content, are copyrighted under their current copyright owner.
      </span>
    </CTFragment>
  );
}

export default CTFooter;

