import React from 'react';
import { Button } from 'pico-ui';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import ChapterTitle from '../Step2-EditChapters/ChapterEditor/ChapterTitle';
import ChapterImage from '../Step2-EditChapters/ChapterEditor/ChapterImage';

function Toolbar({
  title,
  cover,
  author,
  filename,
  screenshots = [],

  onSaveCover,
  onSaveAuthor,
  onSaveFilename,
}) {

  const downloadAsEpub = () => {
    epub.downloadAsEpub({
      cover,
      title,
      author,
      filename,
    });
  }

  return (
    <div data-scroll className="msp-ee-ech-tb msp-ee-dl-tb ct-a-fade-in">
      <div className="w-100">
        <Button round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon="arrow_back"
          onClick={() => epub.state.setStep(epub.EPUB_STEP_EDIT)}
        >
          Back to Chapter Editor
        </Button>
      </div>

      <hr/>
      <h3>File Information</h3>


      <div className="ee-ech-tb-btns">
        <label className="ee-dl-tb-label" htmlFor="ee-dl-tb-cover">Cover Image</label>
        <ChapterImage
          id="ee-dl-tb-cover"
          image={cover}
          screenshots={screenshots}
          onChooseImage={onSaveCover}
        />
      </div>

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
      <div className="ee-ech-tb-btns">
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

      <hr/>

      <div className="ee-ech-tb-btns">
        <h3>Download</h3>
        <Button underlined
          classNames="ee-ech-tb-btn" 
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
    </div>
  );
}

export default connectWithRedux(
  Toolbar,
  [],
  [],
  ['media']
);
