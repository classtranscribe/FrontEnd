import React, { useState } from 'react';
import { CTHeading, CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';
import EPubFileInfoModal from '../EPubFileInfoModal';
import SaveStatusLabel from './SaveStatusLabel';
import { _makeTBtn } from './ToolButton';

function EPubTitle({
  epub
}) {
  const { title } = epub;
  const [openSettings, setOpenSettings] = useState(false);
  const onOpenSettings = () => setOpenSettings(true);
  const onCloseSettings = () => setOpenSettings(false);

  const settingsBtn = _makeTBtn(
    'edit', 'Edit file', null, onOpenSettings, false, true
  );
  const copyBtn = _makeTBtn(
    'file_copy', 'Make a copy', null, null, false, true
  );

  return (
    <CTFragment role="header" dFlex alignItCenter className="ct-epb header-title con">
      <CTHeading as="h1" id="ct-epb-header-title" fadeIn={false}>
        {title}
      </CTHeading>
      <CTFragment dFlex alignItCenter width="max-content" margin={[0,0,0,5]}>
        {settingsBtn}
        {copyBtn}
        <SaveStatusLabel />
      </CTFragment>

      <EPubFileInfoModal open={openSettings} onClose={onCloseSettings} />
    </CTFragment>
  );
}

export default connectWithRedux(
  EPubTitle,
  ['epub']
);
