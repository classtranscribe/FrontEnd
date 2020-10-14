import React from 'react';
import { CTHeading, CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';

function EPubTitle({
  epub
}) {
  const { title } = epub;

  return (
    <CTFragment role="header">
      <CTHeading as="h1" id="ct-epb-header-title">
        {title}
      </CTHeading>
    </CTFragment>
  );
}

export default connectWithRedux(
  EPubTitle,
  ['epub']
);
