import showdown from 'showdown';
import showdownKatex from 'showdown-katex';

function getMDConverter() {
  return new showdown.Converter({
    tables: true,
    simpleLineBreaks: true,
    strikethrough: true,
    parseImgDimensions: true,
    simplifiedAutoLink: true,
    excludeTrailingPunctuationFromURLs: true,
    tasklists: true,
    underline: true,
    extensions: [showdownKatex({})],
  });
}

/**
 * Parse markdown input to html
 * @param {String} markdownData raw markdown text
 * @returns {String} parsed raw html
 */
export function markdown2Html(markdownData) {
  const md = getMDConverter();
  return md.makeHtml(markdownData);
}
