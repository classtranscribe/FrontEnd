import React from 'react';
import Text from './Text';

function Paragraph(props) {
  return (
    <Text as="p" justified indent="20px" {...props} />
  );
}

Paragraph.propTypes = Text.propTypes;

export default Paragraph;

