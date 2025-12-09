import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { html } from 'utils';
import Prism from 'prismjs';
import './index.scss';
// import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/themes/prism.css';

html.registerHighlightLanguages();

/**
 * An Markdown Preview converter
 */
function MarkdownPreviewer(props) {
  const {
    id,
    value = '',
    className,
    children,
    parseMarkdown,
    ...otherProps
  } = props;

  const previewRef = useRef(null);

  useEffect(() => {
    Prism.highlightAll();
    
    // Render KaTeX math expressions if KaTeX is available
    if (typeof window !== 'undefined' && window.katex && window.renderMathInElement && previewRef.current) {
      try {
        window.renderMathInElement(previewRef.current, {
          delimiters: [
            {left: '$$', right: '$$', display: true},
            {left: '$', right: '$', display: false},
            {left: '\\[', right: '\\]', display: true},
            {left: '\\(', right: '\\)', display: false}
          ],
          throwOnError: false
        });
      } catch (error) {
        // Silently fail if KaTeX rendering fails
        console.warn('KaTeX rendering error:', error);
      }
    }
  }, [value]);

  const previewClasses = cx('ct-md', 'preview', className);
  const htmlClasses = cx('ct-md', 'preview-html');
  let previewElement = null;
  if (value) {
    const previewHTML = typeof parseMarkdown === 'function'
                      ? parseMarkdown(value) 
                      : html.markdown(value);

    const previewProps = {
      id,
      className: htmlClasses,
      dangerouslySetInnerHTML: { __html: previewHTML },
      ...otherProps
    };

    previewElement = <div {...previewProps} ref={previewRef} />;
  } else {
    previewElement = (
      <div id={id} className={htmlClasses} ref={previewRef} {...otherProps}>
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
  id: PropTypes.string,

  /** The markdown text to preview */
  value: PropTypes.string,

  /** Additional Classes */
  className: PropTypes.string,

  /** The Markdown parsed html content */
  children: PropTypes.node,

  /** Custom parseMarkdown function */
  parseMarkdown: PropTypes.func
};

export default MarkdownPreviewer;
