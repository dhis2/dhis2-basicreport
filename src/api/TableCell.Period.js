import {Dimension} from 'd2-analysis';
import {TableCell} from './TableCell';

export var PeriodTableCell;

PeriodTableCell = function(config) {
    var t = this,
        s = new TableCell(config);

    $.extend(t, s);

    t.klass = PeriodTableCell;

    t.instanceManager;

    this.period = config.period;

    t.getInstanceManager = function() {
        return t.instanceManager || config.instanceManager || t.klass.instanceManager;
    };
};

PeriodTableCell.prototype.showContextMenu = function(menuFn) {
    var t = this;

    var instanceManager = t.getInstanceManager();

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

                // pe
                layout.rows[0] = new Dimension({
                    dimension: 'pe',
                    items: this.peReqItems
                });

                instanceManager.getReport(layout, true);
            }
        });
    }

    var menu = menuFn({
        items: items
    });

    menu.showAt(function() {
        var el = Ext.get(t.elementId),
            height = el.getHeight(),
            width = el.getWidth(),
            xy = el.getXY();

        xy[0] += width - (height / 2);
        xy[1] += height - (height / 2);

        return xy;
    }());
};
