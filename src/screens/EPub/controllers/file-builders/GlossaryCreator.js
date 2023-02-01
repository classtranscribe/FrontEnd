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
		console.log('Successfully got glossary data for mediaId: ', mediaId);

		const glossaryData = {};
		const glossaryJson = await response.json();
		// console.log(glossaryJson);
		for (const term of glossaryJson['Glossary']) {
			const word = term[0];
			const description = term[1];
			const link = term[5];
			//   console.log(word, description, link);
			glossaryData[word] = { description, link };
		}

		return glossaryData;
	} else {
		console.log('Failed to fetch glossary data for mediaId: ', mediaId, response.statusText);
		return {};
	}
}

/**
 *  Returns a list of { word, dcription } objects
 */
export function findGlossaryTermsInChapter(glossaryData, chapterText) {
	if (Object.keys(glossaryData).length === 0) {
		return [];
	}

	let foundTerms = [];

	// TODO: will optimize later (maybe trie)
	for (const word in glossaryData) {
		const index = chapterText.search(word);
		if (index == -1) {
			continue;
		}

		foundTerms.push({
			word,
			description: glossaryData[word].description,
			link: glossaryData[word].link,
		});

		delete glossaryData[word]; // ensures glossary is made only for first occurance
	}
	return foundTerms;
}

export function highlightAndLinkGlossaryWords(text, terms) {
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
		} else {
			// Remove word to only highlight first occurence of the word
			terms_clone = terms_clone.filter(t => t.word != foundTerm);
		}
	}

	//   console.log(res);
	return res;
}

/***
 * @param terms the terms returned from findGlossaryTermsInChapter
 */
export function glossaryTermsAsHTML(terms) {
	if (terms.length == 0) {
		return '';
	}

	let html = '<div>';

	html += '<h4>Glossary:</h4>';
	html += '<ul>';

	// sort the words alphabetically
	terms.sort((t1, t2) => 
		String(t1.word).toLowerCase().localeCompare(
			String(t2.word).toLowerCase()));

	// Add each defintion as a <li> tag
	for (const elem of terms) {
		const wordId = 'glossary_' + String(elem.word).replaceAll(' ', '-');
		html += `<li id='${wordId}'>${elem.word}: ${elem.description} <a href="${elem.link}">[more]</a></li>`;
		html += `<br/>`;
	}

	html += '</ul>';
	html += '</div>';

	return html;
}

/***
 * @param terms the terms returned from findGlossaryTermsInChapter
 */
export function glossaryTermsAsText(terms) {
  if (terms.length == 0) {
    return '';
  }
  let text = '\nGlossary:\n';

  // Add each defintion as a <li> tag
  for (const elem of terms) {
    text += `${elem.word}: ${elem.description}\n`;
  }

  return text;
}
