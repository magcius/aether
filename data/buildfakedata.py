
import glob
import json
import sys

def trieNode():
    return dict(objs=[], childs={})
def addToTrie(trie, token, obj):
    n = trie
    for c in token:
        if c not in n['childs']:
            n['childs'][c] = trieNode()
        n = n['childs'][c]
        n['objs'].append(obj)
def tokenize(s):
    return s.lower().split()
def mdb():
    return dict(trie=trieNode(),
                pool=[])
def addtodb(db, obj, tokens):
    idx = len(db['pool'])
    db['pool'].append(obj)
    for t in tokens:
        addToTrie(db['trie'], t, idx)
    return idx

def main():
    db = mdb()

    for fn in glob.glob('wikipedia/json/*.json'):
        name = fn[15:-5]

        with open(fn, 'rb') as f:
            c = json.load(f)

        artidxs = []
        for art in c:
            tk = tokenize(art['title'])
            obj = dict(type='article', **art)
            artidx = addtodb(db, obj, tk)
            artidxs.append(artidx)

        ctk = tokenize(name)
        cobj = dict(title=name, type='category', articles=artidxs)
        addtodb(db, cobj, ctk)

    dbs = json.dumps(db)
    with open('db.json', 'wb') as f:
        f.write(dbs)
    with open('db.js', 'wb') as f:
       f.write("""(function(exports) {
"use strict";

exports.BIG_DATA =
%s
;

})(window);""" % (dbs,))

main()
