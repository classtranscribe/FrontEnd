import React from 'react';
import { PlaceHolder } from 'components';
import { ARRAY_INIT } from 'utils/constants';
import { connectWithRedux } from '../../controllers';
import './index.scss';

import MediaItem from './MediaItem';

function WatchHistoriesWithRedux(props) {
  let { watchHistories = ARRAY_INIT } = props;

  let whElement = null;
  if (watchHistories === ARRAY_INIT) {
    whElement = <PlaceHolder />
  } else if (!watchHistories || watchHistories.length === 0) {
    whElement = <div className="no-results left"><span>You have not watched any videos yet.</span></div>;
  } else {
    whElement = watchHistories.map(media => <MediaItem media={media} />);
  }

  return (
    <div className="hp-wh-ul-con ct-a-fade-in">
      <div role="list" className="hp-wh-ul">
        {whElement}
      </div>
    </div>
  );
}

export const WatchHistories = connectWithRedux(
  WatchHistoriesWithRedux,
  ['watchHistories']
);

