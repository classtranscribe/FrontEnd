import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { links } from 'utils/links';

import { textBrand, darkTextBrand, logoOutline } from 'assets/images';


export function CTBrand(props) {
  let { 
    darkMode = false,
    small = false,
    logo = false,
  } = props;

  const brandClasses = classNames('ct-header-brand', { small, logo })

  const imgSrc = logo 
                ? logoOutline 
                : darkMode 
                ? darkTextBrand 
                : textBrand;

  return (
    <Link aria-label="Home" className={brandClasses} to={links.home()}>
      <img src={imgSrc} alt="ClassTranscribe Brand" />
    </Link>
  );
}

CTBrand.propTypes = {
  /** The Nav Header supports dark mode */
  darkMode: PropTypes.bool,

  /** True if display logo */
  logo: PropTypes.bool,

  /** The brand supports a smaller size */
  small: PropTypes.bool,
};