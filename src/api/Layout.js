import isObject from 'd2-utilizr/lib/isObject';

import { Layout as d2aLayout } from 'd2-analysis';

export var Layout = function(refs, config, applyConfig, forceApplyConfig) {
    var t = this;
    t.klass = Layout;

    config = isObject(config) ? config : {};

    // inherit
    Object.assign(t, new d2aLayout(refs, config, applyConfig));
};

Layout.prototype = d2aLayout.prototype;

Layout.prototype.clone = function() {
    var t = this,
        refs = this.getRefs();

    var layout = new refs.api.Layout(refs, JSON.parse(JSON.stringify(t)));

    layout.setResponse(t.getResponse());
    layout.setAccess(t.getAccess());
    layout.setDataDimensionItems(t.getDataDimensionItems());

    return layout;
};

Layout.prototype.setOrToggleSorting = function(sorting, returnThis) {
    if (!this.sorting || this.sorting.id !== sorting.id) {
        this.sorting = sorting;
    }
    else {
        this.sorting.toggleDirection();
    }

    if (returnThis) {
        return this;
    }
};
