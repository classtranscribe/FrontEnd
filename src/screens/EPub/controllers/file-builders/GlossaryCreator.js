const baseURL = "https://ct-dev.ncsa.illinois.edu"

export async function getGlossaryData(mediaId) {
    const response = await fetch(`${baseURL}/api/EPubs/GetGlossaryData?mediaId=${mediaId}`);

    if (response.ok) {
        console.log("Successfully got glossary data for mediaId: ", mediaId)

        const glossaryData = {} 
        const glossaryJson = await response.json();
        
        for(const term of glossaryJson["glossary"]) {
            const word = term[0]
            const description = term[1]
            console.log(word, description)
            glossaryData[word] = description
        }

        return glossaryData
    } 
    else {
        console.log("Failed to fetch glossary data for mediaId: ", mediaId, response.statusText)
        return {};
    }
}


/**
 *  Returns a list of { word, dcription } objects
 */ 
export function findGlossaryTermsInChapter(glossaryData, chapterText) 
{
    if(Object.keys(glossaryData).length === 0) {
        return [];
    }

    let foundTerms = []

    // TODO: will optimize later (maybe trie)  
    for(const [word, description] of glossaryData) {
        const index = chapterText.search(word);
        if(index == -1) { continue; }
        foundTerms.push({ word, description });
        delete glossaryData[word]; // ensures glossary is made only for first occurance 
    }

    return foundTerms
}

/***
 * @param terms the terms returned from findGlossaryTermsInChapter
 */
export function glossaryTermsAsHTML(terms)
{
    if (terms.length == 0) {
        return "";
    }
    // Wrap the list with a <ul> tag
    let html = '<ul>'; // Add opening tag

    // Add each defintion as a <li> tag
    for (const elem of terms) {
        html += `<li>${elem.word}: ${elem.description}</li>`;
    }

    html += '</ul>'; // Add closing tag

    return html;
}