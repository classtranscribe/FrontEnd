import React from 'react';
import { epubExampleTop, epubExampleBottom } from 'assets/images';
import { CTFragment } from 'layout';

function EPubPoster() {
  return (
    <CTFragment center padding={[0,40]} width="60%">
      <CTFragment h100 dFlexCol alignItCenter justConBetween overflowHidden>
        <img
          className="ct-epb epub-example w-100" 
          src={epubExampleTop}
          alt="ePub generator screenshot"
        />

        <h1>
          Convert Your Lectures to ePub Books
        </h1>

        <img 
          className="ct-epb epub-example w-100" 
          src={epubExampleBottom} 
          alt="ePub generator screenshot"
        />
      </CTFragment>
    </CTFragment>
  );
}

export default EPubPoster;
