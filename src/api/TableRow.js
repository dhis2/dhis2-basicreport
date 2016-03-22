export var TableRow;

TableRow = function(config) {
	var t = this;

	t.dataObject = config.dataObject;
	t.period = config.period;
	t.organisationUnit = config.organisationUnit;

	// transient

	t.cellMap = {};
};

// base

TableRow.prototype.addCell = function(thId, cell) {
	this.cellMap[thId] = cell;
};

TableRow.prototype.getCellById = function(thId) {
	return this.cellMap[thId];
};
