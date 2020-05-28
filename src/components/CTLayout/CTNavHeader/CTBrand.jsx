import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { links } from 'utils/links';

import { textBrand, darkTextBrand } from 'assets/images';


export function CTBrand(props) {
  let { darkMode = false } = props;

  const imgSrc = darkMode ? darkTextBrand : textBrand;

  return (
    <Link className="ct-header-brand" to={links.home()}>
      <img src={imgSrc} alt="ClassTranscribe Brand" />
    </Link>
  );
}

CTBrand.propTypes = {
  /** The Nav Header supports dark mode */
  darkMode: PropTypes.bool
};