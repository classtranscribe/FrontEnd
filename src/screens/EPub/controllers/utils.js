import _ from 'lodash';
import { getAllItemsInChapter } from 'entities/EPubs/utils';

export function getCompactText(chapter) {
  return _.map(getAllItemsInChapter(chapter), (item) => item.text)
        .slice(0, 500);
}