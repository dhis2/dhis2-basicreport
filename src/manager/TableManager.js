import isNumeric from 'd2-utilizr/lib/isNumeric';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import arrayTo from 'd2-utilizr/lib/arrayTo';
import arraySort from 'd2-utilizr/lib/arraySort';

import {DataObject} from '../api/DataObject';
import {Response} from '../api/Response';
import {TableHeader} from '../api/TableHeader';
import {TableRow} from '../api/TableRow';
import {TableCell} from '../api/TableCell';
import {OrganisationUnitTableCell} from '../api/TableCell.OrganisationUnit';
import {PeriodTableCell} from '../api/TableCell.Period';
import {Table} from '../api/Table';
import {Period} from '../api/Period';
import {OrganisationUnit} from '../api/OrganisationUnit';
import {OrganisationUnitLevel} from '../api/OrganisationUnitLevel';

export var TableManager;

TableManager = function(c) {
    var t = this;

    t.appManager = c.appManager;
    t.uiManager = c.uiManager;
    t.dimensionConfig = c.dimensionConfig;

    // config
    t.excludeReduceKeys = [
        'dx-numerator',
        'dx-denominator',
        'dx-value'
    ];

    // transient
    t.loadMask;

    t.mask = function(elId) {
        var el = Ext.get(elId) || t.uiManager.getUpdateComponent();

        var tableEl = el.child('table');

        if (elId && !tableEl) {
            return;
        }

        t.loadMask = new Ext.create('Ext.LoadMask', (tableEl || el), {
            shadow: false,
            msg: 'Loading..',
            style: 'box-shadow:0',
            bodyStyle: 'box-shadow:0'
        });

        t.loadMask.show();
    };

    t.unmask = function(el) {
        t.loadMask && t.loadMask.hide();
        t.loadMask = null;
    };
};

TableManager.prototype.applyTo = function(modules) {
    var t = this;

    arrayTo(modules).forEach(function(module) {
        module.tableManager = t;
    });
};

TableManager.prototype.getTable = function(layout, fCallback) {
    var t = this;

    var path = t.appManager.getPath();

    var data,
        aInReqIds = [],
        aInReqItems = [],
        aDeReqIds = [],
        aDeReqItems = [],
        aDsReqIds = [],
        aDsReqItems = [],
        aDxReqIds = [],
        aPeReqIds = [],
        aOuReqIds = [],
        oDimNameReqItemArrayMap = {},
        sInName = 'indicator',
        sDeName = 'dataElement',
        sDsName = 'dataSet';

    var peDimName = t.dimensionConfig.get('period').dimensionName,
        ouDimName = t.dimensionConfig.get('organisationUnit').dimensionName;

    oDimNameReqItemArrayMap[peDimName] = aPeReqIds;
    oDimNameReqItemArrayMap[ouDimName] = aOuReqIds;

    // columns (data)
    (function() {
        var ddi = layout.getDataDimensionItems(),
            dimMap = {};

        dimMap[sInName] = aInReqIds;
        dimMap[sDeName] = aDeReqIds;
        dimMap[sDsName] = aDsReqIds;

        // add objects to corresponding array
        if (isArray(ddi) && ddi.length) {
            for (var i = 0, obj; i < ddi.length; i++) {
                obj = ddi[i];

                for (var j = 0, names = [sInName, sDeName, sDsName]; j < names.length; j++) {
                    name = names[j];

                    if (obj.hasOwnProperty(name) && isObject(obj[name])) {
                        dimMap[name].push(obj[name].id);
                    }
                }
            }
        }
    })();

    // rows
    if (isArray(layout.rows)) {
        for (var i = 0, dim; i < layout.rows.length; i++) {
            dim = layout.rows[i];

            for (var j = 0, item; j < dim.items.length; j++) {
                item = dim.items[j];

                oDimNameReqItemArrayMap[dim.dimension].push(item.id);
            }
        }
    }

    // meta data
    var nRank = 1,
        nOuHierarchyOffSet = 0,
        aDxName = [],
        aDxShort = [],
        aNumFormula = [],
        aNumFormulaItems = [],
        aNumDescription = [],
        aDenomFormula = [],
        aDenomFormulaItems = [],
        aDenomDescription = [],
        aTypeName = [],
        aDxGroupName = [],
        aDxIsIndicator = [],
        aDxLegendSet = [],
        nLgIncr = 0,
        sDxUniqueId = '',
        sLookupSubElements = '',
        sNums = '',
        sDenoms = '',
        getIndicators,
        getDataElements,
        getDataSets,
        getData,
        getTable,
        idDataObjectMap = {};

    getIndicators = function() {
        if (!aInReqIds.length) {
            getDataElements();
            return;
        }

        $.getJSON(encodeURI(path + '/api/indicators.json?paging=false&filter=id:in:[' + aInReqIds.join(',') + ']&fields=id,name,displayName,displayShortName,description,indicatorType[id,displayName|rename(name)],annualized,indicatorGroups[id,displayName|rename(name)],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[id,displayName|rename(name),legends[id,displayName|rename(name),startValue,endValue,color]]'), function(r) {
            if (r.indicators) {
                for (var i = 0, obj; i < r.indicators.length; i++) {
                    obj = new DataObject(r.indicators[i], sInName);

                    idDataObjectMap[obj.id] = obj;
                    aInReqItems.push(obj);
                }
            }

            getDataElements();
        });
    };

    getDataElements = function() {
        if (!aDeReqIds.length) {
            //getDataSets();
            getData();
            return;
        }

        $.getJSON(encodeURI(path + '/api/dataElements.json?paging=false&filter=id:in:[' + aDeReqIds.join(',') + ']&fields=id,name,displayName,displayShortName,description,aggregationType,dataElementGroups[id,displayName|rename(name)],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[id,displayName|rename(name),legends[id,displayName|rename(name),startValue,endValue,color]]'), function(r) {
            if (r.dataElements) {
                for (var i = 0, obj; i < r.dataElements.length; i++) {
                    obj = new DataObject(r.dataElements[i], sDeName);

                    idDataObjectMap[obj.id] = obj;
                    aDeReqItems.push(obj);
                }
            }

            getData();
        });
    };

    getDataSets = function() {
        if (!aDsReqIds.length) {
            getData();
            return;
        }

        $.getJSON(encodeURI(path + '/api/dataSets.json?paging=false&filter=id:in:[' + aDsReqIds.join(',') + ']&fields=id,name,displayName,displayShortName,valueType,dataSetGroups[id,displayName|rename(name)],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[id,displayName|rename(name),legends[id,displayName|rename(name),startValue,endValue,color]]'), function(r) {
            aDsReqItems = r.dataSets;
            support.prototype.array.addObjectProperty(aDsReqItems, 'type', sDsName);
            getData();
        });
    };

    getData = function() {
        var aDxReqItems = [].concat(aInReqItems || [], aDeReqItems || [], aDsReqItems || []);
        aDxReqIds = [].concat(aInReqIds || [], aDeReqIds || [], aDsReqIds || []);

        for (var i = 0, oDxItem; i < aDxReqItems.length; i++) {
            oDxItem = aDxReqItems[i];
            sDxUniqueId += (oDxItem.id + ';');
            aDxIsIndicator[i] = oDxItem.isIndicator ? 1 : 0;
            aDxName[i] = oDxItem.displayName;
            aDxShort[i] = oDxItem.displayShortName;
            aNumFormula[i] = oDxItem.numerator;
            aNumDescription[i] = oDxItem.numeratorDescription;
            aDenomFormula[i] = oDxItem.denominator;
            aDenomDescription[i] = oDxItem.denominatorDescription;
            aTypeName[i] = oDxItem.indicatorType ? oDxItem.indicatorType.name : ''; //todo
            aDxGroupName[i] = (oDxItem.indicatorGroups && oDxItem.indicatorGroups.length) ? oDxItem.indicatorGroups[0].name : ''; //todo
            aDxLegendSet[i] = [];

            if (oDxItem.legendSet) {
                for (var p = 0; p < oDxItem.legendSet.legends.length; p++) {
                    var sLegendSet = (oDxItem.legendSet.legends[p].name + ';' + oDxItem.legendSet.legends[p].color + ';' + oDxItem.legendSet.legends[p].startValue + ';' + oDxItem.legendSet.legends[p].endValue);
                    aDxLegendSet[i][nLgIncr] = sLegendSet;
                    nLgIncr += 1;
                }
            }

            if (aNumFormula[i]) {
                var sNumItems = '';
                if (aNumFormula[i].indexOf('{') != 0) {
                    var aNumTmpOuter = aNumFormula[i].split('{');
                    for (var p = 1; p < aNumTmpOuter.length; p++)
                    {
                        var aNumTmpInner = aNumTmpOuter[p].split('}');
                        // if current UID not already listed in 'known lookup uids'
                        if (sLookupSubElements.indexOf(aNumTmpInner[0] + ';') < 0) {
                            sLookupSubElements += (aNumTmpInner[0]+';');
                            sNumItems += (aNumTmpInner[0]+';');
                        }
                    }
                }
                aNumFormulaItems[i] = sNumItems;
            }

            if (aDenomFormula[i]) {
                var sDenomItems = '';
                if (aDenomFormula[i].indexOf('{') != 0){
                    var aDenomTmpOuter = aDenomFormula[i].split('{');
                    for (var p = 1; p < aDenomTmpOuter.length; p++) {
                        var aDenomTmpInner = aDenomTmpOuter[p].split('}');
                        // if current UID not already listed in 'known lookup uids'
                        sDenomItems += (aDenomTmpInner[0] + ';');
                        if (sLookupSubElements.indexOf(aDenomTmpInner[0] + ';') < 0) {
                            sLookupSubElements += (aDenomTmpInner[0] + ';');
                        }
                    }
                }
                aDenomFormulaItems[i] = sDenomItems;
            }
        }

        // analytics

        $.getJSON(encodeURI(path + '/api/analytics.json?dimension=pe:' + aPeReqIds.join(';') + '&dimension=dx:' + sLookupSubElements + aDxReqIds.join(';') + '&dimension=ou:' + aOuReqIds.join(';') + '&hierarchyMeta=true&displayProperty=NAME&showHierarchy=true'), function(r) {
            getTable(r);
        });
    };

    getTable = function(analyticsData) {
        var response = new Response(analyticsData),
            aDxResIds = aDxReqIds,
            aPeResIds = response.metaData.pe,
            aOuResIds = response.metaData.ou,
            idCombinations = response.generateIdCombinations(aDxResIds, aPeResIds, aOuResIds),
            tableHeaders = [],
            tableRows = [],
            maxOuLevel = response.getMaxLevel(),
            minOuLevel = response.getMinLevel(),
            startOuLevel = layout.showHierarchy ? (maxOuLevel > 1 ? 1 : 0) : minOuLevel - 1;

        response.generateIdValueMap();

        // table headers

        (function() {
            var index = 0;

            // ou headers
            (function() {
                for (var level; startOuLevel < maxOuLevel; startOuLevel++) {
                    level = new OrganisationUnitLevel(t.appManager.organisationUnitLevels[startOuLevel]);
                    level.objectName = 'ou';
                    level.cls = 'pivot-dim';
                    level.index = index++;

                    tableHeaders.push(new TableHeader(level));
                }
            })();

            // pe headers
            tableHeaders.push(new TableHeader({
                id: 'pe-type',
                name: 'Period type',
                objectName: 'pe',
                cls: 'pivot-dim',
                index: index++
            }));

            tableHeaders.push(new TableHeader({
                id: 'pe-year',
                name: 'Year',
                objectName: 'pe',
                cls: 'pivot-dim',
                index: index++
            }));

            tableHeaders.push(new TableHeader({
                id: 'pe',
                name: 'Period',
                objectName: 'pe',
                cls: 'pivot-dim',
                index: index++
            }));

            // dx headers
            tableHeaders.push(new TableHeader({
                id: 'dx-group',
                name: 'Data group',
                objectName: 'dx',
                cls: 'pivot-dim',
                index: index++
            }));

            tableHeaders.push(new TableHeader({
                id: 'dx',
                name: 'Data',
                objectName: 'dx',
                cls: 'pivot-dim',
                index: index++
            }));

            if (layout.showDataDescription) {
                tableHeaders.push(new TableHeader({
                    id: 'dx-datatype',
                    name: 'Data type',
                    objectName: 'dx',
                    cls: 'pivot-dim',
                    index: index++
                }));
            }

            tableHeaders.push(new TableHeader({
                id: 'dx-type',
                name: 'Type',
                objectName: 'dx',
                cls: 'pivot-dim',
                index: index++
            }));

            if (layout.showDataDescription) {
                tableHeaders.push(new TableHeader({
                    id: 'dx-description',
                    name: 'Description',
                    objectName: 'dx',
                    cls: 'pivot-dim',
                    index: index++
                }));
            }

            tableHeaders.push(new TableHeader({
                id: 'dx-numerator',
                name: 'Numerator',
                objectName: 'dx',
                cls: 'pivot-dim',
                index: index++
            }));

            tableHeaders.push(new TableHeader({
                id: 'dx-denominator',
                name: 'Denominator',
                objectName: 'dx',
                cls: 'pivot-dim',
                index: index++
            }));

            tableHeaders.push(new TableHeader({
                id: 'dx-value',
                name: 'Value',
                objectName: 'dx',
                cls: 'pivot-dim',
                index: index++
            }));
        })();

        // table rows

        (function() {

            arraySort(tableHeaders, 'ASC', 'index');

            for (var i = 0, idComb, dxId, peId, ouId, row, dataObject, allOuSortId, numeratorTotal, denominatorTotal, period, orgUnit, value; i < idCombinations.length; i++) {
                idComb = idCombinations[i];
                dxId = response.getIdByIdComb(idComb, 'dx');
                peId = response.getIdByIdComb(idComb, 'pe');
                ouId = response.getIdByIdComb(idComb, 'ou');

                // data object
                dataObject = idDataObjectMap[dxId];
                numeratorTotal = response.getNumeratorTotal(idComb, dataObject);
                denominatorTotal = response.getDenominatorTotal(idComb, dataObject);

                if (response.isHideRow(dataObject, layout, numeratorTotal, denominatorTotal)) {
                    continue;
                }

                // period
                period = new Period({
                    id: peId,
                    name: response.getNameById(peId)
                });

                period.generateDisplayProperties();

                // organisation unit
                orgUnit = new OrganisationUnit({
                    id: ouId,
                    name: response.getNameById(ouId),
                    level: response.getLevelById(ouId),
                    metaData: response.metaData
                });

                allOuSortId = orgUnit.getParentNameByLevel(startOuLevel);

                // value
                value = response.getValueByIdComb(idComb);

                // row
                row = new TableRow({
                    dataObject: dataObject,
                    period: period,
                    organisationUnit: orgUnit
                });

                // create rows
                for (var j = 0, th, ouSortId; j < tableHeaders.length; j++) {
                    th = tableHeaders[j];
                    ouSortId = orgUnit.getSortIdByLevel(th.level);

                    // ou
                    if (th.objectName === 'ou') {
                        row.addCell(th.id, new OrganisationUnitTableCell(th.level > orgUnit.level ? {
                            isEmpty: true
                        } : {
                            name: orgUnit.getParentNameByLevel(th.level),
                            sortId: ouSortId + period.typeSortId + period.sortId + dataObject.groupName + dataObject.name,
                            cls: 'pivot-value clickable',
                            level: th.level,
                            organisationUnit: orgUnit
                        }));
                    }

                    // pe
                    else if (th.objectName === 'pe') {
                        if (th.id === 'pe-type') {
                            row.addCell(th.id, new TableCell({
                                name: period.typeName,
                                sortId: period.typeSortId + period.sortId + dataObject.groupName + dataObject.name + allOuSortId,
                                cls: 'pivot-value td-nobreak'
                            }));
                        }

                        if (th.id === 'pe-year') {
                            row.addCell(th.id, new TableCell({
                                name: period.year,
                                sortId: period.year + period.typeSortId + period.sortId + dataObject.groupName + dataObject.name + allOuSortId,
                                cls: 'pivot-value'
                            }));
                        }

                        else if (th.id === 'pe') {
                            row.addCell(th.id, new PeriodTableCell({
                                name: period.displayName,
                                sortId: period.typeSortId + period.sortId + dataObject.groupName + dataObject.name + allOuSortId,
                                cls: 'pivot-value clickable',
                                period: period
                            }));
                        }
                    }

                    // dx
                    else if (th.objectName === 'dx') {

                        if (th.id === 'dx-group') {
                            row.addCell(th.id, new TableCell({
                                name: dataObject.groupName,
                                sortId: dataObject.groupName + dataObject.name + allOuSortId + period.typeSortId + period.sortId,
                                cls: 'pivot-value'
                            }));
                        }
                        else if (th.id === 'dx') {
                            row.addCell(th.id, new TableCell({
                                name: dataObject.name,
                                sortId: dataObject.name + allOuSortId + period.typeSortId + period.sortId,
                                cls: 'pivot-value'
                            }));
                        }
                        else if (th.id === 'dx-datatype') {
                            row.addCell(th.id, new TableCell({
                                name: dataObject.dataTypeDisplayName,
                                sortId: dataObject.dataTypeSortId + dataObject.groupName + dataObject.name + allOuSortId + period.typeSortId + period.sortId,
                                cls: 'pivot-value'
                            }));
                        }
                        else if (th.id === 'dx-type') {
                            row.addCell(th.id, new TableCell({
                                name: dataObject.typeName,
                                sortId: dataObject.typeName + dataObject.groupName + dataObject.name + allOuSortId + period.typeSortId + period.sortId,
                                cls: 'pivot-value' + (dataObject.type.length === 1 ? ' td-nobreak' : '')
                            }));
                        }
                        else if (th.id === 'dx-description') {
                            row.addCell(th.id, new TableCell({
                                name: dataObject.description,
                                sortId: dataObject.description + dataObject.groupName + dataObject.name + allOuSortId + period.typeSortId + period.sortId,
                                cls: 'pivot-value'
                            }));
                        }
                        else if (th.id === 'dx-numerator') {
                            row.addCell(th.id, new TableCell({
                                name: isNumeric(numeratorTotal) ? parseFloat(numeratorTotal) : '',
                                sortId: isNumeric(numeratorTotal) ? parseFloat(numeratorTotal) : 0,
                                cls: 'pivot-value align-right'
                            }));
                        }
                        else if (th.id === 'dx-denominator') {
                            row.addCell(th.id, new TableCell({
                                name: denominatorTotal || '',
                                sortId: denominatorTotal || 0,
                                cls: 'pivot-value align-right' + (dataObject.isDataElement ? ' dataelementdenom' : '')
                            }));
                        }
                        else if (th.id === 'dx-value') {
                            row.addCell(th.id, new TableCell({
                                name: value || '',
                                sortId: parseFloat(value) || 0,
                                cls: 'pivot-value align-right',
                                style: 'background-color:' + dataObject.getBgColorByValue(parseFloat(value))
                            }));
                        }
                    }
                }

                tableRows.push(row);
            }
        })();

        var table = new Table({
            tableHeaders: tableHeaders,
            tableRows: tableRows,
            sorting: layout.sorting
        });

        table.addOptionsCls(layout);

        table.sortData();

        if (layout.reduceLayout) {
            table.reduce();
        }

        if (fCallback) {
            fCallback(table);
        }
    };

    getIndicators();
};

TableManager.prototype.getContextMenu = function(config) {
    config = config || {};

    config.shadow = false;
    config.showSeparator = false;
    config.baseCls = 'ns-floatmenu';

    return Ext.create('Ext.menu.Menu', config);
};
