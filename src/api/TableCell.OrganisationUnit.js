import {Axis} from 'd2-analysis';
import {TableCell} from './TableCell';

export var OrganisationUnitTableCell;

OrganisationUnitTableCell = function(config) {
    var t = this,
        s = new TableCell(config);

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
console.log(t.uiManager);
console.log(config.uiManager);
console.log(t.klass.uiManager);
        return t.uiManager || config.uiManager || t.klass.uiManager;
    };
};

OrganisationUnitTableCell.prototype.showContextMenu = function(row, menuFn) {
    var t = this;

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
                var layout = instanceManager.getStateCurrent(),
                    columns = [],
                    rows = [];

                // dx
                columns.push({
                    dimension: 'dx',
                    items: [{
                        id: this.dxReqId,
                        name: this.dxReqName,
                        objectName: this.dxObjectName
                    }]
                });

                // pe
                rows.push({
                    dimension: 'pe',
                    items: [{
                        id: this.peReqId,
                        name: this.peReqName
                    }]
                });

                // ou
                rows.push({
                    dimension: 'ou',
                    items: [{id: this.ouReqId}]
                });

                layout.columns = new Axis(columns);
                layout.rows = new Axis(rows);

                layout.setDataDimensionItems(function() {
                    var obj = {};

                    obj[row.dataObject.dataType] = {
                        id: row.dataObject.id
                    };

                    return [obj];
                }());

                layout.parentGraphMap = this.parentGraphMap;

                instanceManager.getReport(layout, true);
            }
        });
    });

    var menu = menuFn({
        items: items
    });

    menu.showAt(uiManager.getContextMenuXY(Ext.get(t.elementId)));
};
