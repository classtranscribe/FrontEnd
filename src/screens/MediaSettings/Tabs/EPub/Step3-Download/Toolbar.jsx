import React from 'react';
import { Grid } from 'semantic-ui-react';
import { CTForm } from 'components';
import { Button } from 'pico-ui';
import { epub, connectWithRedux } from 'screens/MediaSettings/Utils/epub';
import ChapterImage from '../Step2-EditChapters/ChapterEditor/ChapterImage';

function Toolbar({
  title,
  cover,
  author,
  filename,
  screenshots = [],

  onSaveTitle,
  onSaveCover,
  onSaveAuthor,
  onSaveFilename,
}) {

  const getDownloadOptions = () => ({
    cover,
    title,
    author,
    filename,
  })

  const downloadAsEpub = () => {
    epub.downloadAsEpub(getDownloadOptions());
  }

  const downloadAsHTML = () => {
    epub.downloadAsHTML(getDownloadOptions());
  }

  const downloadAsPDF = () => {
    epub.downloadAsPDF(getDownloadOptions());
  }

  const previewEpub = () => {
    epub.downloadAsPDF(getDownloadOptions(), false);
  }

  return (
    <div data-scroll className="msp-ee-ech-tb msp-ee-dl-tb ct-a-fade-in">
      <div className="w-100">
        <Button round
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon="arrow_back"
          onClick={() => epub.state.toStep(epub.EPUB_STEP_EDIT)}
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

      <div className="ee-ech-tb-btns ee-dl-file-form">
        <Grid columns='equal' stackable>
          <Grid.Row>
            <Grid.Column>
              <CTForm required
                label="ePub Title"
                color="grey"
                placeholder="ePub title"
                onChange={onSaveTitle}
                defaultValue={title}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <CTForm required
                label="Filename"
                color="grey"
                placeholder="Filename"
                onChange={onSaveFilename}
                defaultValue={filename}
              />
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <CTForm required
                label="Author / Instructor"
                color="grey"
                placeholder="Author"
                onChange={onSaveAuthor}
                defaultValue={author}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>

      <hr/>

      <div className="ee-ech-tb-btns">
        <h3>Preview</h3>
        <Button
          classNames="ee-ech-tb-btn" 
          color="black" 
          icon={<i class="fas fa-external-link-alt"></i>}
          onClick={previewEpub}
        >
          Preview ePub in HTML
        </Button>

        <hr/>
      </div>

      <div className="ee-ech-tb-btns">
        <h3>Download</h3>

        <Button //underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon={<i class="fas fa-file-alt"></i>}
          onClick={downloadAsEpub}
        >
          Save as ePub (.epub)
        </Button>

        <Button //underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon={<i className="fas fa-file-pdf"></i>}
          onClick={downloadAsPDF}
        >
          Print/Save as PDF (.pdf)
        </Button>

        <Button //underlined
          classNames="ee-ech-tb-btn ee-ech-tb-btn-me" 
          color="black" 
          icon={<i className="fas fa-file-code"></i>}
          onClick={downloadAsHTML}
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
