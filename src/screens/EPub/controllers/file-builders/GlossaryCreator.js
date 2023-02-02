const baseURL = 'https://ct-dev.ncsa.illinois.edu';

export async function getGlossaryData(mediaId) {
  const response = await fetch(`${baseURL}/api/EPubs/GetGlossaryData?mediaId=${mediaId}`, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    headers: {
      accept: '*/*',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlcjk5OUBjbGFzc3RyYW5zY3JpYmUuY29tIiwianRpIjoiMzRmYWE0ZWEtMDhiYi00ZjAxLWIzYzctNWZkMTM5MWRiNmNkIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZ2l2ZW5uYW1lIjoiVGVzdCIsImh0dHA6Ly9zY2hlbWFzLnhtbHNvYXAub3JnL3dzLzIwMDUvMDUvaWRlbnRpdHkvY2xhaW1zL3N1cm5hbWUiOiJVc2VyIiwiaHR0cDovL3NjaGVtYXMueG1sc29hcC5vcmcvd3MvMjAwNS8wNS9pZGVudGl0eS9jbGFpbXMvZW1haWxhZGRyZXNzIjoidGVzdHVzZXI5OTlAY2xhc3N0cmFuc2NyaWJlLmNvbSIsImNsYXNzdHJhbnNjcmliZS9Vc2VySWQiOiI5OSIsImh0dHA6Ly9zY2hlbWFzLm1pY3Jvc29mdC5jb20vd3MvMjAwOC8wNi9pZGVudGl0eS9jbGFpbXMvcm9sZSI6WyJJbnN0cnVjdG9yIiwiQWRtaW4iXSwiZXhwIjoxNjc3MDkyNzcyLCJpc3MiOiJodHRwczovL2N0LWRldi5uY3NhLmlsbGlub2lzLmVkdSIsImF1ZCI6Imh0dHBzOi8vY3QtZGV2Lm5jc2EuaWxsaW5vaXMuZWR1In0.zBrLKBnbqhKMc1BOugzo8-2-kEatX0rW2WcS18yqNV4',
    },
  });

  if (response.ok) {
    // console.log('Successfully got glossary data for mediaId: ', mediaId);

    const glossaryData = {};
    const glossaryJson = await response.json();
    // console.log(glossaryJson);
    for (const term of glossaryJson.Glossary) {
      const word = term[0];
      const description = term[1];
      const link = term[5];
      //   console.log(word, description, link);
      glossaryData[word] = { description, link };
    }

    return glossaryData;
  }
  // console.log('Failed to fetch glossary data for mediaId: ', mediaId, response.statusText);
  return {};
}

<<<<<<< HEAD
/**
 *  Returns a list of { word, dcription } objects
 */
export function findGlossaryTermsInChapter(glossaryData, chapterText) {
  const keys = Object.keys(glossaryData);
  if (keys.length === 0) {
    return [];
  }

  let foundTerms = [];

  // TODO: will optimize later (maybe trie)
  for (let i = 0; i < keys.length; i += 1) {
    const word = keys[i];
    const index = chapterText.search(word);

    if (index !== -1) {
      foundTerms.push({
        word,
        description: glossaryData[word].description,
        link: glossaryData[word].link,
      });

      delete glossaryData[word]; // ensures glossary is made only for first occurance
    }
  }
  return foundTerms;
}

<<<<<<< HEAD
<<<<<<< HEAD
export function highlightAndLinkGlossaryWords(text, terms) {
  let res = '';

  let i = 0;

  let terms_clone = terms.map((t) => ({ ...t }));

  while (i < text.length) {
    let found = false;
    let foundTerm = null;

    for (const elem of terms_clone) {
      if (text.substring(i, i + elem.word.length) == elem.word) {
        const wordId = 'glossary_' + String(elem.word).replace(/ /g, '-');
        res += `<a href="#${wordId}">${elem.word}</a>`;
        i += elem.word.length;
        found = true;
        foundTerm = elem.word;
        break;
      }
    }
    if (!found) {
      res += text[i];
      i += 1;
    } else {
      // Remove word to only highlight first occurence of the word
      terms_clone = terms_clone.filter((t) => t.word != foundTerm);
    }
  }

  console.log(res);
  return res;
=======
=======
=======
>>>>>>> ed134b59 (INote glossary bugs resolved)
function is_alphanum(char) {
  return char.match(/[a-zA-Z0-9]/i);
}

// Return HTML id for this word in the glossary section
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
<<<<<<< HEAD
>>>>>>> a84f0211 (Added documentation for the highlightAndLinkGlossaryWords function)
export function highlightAndLinkGlossaryWords(text, terms, highlightFirstOnly) {
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
	let res = '';

	let i = 0;

	let terms_clone = terms.map(t => ({...t}));

	while (i < text.length) {
		let found = false;
		let foundTerm = null;
		for (const elem of terms_clone) {
			if (text.substring(i, i + elem.word.length) == elem.word) {
				const wordId = 'glossary_' + String(elem.word).replace(/ /g, '-');
				res += `<a href="#${wordId}">${elem.word}</a>`;
				i += elem.word.length;
				found = true;
				foundTerm = elem.word;
				break;
			}
		}
		if (!found) {
			res += text[i];
			i += 1;
		} else if (highlightFirstOnly) {
			// Remove word to only highlight first occurence of the word
			terms_clone = terms_clone.filter(t => t.word != foundTerm);
		}
	}

	//   console.log(res);
	return res;
>>>>>>> f99bf82c (add toggle for highlighting only first occurance)
=======
=======
  console.log(highlightFirstOnly);

>>>>>>> 4a7362c5 (highlight first occurrence by default)
=======
>>>>>>> ccae1272 (fix linter errors)
  let res = '';
=======
export function getChapterGlossaryAndTextHighlight(text, glossary, highlightFirstOnly) {
  console.log(highlightFirstOnly);

  let new_text = '';
>>>>>>> ed134b59 (INote glossary bugs resolved)
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
        if (i + word.length - 1 >= text.length) {
          continue;
        }

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
          if (highlightFirstOnly) {
            target_words = target_words.filter((w) => w !== word);
          }

          found = true;

          found_words.add(word);
        }
      }

      if (!found) {
        // Append the current character without modification
        new_text += text[i];
        i += 1;
      }
    }
  }

<<<<<<< HEAD
  //   console.log(res);
  return res;
>>>>>>> 41e38a68 (Substitutes text inside tags only)
=======
  const chapter_glossary = [];

  for (const word of found_words) {
    chapter_glossary.push({
      word: word,
      link: glossary[word].link,
      description: glossary[word].description,
    });
  }

  return [new_text, chapter_glossary];
>>>>>>> ed134b59 (INote glossary bugs resolved)
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
  }

  return text;
}
