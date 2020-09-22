import React from 'react';
import { CTFragment, CTFilter } from 'layout';
import { MediaCard } from 'components';
import { ARRAY_INIT } from 'utils/constants';
import { connectWithRedux } from '../../controllers';

function WatchHistoriesWithRedux(props) {
  let { watchHistories = ARRAY_INIT } = props;

  const loading = watchHistories === ARRAY_INIT;
  const data = loading ? [] : watchHistories;
  const dWHisResult = (result) => {
    let whElement = null;
    if (result.length === 0) {
      whElement = (
        <div className="no-results">
          <span>You have not watched any videos yet.</span>
        </div>
      );
    } else {
      whElement = 
        result.map(media => <MediaCard nameSize="big" posterSize="medium" row {...MediaCard.parse(media)} />);
    }

    return (
      <CTFragment dFlexCol role="list">
        {whElement}
      </CTFragment>
    );
  }

  return (
    <CTFragment fadeIn loading={loading} padding={[0, 35, 50, 35]}>
      <CTFilter
        withDefaultFilter
        data={data}
        keys={['name']}
      >
        {dWHisResult}
      </CTFilter>
    </CTFragment>
  );
}

export const WatchHistories = connectWithRedux(
  WatchHistoriesWithRedux,
  ['watchHistories']
);

