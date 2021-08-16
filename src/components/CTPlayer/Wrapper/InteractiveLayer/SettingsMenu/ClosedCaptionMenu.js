import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function ClosedCaptionMenu(props) {
  let {
    openCC,
    language,
    languages,
    onGoBack,
    onOpenCCOptions,
    onCloseCC,
    setLanguage,
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="Closed Caption" onClick={onGoBack} />
      <MenuItem isSubMenu bordered text="Custom" onClick={onOpenCCOptions} />

      <MenuItem
        active={!openCC}
        text="OFF"
        onClick={onCloseCC}
      />

      { languages !== undefined ? languages.map(lang => (
        <MenuItem
          key={lang.code}
          active={openCC && lang.code === language.code}
          text={lang.text}
          onClick={() => setLanguage(lang.code)}
        />
      )) : <div />}
    </div>
  );
}

ClosedCaptionMenu.propTypes = {
  openCC: PropTypes.bool.isRequired,
  language: PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  }).isRequired,
  languages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  })).isRequired,
  onGoBack: PropTypes.func.isRequired,
  onCloseCC: PropTypes.func.isRequired,
  setLanguage: PropTypes.func.isRequired
};

export default ClosedCaptionMenu;
