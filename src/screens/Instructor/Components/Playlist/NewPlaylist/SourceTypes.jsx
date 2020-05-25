import React from 'react';
import { PlaylistIcon } from '../../PlaylistIcon';

function SourceTypes() {
  return (
    <div className="w-100">
      <div className="ip-f-title">
        <h3>playlist type</h3>
      </div>

      <div className="ip-f-p-types-con">
        <h4>Create Your Playlist From</h4>
        <div className="ip-f-p-types-list">
          <div className="ip-f-p-types-item">
            <div className="ip-f-p-types-t">
              <PlaylistIcon type={2} /> Upload
            </div>
            <div className="ip-f-p-types-d">Manually upload video files (MP4 file).</div>
          </div>

          <div className="ip-f-p-types-item">
            <div className="ip-f-p-types-t">
              <PlaylistIcon type={0} /> Echo360
            </div>
            <div className="ip-f-p-types-d">
              Host videos from Echo360 using <strong>Access Link</strong> of your Echo360 course.
            </div>
          </div>

          <div className="ip-f-p-types-item">
            <div className="ip-f-p-types-t">
              <PlaylistIcon type={1} /> YouTube
            </div>
            <div className="ip-f-p-types-d">
              Host videos from YouTube using <strong>Playlist ID</strong> of your YouTube playlist.
            </div>
          </div>

          <div className="ip-f-p-types-item">
            <div className="ip-f-p-types-t">
              <PlaylistIcon type={3} /> Kaltura/MediaSpace
            </div>
            <div className="ip-f-p-types-d">
              Host videos from your <strong>Kaltura Channel</strong>.
            </div>
          </div>

          <div className="ip-f-p-types-item">
            <div className="ip-f-p-types-t">
              <PlaylistIcon type={4} /> Box
            </div>
            <div className="ip-f-p-types-d">
              Host videos from your <strong>Box Folder</strong>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SourceTypes;
