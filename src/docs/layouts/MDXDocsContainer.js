import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment } from 'layout';
import { CTMarkdownPreviewer } from 'components';

function MDXDocsContainer(props) {
  const { children } = props;

  return (
    <CTFragment padding={[0, 30]}>
      <CTMarkdownPreviewer>
        {children}
      </CTMarkdownPreviewer>
    </CTFragment>
  );
}

MDXDocsContainer.propTypes = {
  /** The MDX content */
  children: PropTypes.node
};

export default MDXDocsContainer;

