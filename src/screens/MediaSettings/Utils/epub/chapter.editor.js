import _ from 'lodash';
import { prompt } from 'utils';
import { epubState } from './epub.state';
import {
  EPUB_STEP_SPLIT,
  EPUB_STEP_DOWNLOAD,
  EDITOR_TYPE_SPLITTER,
  EDITOR_MARKDOWN,
} from './constants';

import { buildChapter, buildSubChapter } from './util';
import { epubHistory } from './epub.history';


class EpubChapterEditorController {
  constructor() {
    this.backToStep1 = this.backToStep1.bind(this);
    this.proceedToStep3 = this.proceedToStep3.bind(this);
  }

  backToStep1() {
    epubState.toStep(EPUB_STEP_SPLIT);
  
    prompt.addOne(
      {
        text: 'Splitting chapters might lost the changes you made.',
        position: 'left bottom',
        timeout: 4000,
      },
      true,
    );
  }
  
  proceedToStep3() {
    epubState.toStep(EPUB_STEP_DOWNLOAD);
  
    prompt.addOne(
      {
        text: 'Finish step! Download your ePub file.',
        status: 'success',
        position: 'left bottom',
        timeout: 4000,
      },
      true,
    );
  }

  // //////////////////////////////////////////////////////////////////
  // Helpers
  // //////////////////////////////////////////////////////////////////
  saveChapterAttr(chapterId, attr, value) {
    const chapters = epubState.chapters;
    const prevChapters = _.cloneDeep(chapters);
    const chapterIndex = _.findIndex(chapters, { id: chapterId });
    if (chapterIndex < 0) return;

    chapters[chapterIndex][attr] = value;
    chapters[chapterIndex] = buildChapter(chapters[chapterIndex], false);

    epubHistory.updateChaptersAndHistory(
      (
        value === undefined
        ? `Remove chapter ${ attr}`
        : `Update chapter ${ attr}`
      ),
      prevChapters,
      chapters,
      chapters[chapterIndex]
    );
  }

  saveSubChapterAttr(subChapterIndex, attr, value) {
    const chapters = epubState.chapters;
    const prevChapters = _.cloneDeep(chapters);
    const chapterId = epubState.currChapter.id;
    const chapterIndex = _.findIndex(chapters, { id: chapterId });
    if (chapterIndex < 0) return;

    const subChapters = chapters[chapterIndex].subChapters;

    subChapters[subChapterIndex][attr] = value;
    subChapters[subChapterIndex] = buildSubChapter(subChapters[subChapterIndex], false);
    chapters[chapterIndex] = buildChapter(chapters[chapterIndex], false);

    epubHistory.updateChaptersAndHistory(
      (
        value === undefined
        ? `Remove sub-chapter ${ attr}`
        : `Update sub-chapter ${ attr}`
      ),
      prevChapters,
      chapters,
      chapters[chapterIndex]
    );
  }

  
  // //////////////////////////////////////////////////////////////////
  // Title
  // //////////////////////////////////////////////////////////////////
  
  saveChapterTitle(chapterId, title) {
    this.saveChapterAttr(chapterId, 'title', title);
  }
  
  saveSubChapterTitle(subChapterIndex, title) {
    this.saveSubChapterAttr(subChapterIndex, 'title', title);
  }
  
  // //////////////////////////////////////////////////////////////////
  // Image
  // //////////////////////////////////////////////////////////////////
  
  saveChapterImage(chapterId, image) {
    this.saveChapterAttr(chapterId, 'image', image);
  }
  
  removeChapterImage(chapterId) {
    this.saveChapterImage(chapterId, undefined);
  }
  
  saveSubChapterImage(subChapterIndex, image) {
    this.saveSubChapterAttr(subChapterIndex, 'image', image);
  }
  
  removeSubChapterImage(subChapterIndex) {
    this.saveSubChapterImage(subChapterIndex, undefined);
  }
  
  // //////////////////////////////////////////////////////////////////
  // Text/Content
  // //////////////////////////////////////////////////////////////////
  
  saveChapterText(chapterId, content) {
    this.saveChapterAttr(
      chapterId, 
      'content', 
      content + EDITOR_TYPE_SPLITTER + EDITOR_MARKDOWN
    );
  }
  
  saveSubChapterText(subChapterIndex, text) {
    this.saveSubChapterAttr(
      subChapterIndex, 
      'text', 
      text + EDITOR_TYPE_SPLITTER + EDITOR_MARKDOWN
    );
  }
}

export const chapterEditor = new EpubChapterEditorController();