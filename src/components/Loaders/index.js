import React from 'react';
import { Dimmer, Loader } from 'semantic-ui-react';
import './index.css';

export function GeneralLoader({ loading, inverted, height }) {
  return (
    <Dimmer active={loading} inverted={inverted} style={{ height, background: 'transparent' }}>
      <Loader inverted={inverted}>Loading</Loader>
    </Dimmer>
  );
}
