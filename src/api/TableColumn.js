import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayUnique from 'd2-utilizr/lib/arrayUnique';

export var TableColumn;

TableColumn = function(config) {
    var t = this;

    config = config || {};

    t.tableHeader = config.tableHeader || null;
    t.tableCells = config.tableCells || [];
};

TableColumn.prototype.addTableHeader = function(header) {
    this.tableHeader = header;
};

TableColumn.prototype.addTableCells = function(param) {
    this.tableCells = this.tableCells.concat(arrayFrom(param));
};

TableColumn.prototype.getUnique = function() {
    return arrayUnique(this.tableCells).length;
};
