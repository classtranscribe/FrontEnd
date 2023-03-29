/**
 * This file contains functionality to add an HTML/Text based glossary to an I-Note given text present in a chapter.
 * The glossary data is received from the backend through a mediaId.
 *
 * The getChapterGlossaryAndTextHighlight uses the glossary data to search for matching words in the text.
 * We substitute the glossary word with a link that points to the glossary section
 * where they can read the definition of the word.
 *
 * The actually glossary can be obtained using glossaryTermsAsHTML for EPub format or glossaryTermsAsText for PDF.
 *
 */

import { cthttp } from 'utils/cthttp/request';

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
    const response = await cthttp.get(`EPubs/GetGlossaryData?mediaId=${mediaId}`);
    const glossaryData = {};

    for (const term of response.data.Glossary) {
      const word = term[0];
      const description = term[1];
      const link = term[5];
      glossaryData[word] = { description, link };
    }

    return glossaryData;
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
 * @param {Boolean} highlightAll specifies whether we should highlight all occurrence or first occurrence of word
 * @returns Returns the following Array
 * - Index 0: The new chapter text with text highlighting
 * - Index 1: A subset of glossary containing words found in this text
 */
export function getChapterGlossaryAndTextHighlight(text, glossary, highlightAll) {
  let new_text = '';
  let inside_tag = false;
  let target_words = Object.keys(glossary);
  let chapter_glossary = {};

  for (let i = 0; i < text.length; ) {
    // First we check that we are not inside a TAG i.e. <>
    // Because we do not want to replace text within an attribute

    if (text[i] === '<') {
      inside_tag = true;
    }

    if (text[i] === '>') {
      inside_tag = false;
    }

    // Also ignore non alpha numeric characters like space and punctuation.
    if (inside_tag || !is_alphanum(text[i])) {
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

            chapter_glossary[word] = glossary[word];
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

  return [new_text, chapter_glossary];
}

export function glossaryToHTMLString(glossary) {
  if (Object.keys(glossary).length === 0) {
    return '';
  }

  let html = '<html><body><div>';
  html += '<h4>Glossary</h4>';
  html += '<ul>';
  
  // sort the words alphabetically
  Object.keys(glossary)
    .sort((t1, t2) => t1.toLowerCase().localeCompare(t2.toLowerCase()))
    .forEach(word => {
      // Add each defintion as a <li> tag
      const word_description = glossary[word].description;
      const word_link = glossary[word].link;
      const word_id = get_word_id(word);
      html += `<li id='${word_id}'>${word}: ${word_description}`;
      if(word_link && word_link.length > 0) { 
        html += `<a href="${word_link}">[more]</a>` 
      }
      html += `</li>`;
      html += `<br/>`;
    });

  html += '</ul>';
  html += '</div></body></html>';

  return html;
}

export function glossaryToText(glossary) {
  if (Object.keys(glossary).length === 0) {
    return '';
  }

  let text = '\nGlossary\n';

  // Add glossary words alphabetically
  Object.keys(glossary)
    .sort((t1, t2) => t1.toLowerCase().localeCompare(t2.toLowerCase()))
    .forEach(word => {
      text += `${word}: ${glossary[word].description}\n\n`;    
    });

  return text;
}
