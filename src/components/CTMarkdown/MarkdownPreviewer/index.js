import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { html } from 'utils';
import './index.scss';

/**
 * An Markdown Preview converter
 */
function MarkdownPreviewer(props) {
  const { value, className, parseMarkdown } = props;
  const previewHTML = typeof parseMarkdown === 'function'
                    ? parseMarkdown(value) 
                    : html.markdown(value);

  const previewClasses = cx('ct-md', 'preview', className);

  return (
    <div className={previewClasses}>
      <div className="ct-md preview-html" dangerouslySetInnerHTML={{ __html: previewHTML }} />
    </div>
  );
}

MarkdownPreviewer.propTypes = {
  /** The  */
  value: PropTypes.string,

  /** Additional Classes */
  className: PropTypes.string,

  /** Custom parseMarkdown function */
  parseMarkdown: PropTypes.func
};

export default MarkdownPreviewer;
