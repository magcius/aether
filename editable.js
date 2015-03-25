(function(exports) {
    "use strict";

    function makeEditable(elem) {
        var isInput = false;

        elem.addEventListener('click', function() {
            if (isInput)
                return;

            isInput = true;

            var input = document.createElement('input');
            input.classList.add('editable-input');

            var w = elem.offsetWidth;
            input.style.width = w + 'px';

            // Inherit some basic styles.
            input.style.fontSize = window.getComputedStyle(elem).fontSize;

            var t = elem.textContent;
            input.value = t;

            elem.innerHTML = '';
            elem.appendChild(input);

            function setText(v) {
                elem.textContent = v;
                isInput = false;
            }
            function cancel() {
                setText(t);
            }
            function accept() {
                setText(input.value);
            }

            input.addEventListener('blur', function() {
                cancel();
            });
            input.addEventListener('keypress', function(e) {
                if (e.key == "Esc" || e.key == "Escape")
                    cancel();
            });
            input.addEventListener('change', function() {
                accept();
            });
            input.select();
        });
    }

    var elems = document.querySelectorAll('.aether-editable');
    [].forEach.call(elems, makeEditable);

})(window);
