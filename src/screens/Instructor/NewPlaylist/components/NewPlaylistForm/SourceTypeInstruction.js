import React from 'react';
import { CTFormHelp, CTFragment, CTHeading, CTText } from 'layout';
import { CTPlaylistIcon } from 'components';

function SourceTypeInstruction() {
  const getHeadingProps = (type) => ({
    as: 'h5',
    margin: [10, 0, 5, 0],
    icon: <CTPlaylistIcon type={type} size="small" />,
  });

  const textPadding = [0, 0, 0, 25];

  return (
    <CTFormHelp title="create your playlist from ...">
      <CTFragment dFlexCol role="list">
        <CTFragment role="listitem">
          <CTHeading {...getHeadingProps(2)}>Upload</CTHeading>
          <CTText padding={textPadding}>
            Manually upload video files (MP4 file).
          </CTText>
        </CTFragment>
        <CTFragment role="listitem">
          <CTHeading {...getHeadingProps(0)}>Echo360</CTHeading>
          <CTText padding={textPadding}>
            Host videos from Echo360 using <strong>Access Link</strong> of your Echo360 course.
          </CTText>
        </CTFragment>
        <CTFragment role="listitem">
          <CTHeading {...getHeadingProps(1)}>YouTube</CTHeading>
          <CTText padding={textPadding}>
            Host videos from YouTube using <strong>Playlist ID</strong> of your YouTube playlist
            or <strong>Channel ID</strong> of your YouTube channel.
          </CTText>
        </CTFragment>
        <CTFragment role="listitem">
          <CTHeading {...getHeadingProps(3)}>Kaltura/MediaSpace</CTHeading>
          <CTText padding={textPadding}>
            Host videos from your <strong>Kaltura Channel</strong>.
          </CTText>
        </CTFragment>
        <CTFragment role="listitem">
          <CTHeading {...getHeadingProps(4)}>Box</CTHeading>
          <CTText padding={textPadding}>
            Host videos from your <strong>Box Folder</strong>.
          </CTText>
        </CTFragment>
      </CTFragment>


      <CTFragment padding={[20, 0, 0, 0]}>
        Except for &quot;Upload&quot;, each playlist type requires some source identifier 
        to enable us to extract the videos.
      </CTFragment>
    </CTFormHelp>
  );
}

export default SourceTypeInstruction;
