class Node
{
    constructor(letter) {
        this.value = letter
        this.children = {}
        this.end = false;
    }

    insert(str)
    {
        if(str.length == 0) {
            this.end = true;
            return;
        }

        if(!this.children[str[0]]) {
            this.children[str[0]] = new Node(str[0]);
        }

        this.children[str[0]].insert(str.substr(1));
    }

    find(str)
    {
        if(str.length == 0) {
            return this;
        }

        if(this.children[str[0]]) {
            return this.children[str[0]].find(str.substr(1));
        }

        return null;
    }

    remove(str)
    {

    }
}

class Glossary
{
    constructor()
    {
        this.root = new Node('');
    }

    insert(str)
    {
        this.root.insert(str);
    }

    find(str)
    {
        if(str.length == 0) {
            return this.root;
        }

        return this.root.find(str);
    }

    has_prefix(str)
    {
        return this.find(str) != null;
    }

    has_complete(str)
    {
        const node = this.find(str);

        if(node) {
            return node.end;
        }
        
        return false;
    }
}

// let trie = new Glossary();
// trie.insert("abc");
// trie.insert("bc");
// trie.insert("cde");

// const assert = require('assert')

// assert(trie.has_prefix("cd"));
// assert(!trie.has_complete("cd"));
// assert(trie.has_complete("cde"));

// assert(trie.has_prefix("ab"))
// assert(trie.has_prefix("abc"))

// assert(!trie.has_complete("ab"))
// assert(trie.has_complete("abc"))

const glossaryData = {
    'hello world': '1',
    'abc': '2',
}

console.log("==================================")

const chapterText = "'hello world hello world hello world abc abc abc'";

trie = new Glossary();

for (const key of Object.keys(glossaryData)) {
    trie.insert(key);
}

for(let i = 0; i < chapterText.length; i++)
{
    let found = false;
    let word = '';

    let itr = trie.find(chapterText[i]);

    for (let j = i+1; itr && j < chapterText.length; j++) {
        // console.log(i,j,itr);

        if (itr.end) {
            found = true;
            word = chapterText.substring(i, j);
            break;
        }
        else {
            itr = itr.children[chapterText[j]];
        }
    }

    if (itr && itr.end) {
        console.log("Found at i=", i, word)
    } else {
        // console.log("Not found at i=",i);
    }
}