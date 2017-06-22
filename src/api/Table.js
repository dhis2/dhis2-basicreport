import isString from 'd2-utilizr/lib/isString';
import isObject from 'd2-utilizr/lib/isObject';
import isNumber from 'd2-utilizr/lib/isNumber';
import isEmpty from 'd2-utilizr/lib/isEmpty';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arraySort from 'd2-utilizr/lib/arraySort';

import { Request, Response, Sorting } from 'd2-analysis';

import { OrganisationUnitTableCell } from './TableCell.OrganisationUnit';
import { PeriodTableCell } from './TableCell.Period';
import { ValueTableCell } from './TableCell.Value';
import { TableColumn } from './TableColumn';

export var Table;

Table = function(refs, config) {
    var t = this;

    t.klass = Table;

    t.appManager;
    t.instanceManager;
    t.tableManager;

    t.tableHeaders = config.tableHeaders;
    t.tableRows = config.tableRows;
    t.cls = config.cls;

    t.sorting = config.sorting || {
        id: 'pe',
        direction: 'ASC'
    };

    // static
    t.sortId = 'sortId';

    // transient
    t.cellIdRowMap;

    t.lastSorting = {
        id: 'pe',
        direction: 'ASC'
    };

    t.html;

    t.update;

    t.getAppManager = function() {
        return t.appManager || config.appManager || t.klass.appManager;
    };

    t.getInstanceManager = function() {
        return t.instanceManager || config.instanceManager || t.klass.instanceManager;
    };

    t.getTableManager = function() {
        return t.tableManager || config.tableManager || t.klass.tableManager;
    };

    t.getRefs = function() {
        return refs;
    };
};

Table.prototype.getCellIdRowMap = function() {
    if (this.cellIdRowMap) {
        return this.cellIdRowMap;
    }

    this.cellIdRowMap = {};

    for (var i = 0, row; i < this.tableRows.length; i++) {
        row = this.tableRows[i];

        for (var key in row.cellMap) {
            if (row.cellMap.hasOwnProperty(key)) {
                this.cellIdRowMap[row.cellMap[key].id] = row;
            }
        }
    }

    return this.cellIdRowMap;
};

Table.prototype.sortData = function() {
    var t = this;

    t.tableRows.sort(function(a, b) {
        a = a.getCellById(t.sorting.id)[t.sortId];
        b = b.getCellById(t.sorting.id)[t.sortId];

        // string
        if (isString(a) && isString(b)) {
            a = a.toLowerCase();
            b = b.toLowerCase();

            if (t.sorting.direction === 'DESC') {
                return a < b ? 1 : (a > b ? -1 : 0);
            }
            else {
                return a < b ? -1 : (a > b ? 1 : 0);
            }
        }

        // number
        else if (isNumber(a) && isNumber(b)) {
            return t.sorting.direction === 'DESC' ? b - a : a - b;
        }

        else if (isEmpty(a)) {
            return t.sorting.emptyFirst ? -1 : 1;
        }

        else if (isEmpty(b)) {
            return t.sorting.emptyFirst ? 1 : -1;
        }

        return -1;
    });
};

Table.prototype.addOptionsCls = function(config) {

    // display density
    this.cls += ' displaydensity-' + (config.displayDensity || 'NORMAL').toLowerCase();

    // font size
    this.cls += ' fontsize-' + (config.fontSize || 'NORMAL').toLowerCase();

    return this.cls;
};

Table.prototype.getHtml = function() {
    var html = '<table class="pivot ' + this.cls + '">';

    html += '<tr>';

    for (var i = 0; i < this.tableHeaders.length; i++) {
        html += this.tableHeaders[i].getHtml();
    }

    html += '</tr>';

    for (var j = 0, row, tc; j < this.tableRows.length; j++) {
        row = this.tableRows[j];
        html += '<tr>';

        this.tableHeaders.filter(function(header) {
            return !header.hidden;
        }).forEach(function(th) {
            tc = row.getCellById(th.id);
            html += tc.getHtml();
        });

        html += '</tr>';
    }

    html += '</table>';

    return this.html = html;
};

Table.prototype.getTableCellsByInstance = function(type) {
    var cells = [];

    for (var i = 0, row; i < this.tableRows.length; i++) {
        row = this.tableRows[i].cellMap;

        for (var key in row) {
            if (row.hasOwnProperty(key) && row[key] instanceof type) {
                cells.push(row[key]);
            }
        }
    }

    return cells;
};

Table.prototype.addHeaderClickListeners = function() {
    var t = this,
        refs = this.getRefs();

    var instanceManager = t.getInstanceManager();
    var el;

    t.tableHeaders.filter(function(header) {
        return !header.hidden;
    }).forEach(function(th) {
        el = Ext.get(th.elementId);
        el.tableHeaderId = th.id;

        el.on('click', function() {
            instanceManager.getReport(instanceManager.getStateCurrent().setOrToggleSorting(new Sorting(refs, {
                id: this.tableHeaderId,
                direction: 'ASC'
            }), true));
        });
    });
};

Table.prototype.getTableColumns = function() {
    var t = this;

    var columns = [];

    var column;
    var cells;

    arraySort(t.tableHeaders, 'ASC', 'index');

    t.tableHeaders.forEach(function(header) {
        column = new TableColumn();
        cells = [];

        column.addTableHeader(header);

        t.tableRows.forEach(function(row) {
            cells.push(row.getCellById(header.id));
        });

        column.addTableCells(cells);

        columns.push(column);
    });

    return columns;
};

// dep 1
Table.prototype.getRowByCellId = function(cellId) {
    return this.getCellIdRowMap()[cellId];
};

Table.prototype.reduce = function() {
    var columns = this.getTableColumns(),
        excludedKeys = this.getTableManager().excludedReduceKeys,
        groups;

    // create groups, set span/display
    columns.forEach(function(column) {

        // if excluded, push to the right
        if (arrayContains(excludedKeys, column.tableHeader.id)) {
            column.tableCellGroupsLength = (column.tableCells.length + column.tableHeader.index);
            return;
        }

        column.createGroups();
        column.setCellAttributes();
    });

    //// sort columns
    //arraySort(columns, 'ASC', 'tableCellGroupsLength');

    //// set index, sort headers
    //columns.forEach(function(column, i) {
        //column.tableHeader.reduceIndex = i;
    //});

    //arraySort(this.tableHeaders, 'ASC', 'reduceIndex');
};

// dep 2
Table.prototype.addOuClickListeners = function() {
    var t = this,
        cells = this.getTableCellsByInstance(OrganisationUnitTableCell);

    for (var i = 0, cell, el; i < cells.length; i++) {
        cell = cells[i];

        if (cell.isEmpty) {
            continue;
        }

        el = Ext.get(cell.elementId);
        el.cell = cell;
        el.row = t.getRowByCellId(cell.id);

        el.on('click', function(event) {
            this.cell.showContextMenu(this.row, function(items) {
                return t.getTableManager().getContextMenu(items);
            });
        });
    }
};

Table.prototype.addPeClickListeners = function(layout, tableFn) {
    var t = this,
        cells = this.getTableCellsByInstance(PeriodTableCell);

    for (var i = 0, cell, el; i < cells.length; i++) {
        cell = cells[i];

        if (cell.isEmpty) {
            continue;
        }

        el = Ext.get(cell.elementId);
        el.cell = cell;
        el.row = t.getRowByCellId(cell.id);

        el.on('click', function(event) {
            this.cell.showContextMenu(this.row, function(items) {
                return t.getTableManager().getContextMenu(items);
            });
        });
    }
};

Table.prototype.addValueClickListeners = function(layout, tableFn) {
    var t = this,
        refs = this.getRefs(),
        cells = this.getTableCellsByInstance(ValueTableCell);

    var apiPath = this.getAppManager().getApiPath();

    var uiManager = refs.uiManager;

    var onError = function() {
        uiManager.unmask();
    };

    var valueClickHandler = function(el) {
        var row = el.cell.row;

        var dx = row.dataObject;
        var pe = row.period;
        var ou = row.organisationUnit;

        var dxIds = dx.getIds();
        var peId = pe.id;
        var ouId = ou.id;

console.log("dx", dx);
console.log("pe", pe);
console.log("ou", ou);

        var params = [
            'dimension=dx:' + dxIds.join(';'),
            'dimension=pe:' + peId,
            'dimension=ou:' + ouId,
            'aggregationType=COUNT'
        ];

        var countRequest = new Request(refs, {
            baseUrl: apiPath + '/analytics',
            params: params,
            error: onError
        });

        var rawRequest = new Request(refs, {
            baseUrl: apiPath + '/analytics/rawData.json',
            params: params,
            error: onError
        });

        countRequest.run().done(function(countResponse) {
            countResponse = new Response(refs, countResponse);

            if (!countResponse) {
                return;
            }

            var count = countResponse.getTotal();
            console.log("number of raw values: ", count);

            rawRequest.run().done(function(rawResponse) {
                console.log(rawResponse);

                rawResponse = new Response(refs, rawResponse);

                var extremalRows = rawResponse.getExtremalRows();

                var rawDxIndex = rawResponse.getHeaderIndexByName('dx');
                var rawDxIds = extremalRows.map(row => row[rawDxIndex]);

                var nameDxRequest = new Request(refs, {
                    baseUrl: apiPath + '/dataElements.json',
                    params: [
                        'fields=id,displayName~rename(name)',
                        'filter=id:in:[' + rawDxIds.join(',') + ']',
                        'paging=false'
                    ],
                    error: onError
                });

                var rawOuIndex = rawResponse.getHeaderIndexByName('ou');
                var rawOuIds = extremalRows.map(row => row[rawOuIndex]);

                var nameOuRequest = new Request(refs, {
                    baseUrl: apiPath + '/organisationUnits.json',
                    params: [
                        'fields=id,displayName~rename(name)',
                        'filter=id:in:[' + rawOuIds.join(',') + ']',
                        'paging=false'
                    ],
                    error: onError
                });

                nameDxRequest.run().done(function(rawDxResponse) {
                    console.log("rawDxResponse", rawDxResponse);

                    nameOuRequest.run().done(function(rawOuResponse) {
                        console.log("rawOuResponse", rawOuResponse);

                        var rawMetaDataItems = [].concat(rawDxResponse.dataElements, rawOuResponse.organisationUnits).reduce((map, item) => {
                            map[item.id] = {
                                name: item.name
                            };

                            return map;
                        }, {});

                        var extLen = extremalRows.length;
                        var extLimit = 10;
                        var rawPeIndex = rawResponse.getHeaderIndexByName('pe');

                        rawResponse.addMetaDataItems(rawMetaDataItems);

                        var msg = dx.name + ', ' + pe.name + ', ' + ou.name;
                        msg += '<br><br>';
                        msg += 'Total number of values: ' + count;
                        msg += '<br><br>';
                        msg += '<table>';
                        msg += extremalRows.slice(0, extLimit).map(row => row.getRowHtml(rawResponse, null, null, [rawPeIndex])).join('');
                        msg += '<tr style="height:12px"><td colspan="3" style="text-align:center; padding-bottom:6px">. . .</td></tr>';
                        msg += extremalRows.slice(extLen - extLimit, extLen).map(row => row.getRowHtml(rawResponse, null, null, [rawPeIndex])).join('');
                        msg += '</table>';
                        msg += '<br>';

                        var summaryTitle = 'Raw data summary';
                        var summaryBtnText = 'Show all values';

                        uiManager.unmask();

                        refs.uiManager.confirmCustom(summaryTitle, msg, summaryBtnText, function() {
                            var html = '<table>' + rawResponse.getSortedRows().reduce((total, row) => total += row.getRowHtml(rawResponse, null, null, [rawPeIndex]), '') + '</table>';

                            refs.uiManager.confirmCustom('Raw data', html, null, null, {
                                height: 700,
                                autoScroll: true
                            });

                            //var win = Ext.create('Ext.window.Window', {
                                //height: 500,
                                //autoScroll: true,
                                //bodyStyle: 'background-color:#fff',
                                //html: html
                            //});

                            //win.show();
                        });
                    });
                });
            });
        });
    };

    // set listeners
    for (var i = 0, cell, el; i < cells.length; i++) {
        cell = cells[i];

        if (cell.isEmpty) {
            continue;
        }

        el = Ext.get(cell.elementId);
        el.cell = cell;
        el.row = t.getRowByCellId(cell.id);

        (function(el) {
            el.on('click', function(event) {
                valueClickHandler(el);
            });
        })(el);
    }
};

