import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { links } from 'utils/links';
import ActionButton from '../../ActionButton';
import SharePopup from './SharePopup';
import './index.scss';

function Share(props) {
  let { media, time } = props;

  const [openShare, setOpenShare] = useState(false);

  const onOpenShare = () => setOpenShare(true);
  const onCloseShare = () => setOpenShare(false);

  const { isLive, id } = media || {};
  let shareLink;
  if (isLive) {
    shareLink = links.currentUrl();
  } else {
    shareLink = window.location.origin + links.watch(id, { begin: time });
  }

  return (
    <div className="ctp share-root">
      <ActionButton
        icon="share"
        label="Share"
        onClick={onOpenShare}
        labelPlacement="bottom"
      />

      <SharePopup
        open={openShare}
        shareLink={shareLink}
        onClose={onCloseShare}
      />
    </div>
  );
}

Share.propTypes = {
  media: PropTypes.object, 
  time: PropTypes.number
};

export default Share;

