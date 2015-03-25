(function(exports) {
    "use strict";

    // List view of homogeneous model-based items

    function HomoList(template) {
        this._toplevel = document.createElement('div');
        this._toplevel.classList.add('homo-list');

        this._inside = document.createElement('div');
        this._toplevel.appendChild(this._inside);

        this._table = document.createElement('table');
        this._inside.appendChild(this._table);

        this._scrollTimeout = 0;

        this._toplevel.addEventListener('scroll', function() {
            if (this._scrollTimeout)
                clearTimeout(this._scrollTimeout);
            this._scrollTimeout = setTimeout(this._redisplay.bind(this), 20);
        }.bind(this));

        this._template = template;
        this._items = [];
        this._model = null;

        this.elem = this._toplevel;
    }
    HomoList.prototype.setModel = function(model, additionalData) {
        this._model = model;
        this._additionalData = additionalData;
        this._resize();
        this._redisplay(true);
    };
    HomoList.prototype._ensureMinItems = function(n) {
        if (this._items.length >= n)
            return;

        var frag = document.createDocumentFragment();
        while (this._items.length < n) {
            var templ = this._template();
            templ.$hasData = false;
            this._items.push(templ);
            frag.appendChild(templ.elem);
        }
        this._table.appendChild(frag);
    };
    HomoList.prototype._ensureMaxItems = function(n) {
        var extraItems = (this._items.length - n);
        if (extraItems <= 0)
            return;

        this._items.length = n;

        this._table.innerHTML = '';
        var frag = document.createDocumentFragment();
        this._items.forEach(function(item) {
            frag.appendChild(item.elem);
        });
        this._table.appendChild(frag);
    };
    HomoList.prototype._getHeightPerElem = function() {
        this._ensureMinItems(1);
        var templ = this._items[0].elem;
        return templ.offsetHeight;
    };
    HomoList.prototype._resize = function() {
        var heightPerElem = this._getHeightPerElem();
        var insideHeight = heightPerElem * this._model.length;
        this._inside.style.height = insideHeight + 'px';
    };
    HomoList.prototype._redisplay = function(newModel) {
        var heightPerElem = this._getHeightPerElem();

        this._ensureMaxItems(this._model.length);

        var containerY = this._toplevel.scrollTop;
        var containerHeight = this._toplevel.offsetHeight;

        var firstItem = Math.floor(containerY / heightPerElem);
        var lastItem = Math.min(Math.ceil((containerY + containerHeight) / heightPerElem), this._model.length);

        this._ensureMinItems(lastItem);

        for (var i = firstItem; i < lastItem; i++) {
            var item = this._items[i];
            if (newModel || !item.$hasData) {
                item.setModel(this._model[i], this._additionalData);
                item.$hasData = true;
            }
        }

        this._scrollTimeout = 0;
    };
    HomoList.prototype.centerItem = function(idx) {
        var heightPerElem = this._getHeightPerElem();
        var containerHeight = this._toplevel.offsetHeight;

        var elemTop = heightPerElem * idx;
        var centerFudge = (containerHeight + heightPerElem) / 2;
        this._toplevel.scrollTop = elemTop - centerFudge;
    };

    exports.HomoList = HomoList;

})(window);
