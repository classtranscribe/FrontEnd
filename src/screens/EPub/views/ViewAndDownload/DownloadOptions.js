import React, { useState } from 'react';
import { CTFileButton, CTFragment, CTHeading } from 'layout';
import { Checkbox, FormControlLabel } from '@material-ui/core';
import { connectWithRedux, epub } from '../../controllers';

function DownloadOptions(props) {
  const epubData = props.epub;
  const downloadOptions = props.downloadOptions;
  const { filename } = epubData;

  return (
    <CTFragment>
      <CTHeading as="h3" icon="get_app">Download</CTHeading>
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
