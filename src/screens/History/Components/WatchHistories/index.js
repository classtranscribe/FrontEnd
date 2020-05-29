import React from 'react';
import { PlaceHolder, CTFragment } from 'components';
import { ARRAY_INIT } from 'utils/constants';
import { connectWithRedux } from '../../controllers';

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
    <CTFragment fade padding={[0, 35, 50, 35]}>
      <CTFragment list role="list">
        {whElement}
      </CTFragment>
    </CTFragment>
  );
}

export const WatchHistories = connectWithRedux(
  WatchHistoriesWithRedux,
  ['watchHistories']
);

