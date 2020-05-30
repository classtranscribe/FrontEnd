import React from 'react';
import { CTFragment } from '../CTFragment';

export function CTFooter() {
  return (
    <CTFragment padding={[50, 20]} center as="footer" id="ct-footer">
      <span>&copy; 2016-2020 University of Illinois</span>
    </CTFragment>
  );
}

