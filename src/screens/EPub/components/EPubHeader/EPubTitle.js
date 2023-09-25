import React, { useState } from 'react';
import { CTHeading, CTFragment,useCTConfirmation } from 'layout';
import { connectWithRedux } from '../../controllers';
import EPubCopyModal from '../EPubCopyModal';
import SaveStatusLabel from './SaveStatusLabel';
import { ToolButtonDivider, _makeTBtn } from './ToolButton';

function EPubTitle({ epub, dispatch }) {
  const { title } = epub;
  const [showCpyMdl, setShowCpyMdl] = useState(false);
  const onOpenCpyMdl = () => setShowCpyMdl(true);
  const onCloseCpyMdl = () => setShowCpyMdl(false);
  
  const copyBtn = _makeTBtn(
    'file_copy', 'Make a copy', null, onOpenCpyMdl, false, true
  );

  const handleDelete = () => {
    dispatch({ type: 'epub/deleteEPub', payload: epub.id });
  };

  const delConfirmation = useCTConfirmation('Are you sure to delete this I-Note?', handleDelete);

  const deleteBtn = _makeTBtn(
    'delete', 'Delete', null, delConfirmation.onOpen, false, true
  );

  const saveEPub = () => dispatch({ type: 'epub/updateEPub_Internal' })
  const saveBtnEl = _makeTBtn('cloud_upload', 'Save', '⌘S', saveEPub, false, true);

  return (
    <CTFragment dFlex alignItCenter className="ct-epb header-title con">
      <CTHeading as="h1" id="ct-epb-header-title" title={title} fadeIn={false}>
        {title}
      </CTHeading>
      <CTFragment dFlex alignItCenter width="max-content">
        <ToolButtonDivider />
        {copyBtn}
        {deleteBtn}
        {saveBtnEl}
        <SaveStatusLabel />
      </CTFragment>

      <EPubCopyModal open={showCpyMdl} onClose={onCloseCpyMdl} />
      {delConfirmation.element}
    </CTFragment>
  );
}

export default connectWithRedux(
  EPubTitle,
  ['epub']
);
