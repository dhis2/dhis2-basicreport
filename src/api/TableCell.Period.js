import { Axis } from 'd2-analysis';
import { TableCell } from './TableCell';

export var PeriodTableCell;

PeriodTableCell = function(refs, config) {
    var t = this,
        s = new TableCell(refs, config);

    $.extend(t, s);

    t.klass = PeriodTableCell;

    t.instanceManager;
    t.uiManager;

    this.period = config.period;

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

PeriodTableCell.prototype.showContextMenu = function(row, menuFn) {
    var t = this;

    var instanceManager = t.getInstanceManager(),
        uiManager = t.getUiManager();

    var itemsConfig = t.period.getContextMenuItemsConfig(),
        items = [];

    if (!itemsConfig || !itemsConfig.length) {
        return;
    }

    for (var i = 0, conf; i < itemsConfig.length; i++) {
        conf = itemsConfig[i];

        items.push(conf.isSubtitle ? {
            xtype: 'label',
            html: conf.text,
            style: conf.style
        } : {
            text: conf.text,
            iconCls: conf.iconCls,
            peReqItems: conf.items,
            handler: function() {
                var layout = instanceManager.getStateCurrent();

                var peDimension = {
                    dimension: 'pe',
                    items: this.peReqItems
                };

                layout.rows = new Axis([
                    peDimension,
                    layout.rows[1]
                ]);

                layout.setDataDimensionItems(function() {
                    var obj = {};

                    obj[row.dataObject.dataType] = {
                        id: row.dataObject.id
                    };

                    return [obj];
                }());

                instanceManager.getReport(layout, false, false, true);
            }
        });
    }

    var menu = menuFn({
        items: items
    });

    menu.showAt(uiManager.getContextMenuXY(Ext.get(t.elementId)));
};
