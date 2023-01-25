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

const trie = new Glossary();
trie.insert("abc");
trie.insert("bc");
trie.insert("cde");

const assert = require('assert')

assert(trie.has_prefix("cd"));
assert(!trie.has_complete("cd"));
assert(trie.has_complete("cde"));

assert(trie.has_prefix("ab"))
assert(trie.has_prefix("abc"))

assert(!trie.has_complete("ab"))
assert(trie.has_complete("abc"))