function highlightAndLinkGlossaryWords(text, terms) {
  let res = '';

  let i = 0;

  while (i < text.length) {
    let found = false;
    for (const elem of terms) {
      if (text.substring(i, i + elem.word.length) == elem.word) {
        const wordId = 'glossary_' + String(elem.word).replace(/ /g, '-');
        res += `<a href="${wordId}">${elem.word}</a>`;
        i += elem.word.length;
        found = true;
        break;
      }
    }
    if (!found) {
      res += text[i];
      i += 1;
    }
  }

  console.log(res);
  return res;
}

const terms = [
  {
    word: 'hello',
    description: 'hello world',
    link: 'www.google.com',
  },
  {
    word: 'hello2',
    description: 'hello world 2',
    link: 'www.google.com',
  },
  {
    word: 'hello3',
    description: 'hello world 3',
    link: 'www.google.com',
  },
  {
    word: 'word 4',
    description: 'hello world 4',
    link: 'www.google.com'
  }
];

const text = "hellohello2 hello3 word 4"

highlightAndLinkGlossaryWords(text, terms);
