import {TableCell} from './TableCell';

export var OrganisationUnitTableCell;

OrganisationUnitTableCell = function(config) {
	var t = this,
		s = new TableCell(config);

	Ext.apply(t, s);

	t.klass = OrganisationUnitTableCell;

	this.level = config.level;
	this.organisationUnit = config.organisationUnit;
};

OrganisationUnitTableCell.prototype.showContextMenu = function(row, menuFn) {
	var t = this;

	var instanceManager = t.klass.instanceManager;
	
	var itemsConfig = t.organisationUnit.getContextMenuItemsConfig(t.level),
		items = [];

	for (var i = 0, conf; i < itemsConfig.length; i++) {
		conf = itemsConfig[i];

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
				
				layout.columns = [];
				layout.rows = [];

				// dx
				layout.columns.push({
					dimension: 'dx',
					items: [{
						id: this.dxReqId,
						name: this.dxReqName,
						objectName: this.dxObjectName
					}]
				});

				// pe
				layout.rows.push({
					dimension: 'pe',
					items: [{
						id: this.peReqId,
						name: this.peReqName
					}]
				})

				// ou
				layout.rows.push({
					dimension: 'ou',
					items: [{id: this.ouReqId}]
				});

				layout.setDataDimensionItems(function() {
					var obj = {};

					obj[row.dataObject.dataType] = {
						id: row.dataObject.id
					};
					
					return [obj];
				}());
				
				layout.parentGraphMap = this.parentGraphMap;

				instanceManager.getReport(layout);
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
