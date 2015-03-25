(function(exports) {
    "use strict";

    function trieNode() {
        return { objs: [], childs: {} };
    }
    function addToTrie(trie, token, obj) {
        var n = trie;
        var cs = token.split('');
        var c;
        while ((c = cs.shift())) {
            if (!n.childs[c]) n.childs[c] = trieNode();
            n = n.childs[c];
            n.objs.push(obj);
        }
    }

    function tokenize(s) {
        var tokens = s ? s.toLowerCase().split(/\s+/) : [];
        tokens = tokens.filter(function(t) {
            return !!t;
        });
        return tokens;
    }

    function and(store, intersection) {
        function compare(a, b) {
            return a - b;
        }

        if (store && store.length === 0)
            return store;
        if (intersection.length === 0)
            return intersection;

        intersection.sort(compare);
        if (store === null)
            return intersection;

        var storeIdx = 0;
        intersection.forEach(function(el) {
            var newIdx = store.indexOf(el, storeIdx);
            if (newIdx === -1)
                return;

            var nItems = newIdx - storeIdx;
            store.splice(storeIdx, nItems);
            storeIdx++;
        });
        store.length = storeIdx;
        return store;
    }
    function traverseTrie(trie, token) {
        var n = trie;
        var cs = token.split('');
        var c;
        while ((c = cs.shift())) {
            n = n.childs[c];
            if (!n)
                return [];
        }
        return n.objs;
    }
    function typeahead(trie, q) {
        var tokens = tokenize(q);
        var m = null;
        tokens.forEach(function(t) {
            var tm = traverseTrie(trie, t).slice();
            m = and(m, tm);
        });
        return { matches: m || [], tokens: tokens };
    }
    exports.typeahead = typeahead;

})(window);
