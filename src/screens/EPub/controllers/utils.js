import _ from 'lodash';
import { EPubChapterData, EPubImageData, EPubSubChapterData } from 'entities/EPubs';

/**
 * Get a compact text from first several items in the chapter
 */
export function getCompactText(chapter) {
  return EPubChapterData.__getAllItemsInChapter(chapter)
          .map((item) => item.text)
          .slice(0, 500);
}

function isValidADImage(content, useFirstImage) {
  if (!(content instanceof EPubImageData)) return false;
  return useFirstImage || Boolean(content.description);
}

/**
 * Extract audio description from ePub chapters
 * @param {EPubChapterData[]|EPubSubChapterData[]} chapters 
 * @param {Boolean} useFirstImage
 */
export function extractAudioDescription(chapters, useFirstImage = true) {
  return chapters.reduce((audioDescriptions, chapter) => {
    const contents = _.flatten([
      [chapter.contents],
      ...chapter.subChapters.map((sch) => sch.contents)
    ]);

    const index = contents.findIndex((content) => isValidADImage(content, useFirstImage));

    if (index >= 0) {
      audioDescriptions.push({
        image: contents[index].src,
        description: contents[index].description,
        title: chapter.title,
        start: chapter.start,
        end: chapter.end
      });
    }

    return audioDescriptions;
  }, []);
}