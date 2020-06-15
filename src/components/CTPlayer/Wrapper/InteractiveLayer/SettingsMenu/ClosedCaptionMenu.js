import React from 'react';
import PropTypes from 'prop-types';
import MenuItem from './MenuItem';

function ClosedCaptionMenu(props) {
  let {
    openCC,
    language,
    languages,
    onGoBack,
    onCloseCC,
    setLanguage,
  } = props;

  return (
    <div className="ctp settings-menu">
      <MenuItem goBack text="GO BACK" onClick={onGoBack} />

      <MenuItem
        active={!openCC}
        text="OFF"
        onClick={onCloseCC}
      />

      {languages.map(lang => (
        <MenuItem
          key={lang.code}
          active={lang.code === language.code}
          text={lang.text}
          onClick={() => setLanguage(lang.code)}
        />
      ))}
    </div>
  );
}

ClosedCaptionMenu.propTypes = {
  openCC: PropTypes.bool,
  language: PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  }),
  languages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string,
    text: PropTypes.string
  })),
  onGoBack: PropTypes.func,
  onCloseCC: PropTypes.func,
  setLanguage: PropTypes.func
};

export default ClosedCaptionMenu;
