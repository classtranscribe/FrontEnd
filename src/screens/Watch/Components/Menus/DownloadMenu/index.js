/* eslint-disable no-console */
import _ from 'lodash'
import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { downloadControl} from '../../../Utils';
import './index.scss';

function DownloadMenu({ onClose = null, trans }) {
  const [downloading, setDownloading] = useState([]);
  const [disabledList, setDisabledList] = useState([]);

  // const langList = langOptions.map((language) =>
  //  findTransByLanguages( trans, [language]) || { language });

  const handleDownload = (id) => async () => {
    setDownloading(downloading.concat(id));
    let tran = _.find(trans, t=>t.id === id);
    let filename = `${tran.transcriptionType?'Caption':'Description'}-${id}`;
    console.log(tran);
    console.log(filename);
    
    downloadControl.webVTT(
      tran.path,
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
        TRANSCRIPTIONS <span className="file-type">WebVTT</span>
      </h3>
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
