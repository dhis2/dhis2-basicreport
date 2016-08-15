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
    t.tableCellGroups;
    t.tableCellGroupsLength;
};

TableColumn.prototype.addTableHeader = function(header) {
    this.tableHeader = header;
};

TableColumn.prototype.addTableCells = function(param) {
    this.tableCells = this.tableCells.concat(arrayFrom(param));
};

TableColumn.prototype.getTotalIndex = function() {
    return this.tableHeader && isNumber(this.index) ? (this.tableHeader.index + this.index) : null;
};

TableColumn.prototype.createGroups = function() {
    var t = this;

    var groups = [];
    var prevName;
    var group;

    t.tableCells.forEach(function(cell) {
        if (cell.name !== prevName) {
            if (group) {
                groups.push(group);
            }

            group = new TableCellGroup();
        }

        group.add(cell);

        prevName = cell.name;
    });

    groups.push(group);

    t.tableCellGroupsLength = groups.length;
    t.tableCellGroups = groups;

    return groups;
};

// dep 2

TableColumn.prototype.setCellAttributes = function() {
    var t = this;

    t.createGroups().forEach(function(group) {
        group.setSpan();
        group.setDisplay();
    });
};
