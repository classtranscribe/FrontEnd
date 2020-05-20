import React, { useEffect } from 'react';
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
    <div className="history-bg ct-a-fade-in">
      <WatchHistory {...state} removeWatchHistory={removeWatchHistory} />
      <ClassTranscribeFooter />
    </div>
  );
}
