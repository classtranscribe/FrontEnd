import React from 'react';
import { CTFragment, CTText } from 'layout';
import { epub } from '../../../controllers';
import { ChapterTitle } from '../../../components';
import ChapterContent from './ChapterContent';
import ChapterNewContent from './ChapterNewContent';

function SubChapterItem({
  subChapter,
  subChapterIndex,
  currChIndex,
  dispatch
}) {
  const { title, id, contents : _contents } = subChapter;
  const contents = typeof subChapter === 'string' ? [subChapter] : _contents;
  const onSaveTitle = (newTitle) =>
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'saveSubChapterTitle', payload: { chapterIdx: currChIndex, subChapterIdx: subChapterIndex, value: newTitle }
      }
    })

  const onRemove = (index) => () => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'removeChapterContent', payload: { contentIdx: index, subChapterIdx: subChapterIndex, }
      }
    })
  };

  const onTextChange = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: val ? 'setChapterContent' : 'removeChapterContent', payload: { contentIdx: index, subChapterIdx: subChapterIndex, value: val }
      }
    })
  };

  const onImageChange = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContent', payload: { contentIdx: index, subChapterIdx: subChapterIndex, value: val, type: 'image' }
      }
    })
  };

  const onInsert = (index) => (val) => {
    dispatch({
      type: 'epub/updateEpubData', payload: {
        action: 'insertChapterContent', payload: { contentIdx: index, subChapterIdx: subChapterIndex, value: val }
      }
    })
  };

  return (
    <CTFragment id={epub.id.schID(id)} className="mt-5">
      <CTText muted className="pl-1">Sub-Chapter {subChapterIndex + 1}: {title}</CTText>
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
      
      <ChapterNewContent index={subChapter.contents.length} onInsert={onInsert(contents.length)} />
    </CTFragment>
  );
}

export default SubChapterItem;