import React from 'react';
import {
  CTForm,
  CTInput,
  CTFormRow,
  CTFileButton,
  CTFormHeading,
  CTFragment
} from 'layout';
import { ChapterImage } from '../components';
import { epub } from '../controllers';

function DownloadBar({
  title,
  cover,
  author,
  filename,
  screenshots = [],
}) {
  return (
    <div className="ct-epb dch-bar-con" data-scroll onClick={epub.nav.closeNavigator}>
      <CTForm
        id="download-form"
        heading="Download ePub"
        details="Title, author, filename, download"
      >
        <CTFormRow>
          <ChapterImage
            id="ee-dl-tb-cover"
            image={cover.value}
            screenshots={screenshots}
            onChooseImage={cover.setValue}
          />
        </CTFormRow>

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

        <CTFormHeading padding="0">Download files</CTFormHeading>

        <CTFragment list padding={[0,15,0,0]}>
          <CTFileButton 
            icon={<i className="fas fa-file-alt" />}
            description="Save as ePub file"
            onClick={epub.data.downloadEPub}
          >
            {filename.value}.epub
          </CTFileButton>

          <CTFileButton 
            icon={<i className="fas fa-file-pdf" />}
            description="Print/Save as PDF file"
            onClick={epub.data.downloadPDF}
          >
            {filename.value}.pdf
          </CTFileButton>

          <CTFileButton 
            icon={<i className="fas fa-file-code" />}
            description="Download HTML/CSS files and images"
            onClick={epub.data.downloadHTML}
          >
            {filename.value}.zip
          </CTFileButton>
        </CTFragment>
      </CTForm>
    </div>
  );
}

export default DownloadBar;
