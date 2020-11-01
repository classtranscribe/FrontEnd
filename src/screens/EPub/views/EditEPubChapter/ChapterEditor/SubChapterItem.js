import React from 'react';
import { CTFragment, CTText } from 'layout';
import { epub } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterContent from './ChapterContent';
import ChapterNewContent from './ChapterNewContent';

function SubChapterItem({
  subChapter,
  subChapterIndex,
}) {
  const { title, id, contents } = subChapter;

  const onSaveTitle = (newTitle) =>
    epub.data.saveSubChapterTitle(epub.state.currChIndex, subChapterIndex, newTitle);

  const onRemove = (index) => () => {
    epub.data.removeSubChapterContent(subChapterIndex, index);
  };

  const onTextChange = (index) => (val) => {
    if (!val) {
      epub.data.removeSubChapterContent(subChapterIndex, index);
    } else {
      epub.data.setSubChapterContent(subChapterIndex, index, val);
    }
  };

  const onImageChange = (index) => (val) => {
    epub.data.setSubChapterImageContent(subChapterIndex, index, val);
  };

  const onInsert = (index) => (val) => {
    epub.data.insertSubChapterContent(subChapterIndex, index, val);
  };
  
  return (
    <CTFragment id={epub.id.schID(id)} className="mt-5">
      <CTText muted className="pl-1">Sub-Chapter {subChapterIndex + 1}</CTText>
      <ChapterTitle
        id={epub.id.schTitleID(id)}
        value={title}
        headingType="h3"
        label="Sub-Chapter Title"
        placeholder="Sub-Chapter Title"
        bordered
        onSave={onSaveTitle}
      />

      {contents.map((content, index) => (
        <ChapterContent
          id={`sch-content-${id}-${index}`}
          key={`sch-content-${id}-${index}`}
          index={index}
          content={content}
          onInsert={onInsert(index)}
          onRemove={onRemove(index)}
          onTextChange={onTextChange(index)}
          onImageChange={onImageChange(index)}
        />
      ))}

      <ChapterNewContent index={subChapter.contents.length} />
    </CTFragment>
  );
}

export default SubChapterItem;