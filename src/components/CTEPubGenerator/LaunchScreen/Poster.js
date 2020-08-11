import React from 'react';
import { epubExampleTop, epubExampleBottom } from 'assets/images';

function Poster() {
  return (
    <div className="ct-epb launch-poster-con">
      <div className="ct-epb launch-poster">
        <img 
          className="ct-epb epub-example" 
          src={epubExampleTop}
          alt="ePub generator screenshot"
        />

        <h1>
          Convert Your Lectures to ePub Books
        </h1>

        <img 
          className="ct-epb epub-example" 
          src={epubExampleBottom} 
          alt="ePub generator screenshot"
        />
      </div>
    </div>
  );
}

export default Poster;
