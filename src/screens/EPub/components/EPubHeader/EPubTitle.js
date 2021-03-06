import React, { useState } from 'react';
import { CTHeading, CTFragment } from 'layout';
import { connectWithRedux } from '../../controllers';
import EPubCopyModal from '../EPubCopyModal';
import SaveStatusLabel from './SaveStatusLabel';
import { _makeTBtn } from './ToolButton';

function EPubTitle({ epub, dispatch }) {
  const { title } = epub;
  const [showCpyMdl, setShowCpyMdl] = useState(false);
  const onOpenCpyMdl = () => setShowCpyMdl(true);
  const onCloseCpyMdl = () => setShowCpyMdl(false);

  const onOpenSettings = () => dispatch({ type: 'epub/setShowFileSettings', payload: true });

  const settingsBtn = _makeTBtn(
    'edit', 'Edit file', null, onOpenSettings, false, true
  );
  const copyBtn = _makeTBtn(
    'file_copy', 'Make a copy', null, onOpenCpyMdl, false, true
  );

  return (
    <CTFragment dFlex alignItCenter className="ct-epb header-title con">
      <CTHeading as="h1" id="ct-epb-header-title" title={title} fadeIn={false}>
        {title}
      </CTHeading>
      <CTFragment dFlex alignItCenter width="max-content" margin={[0, 0, 0, 5]}>
        {settingsBtn}
        {copyBtn}
        <SaveStatusLabel />
      </CTFragment>

      <EPubCopyModal open={showCpyMdl} onClose={onCloseCpyMdl} />
    </CTFragment>
  );
}

export default connectWithRedux(
  EPubTitle,
  ['epub']
);
