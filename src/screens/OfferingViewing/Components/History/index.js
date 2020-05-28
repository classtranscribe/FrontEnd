import React, { useEffect, Fragment } from 'react';
import { util } from 'utils';
import { ClassTranscribeFooter } from 'components';
import WatchHistory from './WatchHistory';
import './index.css';

export function History({ state, removeWatchHistory }) {
  useEffect(() => {
    util.elem.scrollIntoView('sp-content');
    util.links.title('History');
  }, []);

  return (
    <>
      <WatchHistory {...state} removeWatchHistory={removeWatchHistory} />
      <ClassTranscribeFooter />
    </>
  );
}
