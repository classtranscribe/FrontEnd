import _ from 'lodash';
import { prompt, util, ARRAY_INIT } from 'utils';
import { epubState } from './epub.state';
import { epubHistory } from './epub.history';
import { EPUB_STEP_EDIT } from './constants';
import { 
  buildChapter, 
  buildSubChapter, 
  getAllItemsInChapter 
} from './util';

let { updateEpubChapters } = epubState;

// **********************************************************************
// Helpers
// **********************************************************************

let untitledNum = 0;
function genUntitledName() {
  let name = `Untitled Chapter${untitledNum === 0 ? '' : ` ${untitledNum}`}`;
  untitledNum += 1;
  return name;
}

function completeAction(
  actionName, 
  prevChapters, 
  nextChapters, 
  currChapter
) {
  epubHistory.pushData(
    actionName, 
    epubHistory.createData(prevChapters, nextChapters)
  );

  updateEpubChapters(nextChapters, currChapter);
}

class EpubChapterSplitterController {
  constructor() {
    this.proceedToStep2 = this.proceedToStep2.bind(this);
    this.resetToDefaultChapters = this.resetToDefaultChapters.bind(this);
    this.splitChaptersByScreenshots = this.splitChaptersByScreenshots.bind(this);
    this.subdivideChaptersByScreenshots = this.subdivideChaptersByScreenshots.bind(this);
  }

  proceedToStep2() {
    epubState.toStep(EPUB_STEP_EDIT);

    prompt.addOne(
      {
        text: "Start editing your chapters' contents.",
        status: 'success',
        position: 'left bottom',
        timeout: 3000,
      },
      true,
    );
  }

  handleMouseOverChapterList(chapter) {
    epubState.changeChapter(chapter);
  }

  // **********************************************************************
  // Setup
  // **********************************************************************

  setupChapters(epubData) {
    if (epubData === ARRAY_INIT) return;

    let chapters = [
      buildChapter({
        items: _.filter(epubData, (data) => _.trim(data.text)),
        title: 'Default Chapter',
      }),
    ];

    epubState.setChapters(chapters);

    if (chapters[0]) {
      epubState.changeChapter(chapters[0]);
    }

    // this.subdivideChaptersByScreenshots();
  }

  cancelEditChapters() {
    this.setupChapters(epubState.epubData);
    epubState.setIsManagingChapters(false);
  }

  // **********************************************************************
  // Handle split chapters
  // **********************************************************************

  splitChapterFromChaptersItems(chapterIndex, itemIndex, pushHistory=true) {
    let chapters = epubState.chapters;
    let items = chapters[chapterIndex].items;
    chapters[chapterIndex].items = _.slice(items, 0, itemIndex);

    let newChapter = {};

    // add the sub chapters to the new chapter
    newChapter.subChapters = chapters[chapterIndex].subChapters;
    chapters[chapterIndex].subChapters = [];

    // setup new chapter
    newChapter.items = _.slice(items, itemIndex, items.length);
    newChapter.title = genUntitledName();
    newChapter = buildChapter(newChapter);
    chapters[chapterIndex] = buildChapter(chapters[chapterIndex]);

    updateEpubChapters(
      [
        ..._.slice(chapters, 0, chapterIndex + 1),
        newChapter,
        ..._.slice(chapters, chapterIndex + 1, chapters.length),
      ],
      newChapter,
    );

    if (pushHistory) {
      epubHistory.pushAction(
        'Split chapters',
        {
          undo: () => this.undoSplitChapter(chapterIndex + 1, false),
          redo: () => this.splitChapterFromChaptersItems(chapterIndex, itemIndex, false)
        }
      );
    }
  }

  undoSplitChapter(chapterIndex, pushHistory=true) {
    let chapters = epubState.chapters;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let prevChapter = chapters[chapterIndex - 1];

    // if the prev chapter has sub-chapters
    // append curr chapter and its sub-chapters to prev's sub-chapters
    if (prevChapter.subChapters.length > 0) {
      if (currChapter.items.length === 0) {
        prevChapter.subChapters = [...prevChapter.subChapters, ...currChapter.subChapters];
      } else {
        prevChapter.subChapters = [
          ...prevChapter.subChapters,
          buildSubChapter(currChapter),
          ...currChapter.subChapters,
        ];
      }
      // otherwise, append items & sub-chapters of this chapter to the prev
    } else {
      prevChapter.items = [...prevChapter.items, ...currChapter.items];

      prevChapter.subChapters = currChapter.subChapters;
    }

    chapters[chapterIndex - 1] = buildChapter(prevChapter);

    

    if (pushHistory) {
      completeAction(
        'Undo split chapters',
        prevChapters,
        [
          ..._.slice(chapters, 0, chapterIndex),
          ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ],
        chapters[chapterIndex - 1]
      )
    } else {
      updateEpubChapters(
        [
          ..._.slice(chapters, 0, chapterIndex),
          ..._.slice(chapters, chapterIndex + 1, chapters.length),
        ],
        chapters[chapterIndex - 1]
      );
    }
  }


  /** @TODO Add history actions ------------------- */

  appendChapterAsSubChapter(chapterIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let prevChapter = chapters[chapterIndex - 1];

    if (currChapter.items.length === 0) {
      prevChapter.subChapters = [...prevChapter.subChapters, ...currChapter.subChapters];
    } else {
      prevChapter.subChapters = [
        ...prevChapter.subChapters,
        buildSubChapter(currChapter),
        ...currChapter.subChapters,
      ];
    }

    chapters[chapterIndex - 1] = buildChapter(prevChapter);

    completeAction(
      'Append to above sub-chapter',
      prevChapters,
      [
        ..._.slice(chapters, 0, chapterIndex),
        ..._.slice(chapters, chapterIndex + 1, chapters.length),
      ],
      chapters[chapterIndex - 1]
    );
  }

  // **********************************************************************
  // Handle split sub-chapters
  // **********************************************************************

  subdivideChapter(chapterIndex, itemIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);

    let currChapter = chapters[chapterIndex];
    let items = currChapter.items;
    currChapter.items = _.slice(items, 0, itemIndex);

    let subChapter = buildSubChapter({
      items: _.slice(items, itemIndex, items.length),
    });

    currChapter.subChapters = [subChapter, ...currChapter.subChapters];
    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Subdivide the chapter',
      prevChapters,
      [
        ..._.slice(chapters, 0, chapterIndex + 1),
        ..._.slice(chapters, chapterIndex + 1, chapters.length),
      ],
      chapters[chapterIndex]
    );
  }

  undoSubdivideChapter(chapterIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let subChapters = currChapter.subChapters;

    let subChapterItems = subChapters[0].items;
    currChapter.items = [...currChapter.items, ...subChapterItems];

    currChapter.subChapters = subChapters.slice(1, subChapters.length);
    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Undo subdivide the chapter',
      prevChapters,
      chapters,
      chapters[chapterIndex]
    );
  }

  splitSubChapter(chapterIndex, subChapterIndex, itemIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    let items = currSubChapter.items;

    currSubChapter.items = _.slice(items, 0, itemIndex);
    currChapter.subChapters[subChapterIndex] = buildSubChapter(currSubChapter);

    let newSubChapter = {};
    newSubChapter.items = _.slice(items, itemIndex, items.length);
    newSubChapter = buildSubChapter(newSubChapter);

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = [
      ..._.slice(subChapters, 0, subChapterIndex + 1),
      newSubChapter,
      ..._.slice(subChapters, subChapterIndex + 1, subChapters.length),
    ];

    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Split the sub-chapter',
      prevChapters,
      chapters,
      chapters[chapterIndex]
    );
  }

  undoSplitSubChapter(chapterIndex, subChapterIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    let prevSubChapter = currChapter.subChapters[subChapterIndex - 1];

    prevSubChapter.items = [...prevSubChapter.items, ...currSubChapter.items];

    currChapter.subChapters[subChapterIndex - 1] = buildSubChapter(prevSubChapter);

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = [
      ..._.slice(subChapters, 0, subChapterIndex),
      ..._.slice(subChapters, subChapterIndex + 1, subChapters.length),
    ];

    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Subdivide the chapter',
      prevChapters,
      chapters,
      chapters[chapterIndex]
    );
  }

  splitChapterFromSubChaptersItems(chapterIndex, subChapterIndex, itemIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    let items = currSubChapter.items;
    let subChapters = currChapter.subChapters;

    let newChapter = buildChapter({
      items: _.slice(items, itemIndex, items.length),
      title: genUntitledName(),
      subChapters: _.slice(subChapters, subChapterIndex + 1, subChapters.length),
    });

    currSubChapter.items = _.slice(items, 0, itemIndex);
    currChapter.subChapters[subChapterIndex] = buildSubChapter(currSubChapter);

    currChapter.subChapters = _.slice(subChapters, 0, subChapterIndex + 1);
    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Split chapters',
      prevChapters,
      [
        ..._.slice(chapters, 0, chapterIndex + 1),
        newChapter,
        ..._.slice(chapters, chapterIndex + 1, chapters.length),
      ],
      newChapter
    );
  }

  splitChapterFromSubChapter(chapterIndex, subChapterIndex) {
    let { chapters } = epubState;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];

    let subChapters = currChapter.subChapters;
    currChapter.subChapters = _.slice(subChapters, 0, subChapterIndex);

    let newChapter = buildChapter({
      ...currSubChapter,
      image: undefined,
      subChapters: _.slice(subChapters, subChapterIndex + 1, subChapters.length),
    });
    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Split Chapters',
      prevChapters, 
      [
        ..._.slice(chapters, 0, chapterIndex + 1),
        newChapter,
        ..._.slice(chapters, chapterIndex + 1, chapters.length),
      ],
      newChapter
    );
  }


  // **********************************************************************
  // Quick Actions
  // **********************************************************************

  resetToDefaultChapters() {
    let defaultChapter = buildChapter({
      items: _.filter(epubState.epubData, (data) => _.trim(data.text)),
      title: 'Default Chapter',
      id: util.genId(),
    });

    let nextChapters = [defaultChapter];

    completeAction(
      'Split Chapters by Screenshots',
      epubState.chapters, 
      nextChapters, 
      defaultChapter
    );

    prompt.addOne({
      text: 'Reset to the default chapters.',
      position: 'left bottom',
      timeout: 2000,
    });
  }

  splitChaptersByScreenshots() {
    let splitChapters = _.map(
      _.filter(epubState.epubData, (data) => _.trim(data.text)),
      (data, idx) =>
        buildChapter({
          items: [data],
          title: `Untitled Chapter ${idx + 1}`,
          id: util.genId(),
        }),
    );

    completeAction(
      'Split Chapters by Screenshots',
      epubState.chapters, 
      splitChapters, 
      splitChapters[0]
    );

    prompt.addOne({
      text: 'Split the chapters by screenshots.',
      position: 'left bottom',
      timeout: 2000,
    });
  }

  subdivideChaptersByScreenshots() {
    let { chapters } = epubState;
    if (chapters === ARRAY_INIT) return;

    let prevChapters = _.cloneDeep(chapters);

    _.forEach(chapters, (chapter, chapterIndex) => {
      let items = getAllItemsInChapter(chapter);

      chapter.subChapters = _.map(items, (item, subChapterIndex) =>
        buildSubChapter({
          items: [item],
          title: `Untitled Sub-Chapter ${subChapterIndex + 1}`,
        }),
      );

      chapter.items = [];
      chapters[chapterIndex] = buildChapter(chapter);
    });

    completeAction(
      'Subdivide Chapters by Screenshots',
      prevChapters, 
      chapters, 
      chapters[0]
    );

    prompt.addOne({
      text: 'Subdivided all the chapters by screenshots.',
      position: 'left bottom',
      timeout: 2000,
    });
  }


  // **********************************************************************
  // handle edit title
  // **********************************************************************

  handleChapterTitleChange(chapterIndex, value) {
    let chapters = epubState.chapters;
    let prevChapters = _.cloneDeep(chapters);
    chapters[chapterIndex].title = value;
    chapters[chapterIndex] = buildChapter(chapters[chapterIndex]);

    completeAction(
      'Edit chapter title',
      prevChapters, 
      chapters, 
      chapters[chapterIndex]
    );
  }

  handleSubChapterTitleChange(chapterIndex, subChapterIndex, value) {
    let chapters = epubState.chapters;
    let prevChapters = _.cloneDeep(chapters);
    let currChapter = chapters[chapterIndex];
    let currSubChapter = currChapter.subChapters[subChapterIndex];
    currSubChapter.title = value;

    currChapter.subChapters[subChapterIndex] = buildSubChapter(currSubChapter);
    chapters[chapterIndex] = buildChapter(currChapter);

    completeAction(
      'Edit sub-chapter title',
      prevChapters, 
      chapters, 
      chapters[chapterIndex]
    );
  }


  // **********************************************************************
  // handle fold/unfold chapters
  // **********************************************************************

  foldChapter(id) {
    epubState.setFoldedIds([...epubState.foldedIds, id]);
  }

  unfoldChapter(id) {
    let foldedIds = epubState.foldedIds;
    _.remove(foldedIds, (fid) => fid === id);

    epubState.setFoldedIds([...foldedIds]);
  }

  // **********************************************************************
  // handle language change
  // **********************************************************************

  changeLanguage(lang) {
    epubState.setLanguage(lang);
    epubState.setChapters(ARRAY_INIT);
    epubState.changeEpubLanguage(lang);
  }

  // **********************************************************************
  // handle magnify images
  // **********************************************************************

  magnifyImage(image) {
    epubState.setMagnifiedImg(image);
  }

  endMagnifyImage() {
    epubState.setMagnifiedImg(null);
  }
}

export const chapterSplitter = new EpubChapterSplitterController();
