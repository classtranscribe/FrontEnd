import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from 'dva/router';
import { links } from 'utils/links';

import { textBrand, darkTextBrand, logoOutline } from 'assets/images';


export function CTBrand(props) {
  let { 
    size = 'normal',
    darkMode,
    small,
    medium,
    logo,
    disabled
  } = props;

  const brandClasses = classNames('ct-header-brand', size, { small, medium, logo })

  const imgSrc = logo 
                ? logoOutline 
                : darkMode 
                ? darkTextBrand 
                : textBrand;

  const linkProps = {
    'aria-label': 'Home',
    tabIndex: disabled ? '-1' : '0',
    className: brandClasses,
    to: {pathname: links.home(), search: '', hash: ''}
  };

  return (
    <Link {...linkProps}>
      <img src={imgSrc} alt="ClassTranscribe" />
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

  /** Brand size, one of 'small', 'normal', 'large' */
  size: PropTypes.oneOf(['small', 'normal', 'large'])
};