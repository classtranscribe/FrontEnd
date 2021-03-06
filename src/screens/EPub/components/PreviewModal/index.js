import React, { useState, useEffect } from 'react';
import { CTModal, CTFragment, CTSelect } from 'layout';
import { connect } from 'dva'
import { buildHTMLFromChapter } from 'entities/EPubs/html-converters'
import { MDPreviewer } from '../Markdown';
import './index.scss'

function PreviewModal({
  showPreview,
  currChIndex,
  chapters = [],
  dispatch
}) {
  const onClose = () => dispatch({ type: 'epub/setShowPreview', payload: false });

  const [previewChIdx, setPreviewChIdx] = useState(currChIndex);
  const chapter = chapters[previewChIdx] || {};

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
        <MDPreviewer value={buildHTMLFromChapter(chapter)} />
      </CTFragment>
    </CTModal>
  )
}

export default connect(({ epub: { showPreview, currChIndex, epub: { chapters } }, loading }) => ({
  showPreview, currChIndex, chapters
}))(PreviewModal);
