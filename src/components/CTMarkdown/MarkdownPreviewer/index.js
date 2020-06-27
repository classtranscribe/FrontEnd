import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { html } from 'utils';
import Prism from 'prismjs';
import './index.scss';
import 'prismjs/themes/prism-tomorrow.css';

html.registerHighlightLanguages();

/**
 * An Markdown Preview converter
 */
function MarkdownPreviewer(props) {
  const {
    value = '',
    className,
    children,
    parseMarkdown
  } = props;

  useEffect(() => {
    Prism.highlightAll();
  }, [value]);

  const previewClasses = cx('ct-md', 'preview', className);
  const htmlClasses = cx('ct-md', 'preview-html');
  let previewElement = null;
  if (value) {
    const previewHTML = typeof parseMarkdown === 'function'
                      ? parseMarkdown(value) 
                      : html.markdown(value);

    const previewProps = {
      className: htmlClasses,
      dangerouslySetInnerHTML: { __html: previewHTML }
    };

    previewElement = <div {...previewProps} />;
  } else {
    previewElement = (
      <div className={htmlClasses}>
        {children}
      </div>
    );
  }

  return (
    <div className={previewClasses}>
      {previewElement}
    </div>
  );
}

MarkdownPreviewer.propTypes = {
  /** The  */
  value: PropTypes.string,

  /** Additional Classes */
  className: PropTypes.string,

  /** The Markdown parsed html content */
  children: PropTypes.node,

  /** Custom parseMarkdown function */
  parseMarkdown: PropTypes.func
};

export default MarkdownPreviewer;
