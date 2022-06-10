import React from 'react';
import { CTFragment } from 'layout';
import { epub } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterContent from './ChapterContent';
import ChapterNewContent from './ChapterNewContent';

function ChapterInfo({ chapter, currChIndex, dispatch }) {
  const { id, title, contents, condition } = chapter;
  const onSaveTitle = newTitle => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveChapterTitle', payload: { chapterIdx: currChIndex, value: newTitle }
      }
    })
  };

  const onRemove = (index) => () => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'removeChapterContent', payload: { contentIdx: index, type: 'image' }
      }
    })
  };

  const onTextChange = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: val ? 'setChapterContent' : 'removeChapterContent', payload: { contentIdx: index, value: val }
      }
    })
  };

  const onImageChange = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'setChapterContent', payload: { contentIdx: index, value: val, type: 'image' }
      }
    })
  };

  const onInsert = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContent', payload: { contentIdx: index, value: val }
      }
    })
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
          condition={condition}
          dispatch={dispatch}
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
