(function(exports) {
    "use strict";

    document.querySelector('#sidebar-new-app').addEventListener('click', function() {
        location.reload();
    });

    var currentStage = 'welcome';
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

    document.querySelector('#sidebar-content').addEventListener('click', function() {
        showStage('content');
    });
    document.querySelector('#sidebar-design').addEventListener('click', function() {
        showStage('design');
    });

})(window);
