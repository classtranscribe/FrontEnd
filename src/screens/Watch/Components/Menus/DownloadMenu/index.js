/* eslint-disable no-console */
import _ from 'lodash'
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { downloadControl} from '../../../Utils';
import './index.scss';

function DownloadMenu({ onClose = null, trans }) {
  const [downloading, setDownloading] = useState([]);
  const [disabledList, setDisabledList] = useState([]);
  const [format, setFormat] = useState('vtt');
  const otherFormat = format === 'vtt' ? 'txt' : 'vtt';
  const handleSwitchFormat = (f) => () => setFormat(f);

  // const langList = langOptions.map((language) =>
  //  findTransByLanguages( trans, [language]) || { language });

  const handleDownload = (id) => async () => {
    setDownloading(downloading.concat(id));
    let tran = _.find(trans, t=>t.id === id);
    let filename = `${tran.transcriptionType?'Description':'Caption'}-${id}`;
    // console.log(tran);
    // console.log(filename);
    // eslint-disable-next-line no-alert
    
    downloadControl.webVTT(
      tran.src, format,
      filename,
      () => setTimeout(() => setDownloading(''), 400),
      () => {
        setDisabledList([...disabledList, id]);
        setDownloading(downloading.filter((i) => {return i !== id}));
      },
    );
  };

  return (
    <div
      id="watch-download-menu"
      className="watch-general-menu"
      role="menu"
    >
      <button
        className="plain-btn watch-menu-close-btn watch-screenmode-menu-close-btn"
        onClick={onClose}
      >
        <i className="material-icons">close</i>
      </button>
      <h3 className="watch-download-menu-title">
        <i className="material-icons watch-icon-icon">speaker_notes</i>
        TRANSCRIPTIONS 
      </h3>
      <div className="watch-icon-list file-type">
        <span className='watch-icon-name'>Download as a .{format} file</span>
        <button
          key="download-menu-format"
          className="plain-btn watch-icon-listitem"
          onClick={handleSwitchFormat(otherFormat)}
          role="menuitem"
        >Switch to {otherFormat} format
        </button>
      </div>
     
      <div className="watch-icon-list" />
      <div className="watch-icon-list">
        {trans.map((t) => (
          <button
            key={`download-menu-item-${t.id}`}
            className="plain-btn watch-icon-listitem"
            aria-label="Download"
            onClick={handleDownload(t.id)}
            role="menuitem"
          >
            <span tabIndex="-1">
              {downloading.includes(t.id)? (
                <div className="watch-downloading">
                  <Spinner variant="light" animation="border" />
                </div>
              ) : (
                <i className="material-icons watch-icon-icon">save_alt</i>
              )}
              <div className="watch-icon-name">{t.publicLabel}</div>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DownloadMenu;
