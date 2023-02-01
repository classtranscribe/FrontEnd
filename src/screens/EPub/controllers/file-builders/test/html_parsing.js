function test(textHTML, subsMap) {
  let withinTag = false;
  let res = '';

  for (let i = 0; i < textHTML.length; ) {
    if (textHTML[i] == '<') {
      res += textHTML[i];
      withinTag = true;
      i++;
      continue;
    }

    if (textHTML[i] == '>') {
      res += textHTML[i];
      withinTag = false;
      i++;
      continue;
    }

    if (withinTag) {
      res += textHTML[i];
      i++;
      continue;
    }

    let found = false;

    for (const word of Object.keys(subsMap)) {
      if (textHTML.substring(i, i + word.length).localeCompare(word) == 0) {
        res += subsMap[word];
        i += word.length;
        found = true;
        break;
      }
    }

    if (found) {
      continue;
    }

    res += textHTML[i];
    i++;
  }

  console.log(res);
  return res;
}

function subsWords(text, subsMap) {
  let res = '';

  for (let i = 0; i < text.length; ) {
    let found = false;

    for (const word of Object.keys(subsMap)) {
      if (text.substring(i, i + word.length).localeCompare(word) == 0) {
        res += subsMap[word];
        i += word.length;
        found = true;
        break;
      }
    }

    if (found) {
      continue;
    }

    res += text[i];
    i++;
  }

  return res;
}

function replaceWords(node, subsMap) {
  const newNode = node.cloneNode();

  for (const child of node.children) {
    newNode.append(replaceWords(child, subsMap));
  }

  console.log(newNode);

  newNode.innerText = subsWords(node.innerText, subsMap);
  return newNode;
}

function testParser(text, subsMap) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(text, 'text/html');

  let tmp = document.createElement('body');

  for (let i = 0; i < dom.body.children.length; i++) {
    tmp.appendChild(replaceWords(dom.body.children[i], subsMap));
  }

  dom.body = tmp;

  console.log(dom);
}

testParser(
  `<html><body>
<p>This is a paragraph.</p>
<p>This is a paragraph.</p>
<p>This is a paragraph.</p>
</body></html>`,
  {
    paragraph: 'helloworld',
    'is a': 'is_a',
  },
);
