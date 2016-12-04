import isBoolean from 'd2-utilizr/lib/isBoolean';
import isEmpty from 'd2-utilizr/lib/isEmpty';
import isObject from 'd2-utilizr/lib/isObject';
import isString from 'd2-utilizr/lib/isString';

import { Layout as d2aLayout } from 'd2-analysis';

export var Layout = function(refs, c, applyConfig, forceApplyConfig) {
    var t = this;
    t.klass = Layout;

    c = isObject(c) ? c : {};

    // inherit
    Object.assign(t, new d2aLayout(refs, c, applyConfig));

    // options
    t.showDataDescription = isBoolean(c.showDataDescription) ? c.showDataDescription : (isBoolean(c.showDataDescription) ? c.showDataDescription : true);
    t.hideEmptyRows = isBoolean(c.hideEmptyRows) ? c.hideEmptyRows : false;

    t.showHierarchy = isBoolean(c.showHierarchy) ? c.showHierarchy : false;

    t.reduceLayout = isBoolean(c.reduceLayout) ? c.reduceLayout : false;

    t.displayDensity = isString(c.displayDensity) && !isEmpty(c.displayDensity) ? c.displayDensity : refs.optionConfig.getDisplayDensity('normal').id;
    t.fontSize = isString(c.fontSize) && !isEmpty(c.fontSize) ? c.fontSize : refs.optionConfig.getFontSize('normal').id;
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
