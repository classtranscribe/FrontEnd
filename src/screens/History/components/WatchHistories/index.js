import React from 'react';
import { CTFragment, CTFilter } from 'layout';
import { MediaCard } from 'components';
import { connect } from 'dva';
import { ARRAY_INIT } from 'utils/constants';

function WatchHistoriesWithRedux(props) {
  const { historypage } = props;
  const { watchHistories = ARRAY_INIT } = historypage;

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
        result.map((media, index) => (
          <MediaCard
            row
            nameSize="big"
            posterSize="medium"
            {...MediaCard.parse(media)}
            key={media.id + index}
          />
        ));
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

export default connect(({ historypage, loading }) => ({
  historypage
}))(WatchHistoriesWithRedux);

