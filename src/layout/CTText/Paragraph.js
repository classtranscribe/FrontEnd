import React from 'react';
import Text from './Text';

function Paragraph(props) {
  return (
    <Text {...props} as="p" />
  );
}

Paragraph.propTypes = Text.propTypes;

export default Paragraph;

