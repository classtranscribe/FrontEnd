import React from 'react';
import CTFragment from '../CTFragment';

/**
 * A general footer for ClassTranscribe
 */
function CTFooter() {
  const year = Math.max( new Date().getFullYear(),2024);
  return (
    <CTFragment 
      padding={[50, 20]}
      dFlexCol
      alignItCenter
      as="footer"
      id="ct-footer"
      className="text-center"
      role='contentinfo'
    >
      <span>ClassTranscribe source code &copy; 2016-{year} University of Illinois.</span>
      <span>
        Media, including video content, are copyrighted under their current copyright owner.
      </span>
    </CTFragment>
  );
}

export default CTFooter;

