export var DataObject;

DataObject = function(config, dataType) {
    var t = this;

    var indicator = {
        id: 'indicator',
        objectName: 'in',
        name: 'Indicator',
        sortId: 1,
        isIndicator: true
    },
    dataElement = {
        id: 'dataElement',
        objectName: 'de',
        name: 'Data element',
        sortId: 2,
        isDataElement: true
    },
    map = {
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

    t.defaultBgColor = '#fff';
    t.defaultLegendSet = {
        name: 'Default percentage legend set',
        legends: [
            {name: 'Bad', startValue: 0, endValue: 50, color: '#ff0000'},
            {name: 'Medium', startValue: 50, endValue: 80, color: '#ffff00'},
            {name: 'Good', startValue: 80, endValue: 100, color: '#00bf00'},
            {name: 'Too high', startValue: 100, endValue: 1000000000, color: '#f5f5f5'}
        ]
    };

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

// dynamic

DataObject.prototype.getBgColorByValue = function(value) {
    var set = this.legendSet || (this.isIndicator ? this.defaultLegendSet : null);

    if (!set) {
        return this.defaultBgColor;
    }

    for (var i = 0, legend; i < set.legends.length; i++) {
        legend = set.legends[i];

        if (value > legend.startValue && value <= legend.endValue) {
            return legend.color;
        }
    }

    return this.defaultBgColor;
};
