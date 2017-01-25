import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import isObject from 'd2-utilizr/lib/isObject';

export var DataObject;

DataObject = function(config, dataType) {
    var t = this;

    var indicator = {
        id: 'indicator',
        objectName: 'in',
        name: 'Indicator',
        sortId: 1,
        isIndicator: true
    };

    var dataElement = {
        id: 'dataElement',
        objectName: 'de',
        name: 'Data element',
        sortId: 2,
        isDataElement: true
    };

    var map = {
        'indicator': indicator,
        'dataElement': dataElement
    };

    // constructor
    t.dataType = dataType;
    t.id = config.id;
    t.name = config.name || '';
    t.displayName = config.displayName || '';
    t.displayShortName = config.displayShortName || '';
    t.groups = config.indicatorGroups || config.dataElementGroups || [];

    t.numerator = config.numerator;
    t.numeratorDescription = config.numeratorDescription;
    t.denominator = config.denominator;
    t.denominatorDescription = config.denominatorDescription;
    t.description = config.description || '';
    t.annualized = config.annualized;

    t.type = config.indicatorType ? config.indicatorType.name : (config.aggregationType ? config.aggregationType : '');

    t.legendSet = config.legendSet || null;

    // transient
    t.objectName = map[dataType].objectName;
    t.dataTypeDisplayName = map[dataType].name;
    t.dataTypeSortId = map[dataType].sortId;
    t.isIndicator = !!map[dataType].isIndicator;
    t.isDataElement = !!map[dataType].isDataElement;

    t.group = t.groups[0] || {};
    t.groupName = t.group.name || '';

    t.typeName = t.type + (config.annualized ? ' (annualized)' : '');

    t.defaultBgColor = '#ffffff';
    t.defaultName = '';

    // uninitialized
    t.strippedNumerator;
    t.strippedDenominator;

    t.numeratorIds;
    t.denominatorIds;

    // support
    t.stripFormula = function(formula) {
        return (formula || '').replace(/#/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\(|\)/g, "");
    };

    t.getIdsFromFormula = function(formula) {
        var s = (formula || '').replace(/#/g, '').replace(/\(|\)/g, ""),
            a1 = s.split('{'),
            a2 = [],
            ids = [],
            regexp = /^[a-z0-9]+$/i;

        for (var i = 0, item; i < a1.length; i++) {
            item = a1[i];

            a2 = a2.concat(item.split('}'));
        }

        for (var j = 0, item; j < a2.length; j++) {
            item = a2[j];

            if ((item.length === 11 && regexp.test(item)) || (item.length === 23 && item.indexOf('.') !== -1 && regexp.test(item.replace('.', '')))) {
                ids.push(item);
            }
        }

        return ids;
    }
};

// base

DataObject.prototype.getStrippedNumerator = function() {
    if (this.strippedNumerator) {
        return this.strippedNumerator;
    }

    return this.strippedNumerator = this.stripFormula(this.numerator);
};

DataObject.prototype.getStrippedDenominator = function() {
    if (this.strippedDenominator) {
        return this.strippedDenominator;
    }

    return this.strippedDenominator = this.stripFormula(this.denominator);
};

DataObject.prototype.getNumeratorIds = function() {
    if (this.numeratorIds) {
        return this.numeratorIds;
    }

    return this.numeratorIds = this.getIdsFromFormula(this.numerator);
};

DataObject.prototype.getDenominatorIds = function() {
    if (this.denominatorIds) {
        return this.denominatorIds;
    }

    return this.denominatorIds = this.getIdsFromFormula(this.denominator);
};

DataObject.prototype.getLegendSet = function() {
    return this.legendSet;
};

// dep 1

DataObject.prototype.getLegendByValue = function(value) {
    if (!this.getLegendSet()) {
        return;
    }

    return this.getLegendSet().legends.filter(legend => (legend.startValue < value && legend.endValue >= value))[0];
};

DataObject.prototype.getIds = function() {
    return this.isIndicator ? [].concat(this.getNumeratorIds(), this.getDenominatorIds()) : this.isDataElement ? arrayFrom(this.id) : null;
};

// dep 2

DataObject.prototype.getLegendColorByValue = function(value) {
    return (this.getLegendByValue(value) || {}).color || this.defaultBgColor;
};

DataObject.prototype.getLegendNameByValue = function(value) {
    return (this.getLegendByValue(value) || {}).name || this.defaultName;
};
