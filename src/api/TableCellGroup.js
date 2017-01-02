//import arrayFrom from 'd2-utilizr/lib/arrayFrom';
//import arrayUnique from 'd2-utilizr/lib/arrayUnique';

export var TableCellGroup;

TableCellGroup = function() {
    var t = this;

    t.cells = [];
};

TableCellGroup.prototype.add = function(cell) {
    this.cells.push(cell);
};

TableCellGroup.prototype.getFirst = function() {
    return this.cells[0];
};

TableCellGroup.prototype.setDisplay = function() {
    this.cells.forEach(function(cell, index) {
        if (index !== 0) {
            cell.hidden = true;
        }
    });
};

// dep 2

TableCellGroup.prototype.setSpan = function() {
    this.getFirst().span = this.cells.length;
};

TableCellGroup.prototype.setTitle = function() {
    this.getFirst().title = this.getFirst().name;
};
