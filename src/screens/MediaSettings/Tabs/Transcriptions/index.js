import React from 'react';
import { CTPlayer } from 'components/CTPlayer';
import { CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers/trans';

export function TranscriptionsWithRedux({
  media,
}) {
  return (
    <div className="msp-ee-con ct-a-fade-in">
      <div className="msp-ee">
        <CTFragment list>
          <CTFragment padding={30}>
            <CTPlayer
              // mediaId="c9a54a76-9cf0-4ec2-ab2f-89d496326562"
              media={media}
              width={900}
              hideWrapperOnMouseLeave
              defaultOpenCC
              allowRangePicker
              defaultOpenRangePicker
              beginAt={100}
              // defaultRange={[0,20]}
            />
          </CTFragment>
        </CTFragment>
      </div>
    </div>
  );
}

export const Transcriptions = connectWithRedux(
  TranscriptionsWithRedux,
  [],
  [],
  ['media']
);
