import React from 'react';
import { CTModal } from 'layout';
import { MDPreviewer } from '../components';
import { buildMDFromChapter } from '../controllers';

function PreviewChapterModal({
  show,
  chapter,
  onClose
}) {
  return (
    <CTModal
      open={show}
      onClose={onClose}
      title={chapter ? chapter.title : ''}
      withCloseButton
    >
      <MDPreviewer value={buildMDFromChapter(chapter)} />
    </CTModal>
  )
}

export default PreviewChapterModal
