import {Axis} from 'd2-analysis';
import {TableCell} from './TableCell';

export var OrganisationUnitTableCell;

OrganisationUnitTableCell = function(refs, config) {
    var t = this,
        s = new TableCell(refs, config);

    Ext.apply(t, s);

    t.klass = OrganisationUnitTableCell;

    t.instanceManager;
    t.uiManager;

    this.level = config.level;
    this.organisationUnit = config.organisationUnit;

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

OrganisationUnitTableCell.prototype.showContextMenu = function(row, menuFn) {
    var t = this,
        refs = this.getRefs();

    var instanceManager = t.getInstanceManager(),
        uiManager = t.getUiManager();

    var itemsConfig = t.organisationUnit.getContextMenuItemsConfig(t.level),
        items = [];

    itemsConfig.forEach(conf => {
        items.push(conf.isSubtitle ? {
            xtype: 'label',
            html: conf.text,
            style: conf.style
        } : {
            text: conf.text,
            iconCls: conf.iconCls,
            dxReqId: row.dataObject.id,
            dxReqName: row.dataObject.name,
            dxObjectName: row.dataObject.objectName,
            peReqId: row.period.id,
            peReqName: row.period.name,
            ouReqId: conf.id,
            parentGraphMap: conf.parentGraphMap,
            handler: function() {
                var layout = instanceManager.getStateCurrent();

                var ouDimension = {
                    dimension: 'ou',
                    items: [{id: this.ouReqId}]
                };

                layout.rows = new Axis(refs, [
                    layout.rows[0],
                    ouDimension
                ]);

                layout.setDataDimensionItems(function() {
                    var obj = {};

                    obj[row.dataObject.dataType] = {
                        id: row.dataObject.id
                    };

                    return [obj];
                }());

                layout.parentGraphMap = this.parentGraphMap;

                instanceManager.getReport(layout, false, false, true);
            }
        });
    });

    var menu = menuFn({
        items: items
    });

    menu.showAt(uiManager.getContextMenuXY(Ext.get(t.elementId)));
};
