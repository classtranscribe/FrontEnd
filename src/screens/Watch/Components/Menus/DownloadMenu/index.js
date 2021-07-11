import React, { useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { downloadControl, langMap, langOptions, findTransByLanguage } from '../../../Utils';
import './index.scss';

function DownloadMenu({ onClose = null, trans }) {
  const [downloading, setDownloading] = useState('');
  const [disabledList, setDisabledList] = useState([]);

  const langList = langOptions.map((language) =>
    findTransByLanguage(language, trans) || { language });

  const handleDownload = (path, type, info) => async () => {
    setDownloading(info);
    downloadControl.webVTT(
      path,
      info,
      () => setTimeout(() => setDownloading(''), 400),
      () => {
        setDisabledList([...disabledList, path]);
        setDownloading('');
      },
    );
  };

  return (
    <div id="watch-download-menu" className="watch-general-menu" role="menu" position="top">
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
        {langList.map((lang) => (
          <button
            key={`language-menu-item-${lang.language}`}
            className="plain-btn watch-icon-listitem"
            aria-label={langMap[lang.language]}
            onClick={handleDownload(lang.src, 'trans', langMap[lang.language])}
            disabled={!lang.id || disabledList.includes(lang.src)}
            role="menuitem"
          >
            <span tabIndex="-1">
              {downloading === langMap[lang.language] ? (
                <div className="watch-downloading">
                  <Spinner variant="light" animation="border" />
                </div>
              ) : (
                <i className="material-icons watch-icon-icon">save_alt</i>
                )}
              <div className="watch-icon-name">{langMap[lang.language]}</div>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default DownloadMenu;
