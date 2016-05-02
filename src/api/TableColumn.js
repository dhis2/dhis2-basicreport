import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayUnique from 'd2-utilizr/lib/arrayUnique';

import {TableCellGroup} from './TableCellGroup';

export var TableColumn;

TableColumn = function(config) {
    var t = this;

    config = config || {};

    t.tableHeader = config.tableHeader || null;
    t.tableCells = config.tableCells || [];

    // transient
    t.index = config.index || null;
    t.tableCellGroups = [];
};

TableColumn.prototype.addTableHeader = function(header) {
    this.tableHeader = header;
};

TableColumn.prototype.addTableCells = function(param) {
    this.tableCells = this.tableCells.concat(arrayFrom(param));
};

//TableColumn.prototype.getUnique = function() {
    //return arrayUnique(this.tableCells).length;
//};

TableColumn.prototype.getTotalIndex = function() {
    return this.tableHeader && isNumber(this.index) ? (this.tableHeader.index + this.index) : null;
};

// dep 2

TableColumn.prototype.createGroups = function() {
    var t = this;
    var prevName;
    var group;

    t.tableCells.forEach(function(cell) {
        if (cell.name !== prevName) {
            if (group) {
                t.tableCellGroups.push(group);
            }

            group = new TableCellGroup();
        }

        group.add(cell);

        prevName = cell.name;
    });

    t.tableCellGroups.push(group);
};

TableColumn.prototype.analyzeGroups = function() {
    this.tableCellGroups.forEach(function(group) {
        group.setSpan();
        group.setDisplay();
    });
};
