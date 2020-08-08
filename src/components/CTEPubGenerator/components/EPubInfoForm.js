import React from 'react';
import { useInput } from 'hooks';
import {
  CTForm,
  CTInput,
  CTFormRow,
  CTFileButton,
  CTFormHeading,
  CTFragment
} from 'layout';
import { ChapterImage } from ".";
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
          />
        </CTFormRow>
      }

      <CTFormHeading padding="0">ePub Information</CTFormHeading>
      <CTFormRow>
        <CTInput
          required // underlined
          label="ePub Title"
          placeholder="ePub title"
          onChange={title.onChange}
          value={title.value}
        />
      </CTFormRow>

      <CTFormRow>
        <CTInput
          required // underlined
          label="Filename"
          placeholder="Filename"
          onChange={filename.onChange}
          value={filename.value}
        />
      </CTFormRow>

      <CTFormRow>
        <CTInput
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

          <CTFragment list padding={[0,15,0,0]}>
            <CTFileButton 
              icon={<i className="fas fa-file-alt" />}
              description="Save as ePub file"
              onClick={epub.download.downloadEPub}
            >
              {filename.value}.epub
            </CTFileButton>

            <CTFileButton 
              icon={<i className="fas fa-file-pdf" />}
              description="Print/Save as PDF file"
              onClick={epub.download.downloadPDF}
            >
              {filename.value}.pdf
            </CTFileButton>

            <CTFileButton 
              icon={<i className="fas fa-file-code" />}
              description="Download HTML/CSS files and images"
              onClick={epub.download.downloadHTML}
            >
              {filename.value}.zip
            </CTFileButton>
          </CTFragment>
        </>
      }
    </CTForm>
  );
}

export default EPubInfoForm;
