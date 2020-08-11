import React from 'react';
import { EPubInfoForm } from '../components';
import { epub } from '../controllers';

function DownloadBar(props) {
  return (
    <div className="ct-epb dch-bar-con" data-scroll onClick={epub.nav.closeNavigator}>
      <EPubInfoForm {...props} withDownload withCover />
    </div>
  );
}

export default DownloadBar;
