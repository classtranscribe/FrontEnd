import React from 'react';
import { Button } from 'pico-ui';
import { useInput } from 'hooks';
import {
  CTForm,
  CTInput,
  CTFormRow,
  CTFileButton,
  CTFormHeading,
  CTFragment
} from 'layout';
import { ChapterImage } from './ChapterImage';
import { epub } from '../controllers';

export function useEPubInfo() {
  const epubData = epub.data.data;
  const screenshots = epubData.images;

  const title = useInput(epubData.title, epub.data.saveEPubTitle);
  const filename = useInput(epubData.filename, epub.data.saveEPubFilename);
  const cover = useInput(epubData.cover, epub.data.saveEPubCover);
  const author = useInput(epubData.author, epub.data.saveEPubAuthor);

  return {
    screenshots,
    title,
    filename,
    cover,
    author
  };
}

function EPubInfoForm({
  withCover,
  withDownload,
  title,
  cover,
  author,
  filename,
  screenshots = [],
  ...otherProps
}) {
  return (
    <CTForm
      id="download-form"
      heading="ePub Information"
      details={`Title, author, filename${withDownload ? ', download' : ''}`}
      {...otherProps}
    >
      {
        withCover
        &&
        <CTFormRow>
          <ChapterImage
            id="ee-dl-tb-cover"
            image={cover.value}
            screenshots={screenshots}
            onChooseImage={cover.setValue}
            disableDescription
          />
        </CTFormRow>
      }

      <CTFormHeading padding="0">ePub Information</CTFormHeading>
      <CTFormRow>
        <CTInput
          id="ct-epb-author-title"
          required // underlined
          label="ePub Title"
          placeholder="ePub title"
          onChange={title.onChange}
          value={title.value}
        />
      </CTFormRow>

      <CTFormRow>
        <CTInput
          id="ct-epb-author-filename"
          required // underlined
          label="Filename"
          placeholder="Filename"
          onChange={filename.onChange}
          value={filename.value}
        />
      </CTFormRow>

      <CTFormRow>
        <CTInput
          id="ct-epb-author-input"
          required // underlined
          label="Author / Instructor"
          placeholder="Author"
          onChange={author.onChange}
          value={author.value}
        />
      </CTFormRow>

      {
        withDownload &&
        <>
          <CTFormHeading padding="0">Download files</CTFormHeading>

          <CTFragment justConEnd margin={[-40, 0, 10, 0]} padding={[0, 20]}>
            <Button icon="launch" outlined onClick={epub.download.preview}>
              Preview ePub
            </Button>
          </CTFragment>

          <CTFragment dFlexCol padding={[0,15,0,0]}>
            <CTFileButton 
              icon={<i className="fas fa-file-alt" />}
              description="Save as ePub file"
              onClick={epub.download.downloadEPub}
            >
              {filename.value}.epub
            </CTFileButton>

            <CTFileButton 
              icon={<i className="fas fa-file-archive" />}
              description="Save as HTML files with CSS styles and images"
              onClick={epub.download.downloadHTML}
            >
              {filename.value}.zip
            </CTFileButton>

            <CTFileButton 
              icon={<i className="fas fa-file-pdf" />}
              description="Print/Save as PDF file"
              onClick={epub.download.downloadPDF}
            >
              {filename.value}.pdf
            </CTFileButton>

            <CTFileButton 
              icon={<i className="fas fa-file-image" />}
              description="Save all the screenshots of the ePub data"
              onClick={epub.download.downloadScreenshots}
            >
              {filename.value} - screenshots.zip
            </CTFileButton>
          </CTFragment>
        </>
      }
    </CTForm>
  );
}

export default EPubInfoForm;
