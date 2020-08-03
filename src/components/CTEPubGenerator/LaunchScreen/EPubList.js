import React from 'react';
import List from '@material-ui/core/List';
import { CTFragment, CTHeading, CTText } from 'layout';
import { connectWithRedux } from '../redux';
import EPubListItem from './EPubListItem';
import NewEPubButton from './NewEPubButton';

function EPubList({
  epubs,
  media
}) {
  return (
    <div className="ct-epb epub-list-con" data-scroll>
      {
        epubs.length > 0 
        && 
        <CTFragment hBetween padding={[0, 20, 0, 40]}>
          <CTHeading as="h3" vCenter padding="0" margin="0">
            Your ePub Books
          </CTHeading>

          <NewEPubButton media={media} />
        </CTFragment>
      }

      <List>
        {epubs.length === 0 ? (
          <CTFragment margin={[50, 0, 0, 0]} list center>
            <CTText center muted padding="20">No ePub books</CTText>
            <NewEPubButton media={media} />
          </CTFragment>
        ) : (
          epubs.map((epubItem, index) => (
            <EPubListItem
              key={epubItem.id} 
              epubItem={epubItem} 
              divider={index !== epubs.length - 1}
            />
          ))
        )}
      </List>
    </div>
  );
}

export default connectWithRedux(
  EPubList,
  ['epubs']
);
