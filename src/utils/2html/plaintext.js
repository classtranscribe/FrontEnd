import _ from 'lodash';

/**
 * Convert list of objects to html
 * @param {String[]|Object[]} textdata the plain text
 * @param {Object} options the options for html converter
 * @param {String} key the key to the text if textdata is an array of objects
 * @returns {String} the raw html data
 */
export function strList2Html(textdata, key) {
  let paragraphs = [];

  if (Array.isArray(textdata)) {
    if (key) {
      paragraphs = textdata.map((data) => _.get(data, key));
    }
  } else {
    return '';
  }

  paragraphs = _.map(
    paragraphs.filter((text) => Boolean(_.trim(text.toString()))),
    (text) => `<p>\n\t${text}\n</p>`,
  );

  return paragraphs.join('\n\n');
}

/**
 * Convert plain text to html
 * @param {String} textdata the plain text
 * @param {Object} options the options for html converter
 * @param {String} options.paragraphSeparator the paragraph separator in the plain text
 * @returns {String} the raw html data
 */
export function plaintext2Html(
  textdata,
  options = {
    paragraphSeparator: '\n',
  },
) {
  if (!textdata) return '';
  const { paragraphSeparator } = options;

  const paragraphs = _.split(textdata, paragraphSeparator);
  return strList2Html(paragraphs);
}
