import React from 'react';
import { useParams } from 'react-router-dom';
import { CTFragment, CTText } from 'layout';
import { links } from 'utils';

function ErrorWrapper({ error }) {
  const { id } = useParams();
  return (
    <CTFragment center>
      <CTText white size="medium">Media Unavailable: {error} Error</CTText>
    </CTFragment>
  );
}

export default ErrorWrapper;
