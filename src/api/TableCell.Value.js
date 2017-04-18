import { Axis } from 'd2-analysis';
import { TableCell } from './TableCell';

export var ValueTableCell;

ValueTableCell = function(refs, config) {
    var t = this,
        s = new TableCell(refs, config);

    $.extend(t, s);

    t.klass = ValueTableCell;

    t.instanceManager;
    t.uiManager;

    t.getInstanceManager = function() {
        return t.instanceManager || config.instanceManager || t.klass.instanceManager;
    };

    t.getUiManager = function() {
        return t.uiManager || config.uiManager || t.klass.uiManager;
    };

    t.getRefs = function() {
        return refs;
    };
};

ValueTableCell.prototype.showContextMenu = function(row, menuFn) {
    //var t = this;

    //var instanceManager = t.getInstanceManager(),
        //uiManager = t.getUiManager();

    //var itemsConfig = t.period.getContextMenuItemsConfig(),
        //items = [];

    //if (!itemsConfig || !itemsConfig.length) {
        //return;
    //}


    //var menu = menuFn({
        //items: items
    //});

    //menu.showAt(uiManager.getContextMenuXY(Ext.get(t.elementId)));
};
