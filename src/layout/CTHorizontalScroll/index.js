import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import { isMobile } from 'react-device-detect';
import OverflowWrapper from 'react-overflow-wrapper';
import ArrowButton from './ArrowButton';
import './index.scss';

function CTHorizontalScroll(props) {
  const { children } = props;

  const arrowLeftElement = <ArrowButton isLeft />;
  const arrowRightElement = <ArrowButton />;
  const scrollClasses = cx('ct-h-scroll', 'scroll-con', { mobile: isMobile });

  return (
    <OverflowWrapper
      leftIcon={arrowLeftElement}
      rightIcon={arrowRightElement}
      className={scrollClasses}
    >
      {children}
    </OverflowWrapper>
  );
}

CTHorizontalScroll.propTypes = {
  /** A list of react elements */
  children: PropTypes.node
};

export default CTHorizontalScroll;

