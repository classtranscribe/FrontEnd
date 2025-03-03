import React, { useState } from 'react';
import { CTFileButton, CTFragment, CTHeading } from 'layout';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { epub, connectWithRedux } from '../../controllers';

function DownloadOptions(props) {
  const epubData = props.epub;
  const { filename } = epubData;

  const [downloadOptions, setDownloadOptions] = useState({
    imagesFirst: false,
    invertColors: false
  });

  // Handle change for each checkbox
  const handleCheckboxChange = (event) => {
    // eslint-disable-next-line no-console
    console.log("checked", event.target);
    const { name, checked } = event.target;
    // eslint-disable-next-line no-console
    console.log("checked", name, checked);

    setDownloadOptions((prevState) => ({
      ...prevState,
      [name]: checked // Update the specific checkbox state
    }));
  };

  return (
    <CTFragment>
      <CTHeading as="h3" icon="get_app">Download</CTHeading>
      <FormControlLabel
        control={
          <Checkbox
            checked={downloadOptions.imagesFirst}
            onChange={handleCheckboxChange}
            name="imagesFirst"
            color="primary"
          />
        }
        label="Place Images at the Start of Chapters"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={downloadOptions.invertColors}
            onChange={handleCheckboxChange}
            name="invertColors"
            color="primary"
          />
        }
        label="Invert Colors of Images"
      />
      <CTFragment dFlexCol padding={[0, 15, 0, 0]}>
        <CTFileButton
          icon={<i className="fas fa-file-alt" />}
          description="Save as I-Note file"
          onClick={() => epub.download.downloadEPub(downloadOptions)}
        >
          {filename}.epub
        </CTFileButton>

        <CTFileButton
          icon={<i className="fas fa-file-archive" />}
          description="Save as HTML files with CSS styles and images"
          onClick={() => epub.download.downloadHTML(downloadOptions)}
        >
          {filename}.zip
        </CTFileButton>

        <CTFileButton
          icon={<i className="fas fa-file-pdf" />}
          description="Print/Save as PDF file"
          onClick={() => epub.download.downloadPDF(downloadOptions)}
        >
          {filename}.pdf
        </CTFileButton>

        <CTFileButton
          icon={<i className="fas fa-file-image" />}
          description="Save latex with all the screenshots of the I-Note data"
          onClick={() => epub.download.downloadLatex(downloadOptions)}
        >
          {filename} - latex.zip
        </CTFileButton>
      </CTFragment>
    </CTFragment>
  );
}

export default connectWithRedux(
  DownloadOptions,
  ['epub']
);
