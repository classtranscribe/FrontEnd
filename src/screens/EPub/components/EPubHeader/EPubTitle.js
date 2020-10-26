import React from 'react';
import { CTHeading, CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';
import SaveStatusLabel from './SaveStatusLabel'

function EPubTitle({
  epub
}) {
  const { title } = epub;

  return (
    <CTFragment role="header" dFlex alignItCenter className="ct-epb header-title con">
      <CTHeading as="h1" id="ct-epb-header-title" fadeIn={false}>
        {title}
      </CTHeading>

      <SaveStatusLabel />
    </CTFragment>
  );
}

export default connectWithRedux(
  EPubTitle,
  ['epub']
);
