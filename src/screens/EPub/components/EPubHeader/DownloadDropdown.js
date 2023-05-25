import React, { useRef, useState } from 'react';
import { CTDropdown } from 'layout';
import { epub } from '../../controllers';
import ToolButton from './ToolButton';

function DownloadDropdown() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = () => setOpen(false);
  const handleChange = (value) => {
    switch (value) {
      case 'I-Note':
        return epub.download.downloadEPub();
      case 'html':
        return epub.download.downloadHTML();
      case 'pdf':
        return epub.download.downloadPDF();
      case 'img':
        return epub.download.downloadScreenshots();
    
      default:
        break;
    }
  };

  const downloadOptions = [
    {
      value: 'I-Note',
      text: 'Epub file (.epub)',
      icon: <i className="fas fa-file-alt" />
    },{
      value:'html',
      text: 'HTML and CSS files (.zip)',
      icon: <i className="fas fa-file-archive" />
    },{
      value: 'pdf',
      text: 'PDF file (.pdf)',
      icon: <i className="fas fa-file-pdf" />
    },{
      value: 'img',
      text: 'Latex and screenshots (.tex)',
      icon: <i className="fas fa-file-image" />
    }
  ];

  return (
    <>
      <ToolButton
        onClick={handleToggle}
        // shortcut="⌘D"
        id="ct-epb-download-dropdown"
        label="Download"
        anchorRef={anchorRef}
        aria-haspopup="true"
        aria-controls={open ? 'ct-epb-download-menu' : undefined}
      />
      <CTDropdown
        id="ct-epb-download-menu"
        options={downloadOptions}
        open={open}
        anchorRef={anchorRef}
        onClose={handleClose}
        onChange={handleChange}
      />
    </>
  );
}

export default DownloadDropdown;
