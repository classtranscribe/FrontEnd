import React, { useState, useEffect } from 'react';
import { CTModal, CTFragment, CTSelect } from 'layout';
import { connect } from 'dva'
import { epub as epubController } from '../../controllers';
import { MDPreviewer } from '../Markdown';
import './index.scss'

function PreviewModal({
  showPreview,
  currChIndex,
}) {
  const onClose = () => epubController.state.setShowPreview(false);

  const [previewChIdx, setPreviewChIdx] = useState(currChIndex);
  const chapters = epubController.data.data.chapters;
  const chapter = chapters[previewChIdx];

  useEffect(() => {
    if (showPreview) {
      setPreviewChIdx(currChIndex);
    }
  }, [showPreview]);

  const handleSelect = ({ target: { value } }) => setPreviewChIdx(value);
  const chapterOptions = chapters.map(
    (ch, idx) => ({ value: idx, text: `Chapter ${idx + 1}: ${ch.title}` })
  );
  const chapterSelector = (
    <CTFragment dFlex padding={[0, 10, 0, 25]} maxWidth="500px">
      <CTSelect
        id="epb-preview-ch-sel"
        aria-label="Select a chapter"
        value={previewChIdx}
        options={chapterOptions}
        onChange={handleSelect}
        underlined
      />
    </CTFragment>
  )

  return (
    <CTModal
      open={showPreview}
      onClose={onClose}
      heading={chapterSelector}
      transition
      withCloseButton
      autoFocusOnCloseButton
    >
      <CTFragment padding={[10, 0, 50, 0]}>
        <MDPreviewer value={chapter.toHTML()} />
      </CTFragment>
    </CTModal>
  )
}

export default connect(({ epub, loading }) => ({
  epub
}))(PreviewModal);
