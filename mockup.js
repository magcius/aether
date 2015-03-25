(function(exports) {
    "use strict";

    document.querySelector('#sidebar-new-app').addEventListener('click', function() {
        location.reload();
    });

    var currentStage = document.querySelector('.stage.active').dataset.stage;
    function showStage(stage) {
        var s;

        s = document.querySelector('.stage-' + currentStage);
        if (s)
            s.classList.remove('active');

        currentStage = stage;

        s = document.querySelector('.stage-' + currentStage);
        if (s)
            s.classList.add('active');
    }

    var em = document.querySelectorAll('.stage-button');
    [].forEach.call(em, function(e) {
        e.addEventListener('click', function() {
            showStage(e.dataset.stage);
        });
    });

    function typeaheadFind(data, inputElem, results) {
        function clear() {
            while (results.firstChild)
                results.removeChild(results.firstChild);
        }

        function boldTokens(text, tokens) {
            var elem = document.createElement('span');
            var tt = text.split(/\s+/).filter(function(t) {
                return !!t;
            });
            function findtk(t) {
                for (var i = 0; i < tokens.length; i++)
                    if (t.toLowerCase().startsWith(tokens[i]))
                        return tokens[i];
                return null;
            }
            tt.forEach(function(t) {
                var tk = findtk(t);
                if (tk) {
                    var b = document.createElement('b');
                    b.textContent = t.slice(0, tk.length);
                    elem.appendChild(b);
                    var m = document.createElement('span');
                    m.textContent = t.slice(tk.length);
                    elem.appendChild(m);
                } else {
                    elem.appendChild(document.createTextNode(t));
                }
                elem.appendChild(document.createTextNode(' '));
            });
            return elem;
        }
        function renderMatch(match, tokens) {
            var elem = document.createElement('div');
            elem.classList.add('big-search-result');
            elem.classList.add(match.type);

            var title = document.createElement('span');
            title.classList.add('big-search-result-title');
            title.appendChild(boldTokens(match.title, tokens));
            elem.appendChild(title);

            var ctx = document.createElement('span');
            ctx.classList.add('big-search-result-context');
            if (match.url) ctx.textContent = match.url;
            elem.appendChild(ctx);

            return elem;
        }

        function compareType(ta, tb) {
            if (ta === tb)
                return 0;
            var weights = ['category', 'article'];
            var wa = weights.indexOf(ta);
            var wb = weights.indexOf(tb);
            if (wa < 0) yell;
            if (wb < 0) yell;
            return wa - wb;
        }
        function compareMatch(ma, mb) {
            return compareType(ma.type, mb.type);
        }

        function search(v) {
            var res = window.typeahead(data.trie, v);
            var matches = res.matches;
            var tokens = res.tokens;
            matches = matches.sort(function(a, b) {
                var da = data.pool[a];
                var db = data.pool[b];
                return compareMatch(da, db);
            });
            matches = matches.slice(0, 10);
            clear();
            matches.forEach(function(idx) {
                var d = data.pool[idx];
                results.appendChild(renderMatch(d, tokens));
            });
        }
        inputElem.addEventListener('input', function(e) {
            search(inputElem.value);
        });
    }

    typeaheadFind(window.BIG_DATA,
                  document.querySelector('.big-search'),
                  document.querySelector('.big-search-results'));

})(window);
