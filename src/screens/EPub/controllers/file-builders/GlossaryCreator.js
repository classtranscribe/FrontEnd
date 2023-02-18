/**
 * This file contains functionality to add an HTML/Text based glossary to some given text.
 * The glossary data is received from the backend through a mediaId.
 *
 * The getChapterGlossaryAndTextHighlight uses the glossary data to search for matching words in the text.
 * We substitute the glossary word with a link that points to the glossary section
 * where they can read the definition of the word.
 *
 * The actually glossary can be obtained using glossaryTermsAsHTML for EPub format or glossaryTermsAsText for PDF.
 *
 * Todo: Glossary for PDF
 */

import { cthttp } from 'utils/cthttp/request';

// Backend API URL
const baseURL = 'https://ct-dev.ncsa.illinois.edu';

/**
 * To fetch glossary data from the backend API
 * and create object containing word, description and link for each term.
 *
 * The word is usually a keyword or definition from a chapter.
 * The description describes the meaning of the word.
 * The link contains a URL where one can learn more about the word.
 */
export async function getGlossaryData(mediaId) {
  try {
    // THIS DOES NOT WORK
    const response = await cthttp.get(`${baseURL}/api/EPubs/GetGlossaryData?mediaId=${mediaId}`);

    if (response.ok) {
      const glossaryData = {};
      const glossaryJson = await response.json();
      for (const term of glossaryJson.Glossary) {
        const word = term[0];
        const description = term[1];
        const link = term[5];
        glossaryData[word] = { description, link };
      }

      return glossaryData;
    }
  } catch (e) {
    console.error(e);
  }

  return {};
}

/**
 * Helper function to check if a character is alphanumeric.
 */
function is_alphanum(char) {
  return char.match(/[a-zA-Z0-9]/i);
}

/**
 * Return HTML id for this word in the glossary section
 */
function get_word_id(word) {
  return `glossary_${String(word).replace(/ /g, '-')}`;
}

/**
 * @param {String} text the valid html string for a chapter
 * @param {Array} glossary glossary object returned from getGlossaryData function
 * @param {Boolean} highlightFirstOnly specifies whether we should highlight the first occurrence or every occurrence of a keyword.
 * @returns Returns the following as Array
 * - Index 0: The new chapter text with text highlighting
 * - Index 1: A list of {word,link,description} of the found words
 */
export function getChapterGlossaryAndTextHighlight(text, glossary, highlightAll) {
  let new_text = '';
  let withinTag = false;
  let target_words = Object.keys(glossary);
  let found_words = new Set();

  for (let i = 0; i < text.length; ) {
    // First we check that we are not inside a TAG i.e. <>
    // Because we do not want to replace text within an attribute

    if (text[i] === '<') {
      withinTag = true;
    }

    if (text[i] === '>') {
      withinTag = false;
    }

    // Also ignore non alpha numeric characters like space and punctuation.
    if (withinTag || !is_alphanum(text[i])) {
      new_text += text[i];
      i += 1;
    } else {
      let found = false;

      // Check each available glossary word to find match at current offset i, in text.
      for (const word of target_words) {
        // check for overflow
        if (i + word.length - 1 < text.length) {
          // Get substring of word length at current offset in chatper text
          const sub = text.substring(i, i + word.length);

          // case-insensitive comparison
          if (String(sub).toLocaleLowerCase().localeCompare(word.toLocaleLowerCase()) === 0) {
            // TODO: Check if it is a complete word and not part of a longer one - regex?

            // Get html id for href tag
            const wordId = get_word_id(word);

            // Substitute the word in the text with href tag wrapped around it
            new_text += `<a href="#${wordId}">${word}</a>`;

            // Skip forwards in text by the length of current word
            i += word.length;

            // Remove word from list if we want first occurence only
            if (!highlightAll) {
              target_words = target_words.filter((w) => w !== word);
            }

            found = true;

            found_words.add(word);
          }
        }
      }

      if (!found) {
        // Append the current character without modification
        new_text += text[i];
        i += 1;
      }
    }
  }

  const chapter_glossary = [];

  for (const word of found_words) {
    chapter_glossary.push({
      word,
      link: glossary[word].link,
      description: glossary[word].description,
    });
  }

  return [new_text, chapter_glossary];
}

/** *
 * @param terms the terms returned from findGlossaryTermsInChapter
 */
export function glossaryTermsAsHTML(terms) {
  if (terms.length === 0) {
    return '';
  }

  let html = '<div>';

  html += '<h4>Glossary:</h4>';
  html += '<ul>';

  // sort the words alphabetically
  terms.sort((t1, t2) =>
    String(t1.word).toLowerCase().localeCompare(String(t2.word).toLowerCase()),
  );

  // Add each defintion as a <li> tag
  for (const elem of terms) {
    const wordId = `glossary_${String(elem.word).replaceAll(' ', '-')}`;
    html += `<li id='${wordId}'>${elem.word}: ${elem.description} <a href="${elem.link}">[more]</a></li>`;
    html += `<br/>`;
  }

  html += '</ul>';
  html += '</div>';

  return html;
}

/** *
 * @param terms the terms returned from findGlossaryTermsInChapter
 */
export function glossaryTermsAsText(terms) {
  if (terms.length === 0) {
    return '';
  }
  let text = '\nGlossary:\n';

  // Add each defintion as a <li> tag
  for (const elem of terms) {
    text += `${elem.word}: ${elem.description}\n`;
    text += '\n'; // Add space between list
  }

  return text;
}
