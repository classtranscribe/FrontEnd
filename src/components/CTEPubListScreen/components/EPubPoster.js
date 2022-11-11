import React from 'react';
import { epubExampleTop, epubExampleBottom } from 'assets/images';
import { CTFragment } from 'layout';

function EPubPoster() {
  return (
    <CTFragment center padding={[0,40]} id="ct-epb-poster">
      <CTFragment h100 dFlexCol alignItCenter justConBetween overflowHidden>
        <img
          className="w-100 ct-pointer-event-none" 
          src={epubExampleTop}
          alt="ePub generator screenshot"
          aria-hidden="true"
        />

        <h1>
          Convert Your Lectures to I-Note Books
        </h1>

        <img 
          className="w-100 ct-pointer-event-none" 
          src={epubExampleBottom} 
          alt="ePub generator screenshot"
          aria-hidden="true"
        />
      </CTFragment>
    </CTFragment>
  );
}

export default EPubPoster;
