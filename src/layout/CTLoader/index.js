import React from 'react';
import PropTypes from 'prop-types';
import CTFragment from '../CTFragment';
import './index.css';

function CTLoader(props) {
  let { darkMode = false, height = 400 } = props;

  const loaderStyles = { height: `${height }px` };
  const fragmentProps = {
    center: true,
    className: 'ct-loader',
    styles: loaderStyles,
    'data-dark': darkMode,
  };

  return (
    <CTFragment {...fragmentProps}>
      <div className="flow">
        <div className="flow-dot" />
        <div className="flow-dot" />
        <div className="flow-dot" />
      </div>
    </CTFragment>
  );
}

CTLoader.propTypes = {
  /** The loader supports dark mode */
  darkMode: PropTypes.bool,

  /** The height of the loader */
  height: PropTypes.number
};

export default CTLoader;

