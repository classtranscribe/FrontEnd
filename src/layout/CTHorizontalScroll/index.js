import React from 'react';
import PropTypes from 'prop-types';
import OverflowWrapper from 'react-overflow-wrapper';
import ArrowButton from './ArrowButton';
import './index.scss';

function CTHorizontalScroll(props) {
  const { children } = props;

  const arrowLeftElement = <ArrowButton isLeft />;
  const arrowRightElement = <ArrowButton />;

  return (
    <OverflowWrapper
      leftIcon={arrowLeftElement}
      rightIcon={arrowRightElement}
      className="ct-h-scroll scroll-con"
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

