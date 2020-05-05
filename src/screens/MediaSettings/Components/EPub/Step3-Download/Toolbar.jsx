import React from 'react';
import { Button } from 'pico-ui';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import ChapterTitle from '../Step2-EditChapters/ChapterEditor/ChapterTitle';

function Toolbar({
  title,
  author,
  filename,

  onSaveAuthor,
  onSaveFilename,
}) {

  

  const downloadAsEpub = () => {
    epub.downloadAsEpub({
      title,
      author,
      filename,
    });
  }

  return (
    <div className="msp-ee-ech-tb bottom ct-a-fade-in">
      <div className="ee-ech-tb-btns">
        <label className="ee-dl-tb-label" htmlFor="ee-dl-tb-filename">Filename</label>
        <ChapterTitle focus
          id="ee-dl-tb-filename"
          value={filename}
          className="ee-dl-tb-filename"
          headingType="div"
          aria-label="Filename"
          onSave={onSaveFilename}
        />
      </div>
      <div className="ee-ech-tb-btns mb-5">
        <label className="ee-dl-tb-label" htmlFor="ee-dl-tb-author">Author</label>
        <ChapterTitle focus
          id="ee-dl-tb-author"
          value={author}
          className="ee-dl-tb-filename"
          headingType="div"
          aria-label="Author"
          onSave={onSaveAuthor}
        />
      </div>

      <div className="ee-ech-tb-btns mb-5">
        <h4>Download</h4>
        <Button underlined
          classNames="ee-ech-tb-btn mb-2" 
          color="transparent" 
          icon={<i className="fas fa-book"></i>}
          onClick={downloadAsEpub}
        >
          Save as ePub (.epub)
        </Button>

        <Button underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="transparent" 
          icon={<i className="fas fa-file-code"></i>}
          // onClick={}
        >
          Save as HTML (.html)
        </Button>
      </div>

      <div className="ee-ech-tb-btns">
        <Button round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon="arrow_back"
          onClick={() => epub.state.setStep(epub.EPUB_STEP_EDIT)}
        >
          Back to Chapter Editor
        </Button>
      </div>
    </div>
  );
}

export default connectWithRedux(
  Toolbar,
  [],
  [],
  ['media']
);
