import isNumber from 'd2-utilizr/lib/isNumber';
import isNumeric from 'd2-utilizr/lib/isNumeric';
import isArray from 'd2-utilizr/lib/isArray';
import isObject from 'd2-utilizr/lib/isObject';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayClean from 'd2-utilizr/lib/arrayClean';
import arrayContains from 'd2-utilizr/lib/arrayContains';
import arrayMax from 'd2-utilizr/lib/arrayMax';
import arrayMin from 'd2-utilizr/lib/arrayMin';
import clone from 'd2-utilizr/lib/clone';

import Record from 'd2-analysis/lib/api/Record.js';
import ResponseHeader from 'd2-analysis/lib/api/ResponseHeader.js';
import ResponseRow from 'd2-analysis/lib/api/ResponseRow.js';
import ResponseRowIdCombination from 'd2-analysis/lib/api/ResponseRowIdCombination.js';

export var Response;

Response = function(config) {
    var t = this;

    t.headers = config.headers;
    t.metaData = config.metaData;
    t.rows = config.rows;

    t.idCombinationIndex = {
        'dx': 0,
        'pe': 1,
        'ou': 2
    };

    // initialized transient properties
    t.nameHeaderMap = {};

    // uninitialized transient properties
    t.idValueMap = {};
    t.idCombinations = [];

    // header index
    (function() {
        for (var i = 0; i < t.headers.length; i++) {
            t.headers[i].index = i;
        }
    })();

    // nameHeaderMap
    (function() {
        t.nameHeaderMap = {};

        for (var i = 0; i < t.headers.length; i++) {
            t.nameHeaderMap[t.headers[i].name] = t.headers[i];
        }
    })();
};

Response.prototype.getHeaderByName = function(name) {
    return this.nameHeaderMap[name];
};

Response.prototype.getHeaderIndexByName = function(name) {
    return this.nameHeaderMap[name].index;
};

Response.prototype.getIdByIdComb = function(idComb, dataType) {
    return idComb.split('-')[this.idCombinationIndex[dataType]];
};

Response.prototype.getNameByIdComb = function(idComb, dataType) {
    return this.getNameById(this.getIdByIdComb(idComb, dataType));
};

Response.prototype.getLevelById = function(ouId) {
    return arrayClean((this.metaData.ouHierarchy[ouId] || '').split('/') || []).length + 1;
};

Response.prototype.getMaxLevel = function() {
    var ouh = this.metaData.ouHierarchy,
        anLevels = [];

    for (var i in ouh) {
        if (ouh.hasOwnProperty(i)) {
            anLevels.push(this.getLevelById(i));
        }
    }

    return arrayMax(anLevels);
};

Response.prototype.getMinLevel = function() {
    var ouh = this.metaData.ouHierarchy,
        anLevels = [];

    for (var i in ouh) {
        if (ouh.hasOwnProperty(i)) {
            anLevels.push(this.getLevelById(i));
        }
    }

    return arrayMin(anLevels);
};

Response.prototype.getUniqueNumericItemsInArray = function(array) {
    var a = [];

    if (!isArray(array)) {
        return 0;
    }

    for (var i = 0; i < array.length; i++) {
        if (isNumeric(array[i])) {
            a.push(array[i]);
        }
    }

    return arrayUnique(a);
};

Response.prototype.getParentNameByIdAndLevel = function(ouId, level) {
    var parentGraphIdArray = this.getParentGraphIdArray(ouId),
        nLevel = level.level;

    return this.getNameById(parentGraphIdArray[nLevel - 1]);
};

Response.prototype.getParentNameByIdCombAndLevel = function(idComb, level) {
    var ouId = idComb.split('-')[this.idCombinationIndex['ou']];

    return this.getParentNameByIdAndLevel(ouId, level);
};

Response.prototype.getParentGraphIdArray = function(ouId, level) {
    var ids = arrayClean((this.metaData.ouHierarchy[ouId] || '').split('/') || []);

    if (isNumber(level) && level > 0) {
        ids = ids.slice(level - 1);
    }

    return ids;
};

Response.prototype.getParentGraphNameArray = function(ouId, level) {
    var parentGraphIdArray = this.getParentGraphIdArray(ouId),
        parentGraphNameArray = [],
        i = (isNumber(level) && level > 0) ? (level - 1) : 0;

    for (; i < parentGraphIdArray.length; i++) {
        parentGraphNameArray[i] = this.getNameById(parentGraphIdArray[i]);
    }

    return parentGraphNameArray;
};

Response.prototype.getPeGroupNameByPeId = function(peId) {
    var peName = this.getNameById(peId),
        a = peName.split(' '),
        uniqueNumerics = this.getUniqueNumericItemsInArray(a),
        monthMap = {
            'Apr': 'April',
            'Jul': 'July',
            'Oct': 'October'
        };

    if (a.length === 1) {
        return a[0].slice(0,4);
    }

    return (uniqueNumerics.length === 1) ? uniqueNumerics[0] : ('Financial ' + monthMap[a[0]]);
};

Response.prototype.getPeTypeByPeId = function(peId) {
    if (!isNumeric(peId.slice(0, 4))) {
        return;
    }

    if (peId.length === 4) {
        return 'Yearly';
    }
    else if (peId.length === 6) {
        if (isNumeric(peId)) {
            return 'Monthly';
        }
        else if (peId.indexOf('W') !== -1) {
            return 'Weekly';
        }
        else if (peId.indexOf('Q') !== -1) {
            return 'Quarterly';
        }
        else if (peId.indexOf('S') !== -1) {
            return 'SixMonthly';
        }
    }
    else if (peId.length === 7) {
        if (peId.indexOf('B') !== -1) {
            return 'BiMonthly';
        }
        else if (peId.indexOf('Oct') !== -1) {
            return 'FinancialOct';
        }
    }
    else if (peId.length === 8) {
        if (isNumeric(peId.slice(4, 8))) {
            return 'Daily';
        }
        else if (peId.indexOf('July') !== -1) {
            return 'FinancialJuly';
        }
    }
    else if (peId.length === 9) {
        if (peId.indexOf('April') !== -1) {
            return 'FinancialApril';
        }
    }
    else if (peId.length === 11) {
        if (peId.indexOf('AprilS') !== -1) {
            return 'SixMonthlyApril';
        }
    }
    else {
        return;
    }
};

Response.prototype.generateIdValueMap = function() {
    var dxIndex = this.getHeaderIndexByName('dx'),
        peIndex = this.getHeaderIndexByName('pe'),
        ouIndex = this.getHeaderIndexByName('ou'),
        valueIndex = this.getHeaderIndexByName('value');

    for (var i = 0, row, key; i < this.rows.length; i++) {
        row = this.rows[i];
        key = row[dxIndex] + '-' + row[peIndex] + '-' + row[ouIndex];

        this.idValueMap[key] = row[valueIndex];
    }

    return this.idValueMap;
};

Response.prototype.getValueByIdComb = function(idComb) {
    return this.idValueMap[idComb];
};

Response.prototype.getValueByIdParams = function(dxId, peId, ouId) {
    return this.idValueMap[dxId + '-' + peId + '-' + ouId];
};

Response.prototype.getValueByDxIdAndIdComb = function(dxId, idComb) {
    var pe = this.getIdByIdComb(idComb, 'pe');
    var ou = this.getIdByIdComb(idComb, 'ou');

    return this.getValueByIdComb(dxId + '-' + this.getIdByIdComb(idComb, 'pe') + '-' + this.getIdByIdComb(idComb, 'ou'));
};

Response.prototype.generateIdCombinations = function(aDxResIds, aPeResIds, aOuResIds) {
    for (var i = 0, dx, a; i < aDxResIds.length; i++) {
        a = [];
        dx = aDxResIds[i];

        for (var j = 0, pe; j < aPeResIds.length; j++) {
            pe = aPeResIds[j];

            for (var k = 0, ou; k < aOuResIds.length; k++) {
                ou = aOuResIds[k];

                a[this.idCombinationIndex['dx']] = dx;
                a[this.idCombinationIndex['pe']] = pe;
                a[this.idCombinationIndex['ou']] = ou;

                this.idCombinations.push(a.join('-'));
            }
        }
    }

    return this.idCombinations;
};

Response.prototype.getNumeratorTotal = function(idComb, dataObject) {
    var d = dataObject;

    if (d.isIndicator) {
        var numeratorIds = d.getNumeratorIds(),
            strippedNumerator = clone(d.getStrippedNumerator()),
            value;

        for (var k = 0, id, value; k < numeratorIds.length; k++) {
            id = numeratorIds[k];
            value = this.getValueByDxIdAndIdComb(id, idComb);

            strippedNumerator = strippedNumerator.replace(id, value);
        }

        value = eval(strippedNumerator);
        value = isNumeric(value) ? value : undefined;

        return value;
    }
    else if (d.isDataElement) {
        return this.getValueByIdComb(idComb);
    }
};

Response.prototype.getDenominatorTotal = function(idComb, dataObject) {
    var d = dataObject;

    if (d.isIndicator) {
        var denominatorIds = d.getDenominatorIds(),
            strippedDenominator = clone(d.getStrippedDenominator()),
            value;

        for (var k = 0, id, value; k < denominatorIds.length; k++) {
            id = denominatorIds[k];
            value = this.getValueByDxIdAndIdComb(id, idComb);

            strippedDenominator = strippedDenominator.replace(id, value);
        }

        value = eval(strippedDenominator);
        value = isNumeric(value) ? value : undefined;

        return value;
    }
    else if (d.isDataElement) {
        return 1;
    }
};

Response.prototype.isHideRow = function(dataObject, layout, numeratorTotal, denominatorTotal) {
    if (layout.hideEmptyRows) {
        if (dataObject.isIndicator && !numeratorTotal && !denominatorTotal) {
            return true;
        }

        if (dataObject.isDataElement && !numeratorTotal) {
            return true;
        }
    }

    return false;
};

// dep 2

Response.prototype.getNameById = function(id, addYearToName) {
    var name = this.metaData.names[id];

    if (addYearToName && arrayContains(['Daily', 'Weekly', 'Monthly'], this.getPeTypeByPeId(id))) {
        name += (' ' + id.slice(0, 4));
    }

    return name;
};
