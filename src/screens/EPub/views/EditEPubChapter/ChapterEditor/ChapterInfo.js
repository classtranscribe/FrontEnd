import React from 'react';
import { CTFragment } from 'layout';
import { epub } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterContent from './ChapterContent';
import ChapterNewContent from './ChapterNewContent';

function ChapterInfo({ chapter, currChIndex }) {
  const { id, title, contents } = chapter;

  const onSaveTitle = newTitle => {
    epub.data.saveChapterTitle(currChIndex, newTitle);
  };

  const onRemove = (index) => () => {
    epub.data.removeChapterContent(index);
  };

  const onTextChange = (index) => (val) => {
    if (!val) {
      epub.data.removeChapterContent(index);
    } else {
      epub.data.setChapterContent(index, val);
    }
  };

  const onImageChange = (index) => (val) => {
    epub.data.setChapterImageContent(index, val);
  };

  const onInsert = (index) => (val) => {
    epub.data.insertChapterContent(index, val);
  };

  return (
    <CTFragment dFlexCol>
      <ChapterTitle
        id={epub.id.chTitleID(id)}
        value={title}
        headingType="h2"
        label="Chapter Title"
        placeholder="Chapter Title"
        bordered
        onSave={onSaveTitle}
      />

      {contents.map((content, index) => (
        <ChapterContent
          id={`ch-content-${id}-${index}`}
          key={`ch-content-${id}-${index}`}
          index={index}
          content={content}
          onInsert={onInsert(index)}
          onRemove={onRemove(index)}
          onTextChange={onTextChange(index)}
          onImageChange={onImageChange(index)}
        />
      ))}

      <ChapterNewContent onInsert={onInsert(contents.length)} />
    </CTFragment>
  );
}

export default ChapterInfo;
