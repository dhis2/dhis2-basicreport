Ext.onReady( function() {

	// ext config
	Ext.Ajax.method = 'GET';

    Ext.isIE = (/trident/.test(Ext.userAgent));

    Ext.isIE11 = Ext.isIE && (/rv:11.0/.test(Ext.userAgent));

    Ext.util.CSS.createStyleSheet = function(cssText, id) {
        var ss,
            head = document.getElementsByTagName("head")[0],
            styleEl = document.createElement("style");

        styleEl.setAttribute("type", "text/css");

        if (id) {
           styleEl.setAttribute("id", id);
        }

        if (Ext.isIE && !Ext.isIE11) {
           head.appendChild(styleEl);
           ss = styleEl.styleSheet;
           ss.cssText = cssText;
        }
        else {
            try {
                styleEl.appendChild(document.createTextNode(cssText));
            }
            catch(e) {
               styleEl.cssText = cssText;
            }
            head.appendChild(styleEl);
            ss = styleEl.styleSheet ? styleEl.styleSheet : (styleEl.sheet || document.styleSheets[document.styleSheets.length-1]);
        }
        this.cacheStyleSheet(ss);
        return ss;
    };

	// namespace
	BR = {};
	var NS = BR;

	NS.instances = [];
	NS.i18n = {};
	NS.isDebug = false;
	NS.isSessionStorage = ('sessionStorage' in window && window['sessionStorage'] !== null);

	NS.getCore = function(init, appConfig) {
        var conf = {},
            api = {},
            support = {},
            service = {},
            web = {},
            app = {},
            webAlert,
            dimConf;

        appConfig = appConfig || {};

        // alert
        webAlert = function() {};

        // app
        app.getViewportWidth = function() {};
        app.getViewportHeight = function() {};
        app.getCenterRegionWidth = function() {};
        app.getCenterRegionHeight = function() {};

		// conf
		(function() {
			conf.finals = {
				dimension: {
					data: {
						value: 'data',
						name: NS.i18n.data || 'Data',
						dimensionName: 'dx',
						objectName: 'dx'
					},
					category: {
						name: NS.i18n.assigned_categories || 'Assigned categories',
						dimensionName: 'co',
						objectName: 'co',
					},
					indicator: {
						value: 'indicator',
						name: NS.i18n.indicators || 'Indicators',
						dimensionName: 'dx',
						objectName: 'in'
					},
					dataElement: {
						value: 'dataElement',
						name: NS.i18n.data_elements || 'Data elements',
						dimensionName: 'dx',
						objectName: 'de'
					},
					operand: {
						value: 'operand',
						name: 'Operand',
						dimensionName: 'dx',
						objectName: 'dc'
					},
					dataSet: {
						value: 'dataSet',
						name: NS.i18n.data_sets || 'Data sets',
						dimensionName: 'dx',
						objectName: 'ds'
					},
					eventDataItem: {
						value: 'eventDataItem',
						name: NS.i18n.event_data_items || 'Event data items',
						dimensionName: 'dx',
						objectName: 'di'
					},
					programIndicator: {
						value: 'programIndicator',
						name: NS.i18n.program_indicators || 'Program indicators',
						dimensionName: 'dx',
						objectName: 'pi'
					},
					period: {
						value: 'period',
						name: NS.i18n.periods || 'Periods',
						dimensionName: 'pe',
						objectName: 'pe'
					},
					fixedPeriod: {
						value: 'periods'
					},
					relativePeriod: {
						value: 'relativePeriods'
					},
					organisationUnit: {
						value: 'organisationUnits',
						name: NS.i18n.organisation_units || 'Organisation units',
						dimensionName: 'ou',
						objectName: 'ou'
					},
					dimension: {
						value: 'dimension'
						//objectName: 'di'
					},
					value: {
						value: 'value'
					}
				},
				root: {
					id: 'root'
				}
			};

			dimConf = conf.finals.dimension;

			dimConf.objectNameMap = {};
			dimConf.objectNameMap[dimConf.data.objectName] = dimConf.data;
			dimConf.objectNameMap[dimConf.indicator.objectName] = dimConf.indicator;
			dimConf.objectNameMap[dimConf.dataElement.objectName] = dimConf.dataElement;
			dimConf.objectNameMap[dimConf.operand.objectName] = dimConf.operand;
			dimConf.objectNameMap[dimConf.dataSet.objectName] = dimConf.dataSet;
			dimConf.objectNameMap[dimConf.category.objectName] = dimConf.category;
			dimConf.objectNameMap[dimConf.period.objectName] = dimConf.period;
			dimConf.objectNameMap[dimConf.organisationUnit.objectName] = dimConf.organisationUnit;
			dimConf.objectNameMap[dimConf.dimension.objectName] = dimConf.dimension;

			conf.period = {
				periodTypes: [
					{id: 'Daily', name: NS.i18n.daily},
					{id: 'Weekly', name: NS.i18n.weekly},
					{id: 'Monthly', name: NS.i18n.monthly},
					{id: 'BiMonthly', name: NS.i18n.bimonthly},
					{id: 'Quarterly', name: NS.i18n.quarterly},
					{id: 'SixMonthly', name: NS.i18n.sixmonthly},
					{id: 'SixMonthlyApril', name: NS.i18n.sixmonthly_april},
					{id: 'Yearly', name: NS.i18n.yearly},
					{id: 'FinancialOct', name: NS.i18n.financial_oct},
					{id: 'FinancialJuly', name: NS.i18n.financial_july},
					{id: 'FinancialApril', name: NS.i18n.financial_april}
				],
                relativePeriods: []
			};

            conf.valueType = {
            	numericTypes: ['NUMBER','UNIT_INTERVAL','PERCENTAGE','INTEGER','INTEGER_POSITIVE','INTEGER_NEGATIVE','INTEGER_ZERO_OR_POSITIVE'],
            	textTypes: ['TEXT','LONG_TEXT','LETTER','PHONE_NUMBER','EMAIL'],
            	booleanTypes: ['BOOLEAN','TRUE_ONLY'],
            	dateTypes: ['DATE','DATETIME'],
            	aggregateTypes: ['NUMBER','UNIT_INTERVAL','PERCENTAGE','INTEGER','INTEGER_POSITIVE','INTEGER_NEGATIVE','INTEGER_ZERO_OR_POSITIVE','BOOLEAN','TRUE_ONLY']
            };

			conf.layout = {
				west_width: 424,
				west_fieldset_width: 418,
				west_width_padding: 2,
				west_fill: 2,
				west_fill_accordion_indicator: 81,
				west_fill_accordion_dataelement: 81,
				west_fill_accordion_dataset: 56,
                west_fill_accordion_eventdataitem: 81,
                west_fill_accordion_programindicator: 81,
				west_fill_accordion_period: 310,
				west_fill_accordion_organisationunit: 58,
                west_fill_accordion_group: 31,
				west_maxheight_accordion_indicator: 400,
				west_maxheight_accordion_dataelement: 400,
				west_maxheight_accordion_dataset: 400,
				west_maxheight_accordion_period: 513,
				west_maxheight_accordion_organisationunit: 900,
				west_maxheight_accordion_group: 340,
				west_maxheight_accordion_options: 449,
				//west_scrollbarheight_accordion_indicator: 300,
				west_scrollbarheight_accordion_indicator: 543,
				west_scrollbarheight_accordion_dataelement: 300,
				west_scrollbarheight_accordion_dataset: 300,
				//west_scrollbarheight_accordion_period: 450,
				west_scrollbarheight_accordion_period: 543,
				//west_scrollbarheight_accordion_organisationunit: 450,
				west_scrollbarheight_accordion_organisationunit: 543,
				west_scrollbarheight_accordion_group: 300,
				east_tbar_height: 31,
				east_gridcolumn_height: 30,
				form_label_width: 55,
				window_favorite_ypos: 100,
				window_confirm_width: 250,
				window_share_width: 500,
				grid_favorite_width: 420,
				grid_row_height: 27,
				treepanel_minheight: 135,
				treepanel_maxheight: 400,
				treepanel_fill_default: 310,
				treepanel_toolbar_menu_width_group: 140,
				treepanel_toolbar_menu_width_level: 120,
				multiselect_minheight: 100,
				multiselect_maxheight: 250,
				multiselect_fill_default: 345,
				multiselect_fill_reportingrates: 315
			};

			conf.report = {
				digitGroupSeparator: {
					'COMMA': ',',
					'SPACE': '&nbsp;'
				},
				displayDensity: {
                    'XCOMPACT': '2px',
					'COMPACT': '4px',
					'NORMAL': '6px',
					'COMFORTABLE': '8px',
                    'XCOMFORTABLE': '10px'
				},
				fontSize: {
					'XSMALL': '9px',
					'SMALL': '10px',
					'NORMAL': '11px',
					'LARGE': '12px',
					'XLARGE': '14px'
				}
			};

            conf.url = {
                analysisFields: [
                    '*',
                    'program[id,name]',
                    'programStage[id,name]',
                    'columns[dimension,filter,items[id,' + init.namePropertyUrl + ']]',
                    'rows[dimension,filter,items[id,' + init.namePropertyUrl + ']]',
                    'filters[dimension,filter,items[id,' + init.namePropertyUrl + ']]',
                    '!lastUpdated',
                    '!href',
                    '!created',
                    '!publicAccess',
                    '!rewindRelativePeriods',
                    '!userOrganisationUnit',
                    '!userOrganisationUnitChildren',
                    '!userOrganisationUnitGrandChildren',
                    '!externalAccess',
                    '!access',
                    '!relativePeriods',
                    '!columnDimensions',
                    '!rowDimensions',
                    '!filterDimensions',
                    '!user',
                    '!organisationUnitGroups',
                    '!itemOrganisationUnitGroups',
                    '!userGroupAccesses',
                    '!indicators',
                    '!dataElements',
                    '!dataElementOperands',
                    '!dataElementGroups',
                    '!dataSets',
                    '!periods',
                    '!organisationUnitLevels',
                    '!organisationUnits'
                ]
            };
		}());

		// api
		(function() {

            // layout

			api.layout = {};

			api.layout.Record = function(config) {
				var config = Ext.clone(config);

				// id: string

				return function() {
					if (!Ext.isObject(config)) {
						console.log('Record: config is not an object: ' + config);
						return;
					}

					if (!Ext.isString(config.id)) {
						console.log('api.layout.Record: id is not text: ' + config);
						return;
					}

					return config;
				}();
			};

			api.layout.Dimension = function(config) {
				var config = Ext.clone(config);

				// dimension: string

				// items: [Record]

				return function() {
					if (!Ext.isObject(config)) {
						console.log('Dimension: config is not an object: ' + config);
						return;
					}

					if (!Ext.isString(config.dimension)) {
						console.log('Dimension: name is not a string: ' + config);
						return;
					}

					if (config.dimension !== conf.finals.dimension.category.objectName) {
						var records = [];

						if (!Ext.isArray(config.items)) {
							//console.log('Dimension: items is not an array: ' + config);
							return;
						}

						for (var i = 0; i < config.items.length; i++) {
							records.push(api.layout.Record(config.items[i]));
						}

						config.items = Ext.Array.clean(records);

						if (!config.items.length) {
							//console.log('Dimension: has no valid items: ' + config);
							return;
						}
					}

					return config;
				}();
			};

			api.layout.Layout = function(config, applyConfig, forceApplyConfig) {
                config = Ext.apply(config, applyConfig);

				var layout = {},
					getValidatedDimensionArray,
					validateSpecialCases;

				// columns: [Dimension]

				// rows: [Dimension]

				// filters: [Dimension]

                // showDataDescription: boolean (false)

                // showHierarchy: boolean (false)

				// displayDensity: string ('NORMAL') - 'COMPACT', 'NORMAL', 'COMFORTABLE'

				// fontSize: string ('NORMAL') - 'SMALL', 'NORMAL', 'LARGE'

				// digitGroupSeparator: string ('SPACE') - 'NONE', 'COMMA', 'SPACE'

				// legendSet: object

				// parentGraphMap: object

				// sorting: transient object

                // userOrgUnit: string

                // relativePeriodDate: string

				getValidatedDimensionArray = function(dimensionArray) {
					var dimensionArray = Ext.clone(dimensionArray);

					if (!(dimensionArray && Ext.isArray(dimensionArray) && dimensionArray.length)) {
						return;
					}

					for (var i = 0; i < dimensionArray.length; i++) {
						dimensionArray[i] = api.layout.Dimension(dimensionArray[i]);
					}

					dimensionArray = Ext.Array.clean(dimensionArray);

					return dimensionArray.length ? dimensionArray : null;
				};

				validateSpecialCases = function() {
					var dimConf = conf.finals.dimension,
						dimensions,
						objectNameDimensionMap = {};

					if (!layout) {
						return;
					}

					dimensions = Ext.Array.clean([].concat(layout.columns || [], layout.rows || [], layout.filters || []));

					for (var i = 0; i < dimensions.length; i++) {
						objectNameDimensionMap[dimensions[i].dimension] = dimensions[i];
					}

					// dc and in
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.indicator.objectName]) {
						webAlert('Indicators and detailed data elements cannot be specified together');
						return;
					}

					// dc and de
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.dataElement.objectName]) {
						webAlert('Detailed data elements and totals cannot be specified together');
						return;
					}

					// dc and ds
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.dataSet.objectName]) {
						webAlert('Data sets and detailed data elements cannot be specified together');
						return;
					}

					// dc and co
					if (objectNameDimensionMap[dimConf.operand.objectName] && objectNameDimensionMap[dimConf.category.objectName]) {
						webAlert('Assigned categories and detailed data elements cannot be specified together');
						return;
					}

                    // in and aggregation type
                    if (objectNameDimensionMap[dimConf.indicator.objectName] && config.aggregationType !== 'DEFAULT') {
                        webAlert('Indicators and aggregation types cannot be specified together', true);
                        return;
                    }

					return true;
				};

				return function() {
					var dimensionNames = [],
						dimConf = conf.finals.dimension;

					// config must be an object
					if (!(config && Ext.isObject(config))) {
						console.log('Layout: config is not an object (' + init.el + ')');
						return;
					}

                    config.columns = getValidatedDimensionArray(config.columns);
                    config.rows = getValidatedDimensionArray(config.rows);

					// at least one dimension specified as column or row
					if (!config.columns) {
						webAlert('Specify at least one column dimension');
						return;
					}

					// get object names
					for (var i = 0, dims = Ext.Array.clean([].concat(config.columns || [], config.rows || [], config.filters || [])); i < dims.length; i++) {

						// Object names
						if (api.layout.Dimension(dims[i])) {
							dimensionNames.push(dims[i].dimension);
						}
					}

					// at least one period
					if (!Ext.Array.contains(dimensionNames, dimConf.period.objectName)) {
						webAlert('Select at least one period item');
						return;
					}

					// favorite
					if (config.id) {
						layout.id = config.id;
					}

					if (config.name) {
						layout.name = config.name;
					}

					// layout
					layout.columns = config.columns;
                    layout.rows = config.rows;

					layout.showDataDescription = Ext.isBoolean(config.showDataDescription) ? config.showDataDescription : false;

					layout.showHierarchy = Ext.isBoolean(config.showHierarchy) ? config.showHierarchy : false;

					layout.displayDensity = Ext.isString(config.displayDensity) && !Ext.isEmpty(config.displayDensity) ? config.displayDensity : 'NORMAL';
					layout.fontSize = Ext.isString(config.fontSize) && !Ext.isEmpty(config.fontSize) ? config.fontSize : 'NORMAL';
					layout.digitGroupSeparator = Ext.isString(config.digitGroupSeparator) && !Ext.isEmpty(config.digitGroupSeparator) ? config.digitGroupSeparator : 'SPACE';
					layout.legendSet = Ext.isObject(config.legendSet) && Ext.isString(config.legendSet.id) ? config.legendSet : null;

					layout.parentGraphMap = Ext.isObject(config.parentGraphMap) ? config.parentGraphMap : null;

					layout.sorting = Ext.isObject(config.sorting) && Ext.isDefined(config.sorting.id) && Ext.isString(config.sorting.direction) ? config.sorting : null;

                    if (Ext.Array.from(config.userOrgUnit).length) {
                        layout.userOrgUnit = Ext.Array.from(config.userOrgUnit);
                    }

                    if (support.prototype.date.getYYYYMMDD(config.relativePeriodDate)) {
                        layout.relativePeriodDate = support.prototype.date.getYYYYMMDD(config.relativePeriodDate);
                    }

                    if (Ext.isArray(config.dataDimensionItems) && config.dataDimensionItems.length) {
                        layout.dataDimensionItems = config.dataDimensionItems;
                    }

                    // validate
					if (!validateSpecialCases()) {
						return;
					}

                    return Ext.apply(layout, forceApplyConfig);
				}();
			};

            // data

			api.data = {};

            // Response
            (function() {
                var R = api.data.Response = function(config) {
                    var r = this;

                    r.headers = config.headers;
                    r.metaData = config.metaData;
                    r.rows = config.rows;

                    r.idCombinationIndex = {
                        'dx': 0,
                        'pe': 1,
                        'ou': 2
                    };

                    // initialized transient properties
                    r.nameHeaderMap = {};

                    // uninitialized transient properties
                    r.idValueMap = {};
                    r.idCombinations = [];

                    // header index
                    (function() {
                        for (var i = 0; i < r.headers.length; i++) {
                            r.headers[i].index = i;
                        }
                    })();

                    // nameHeaderMap
                    (function() {
                        r.nameHeaderMap = {};

                        for (var i = 0; i < r.headers.length; i++) {
                            r.nameHeaderMap[r.headers[i].name] = r.headers[i];
                        }
                    })();
                };

                R.prototype.getHeaderByName = function(name) {
                    return this.nameHeaderMap[name];
                };

                R.prototype.getHeaderIndexByName = function(name) {
                    return this.nameHeaderMap[name].index;
                };

                R.prototype.getNameById = function(id) {
                    return this.metaData.names[id];
                };

                R.prototype.getIdByIdComb = function(idComb, dataType) {
                    return idComb.split('-')[this.idCombinationIndex[dataType]];
                };

                R.prototype.getNameByIdComb = function(idComb, dataType) {
                    return this.getNameById(this.getIdByIdComb(idComb, dataType));
                };

                R.prototype.getLevelById = function(id) {
                    return Ext.Array.clean((this.metaData.ouHierarchy[id] || '').split('/') || []).length + 1;
                };

                R.prototype.getMaxLevel = function() {
                    var ouh = this.metaData.ouHierarchy,
                        anLevels = [];

                    for (var i in ouh) {
                        if (ouh.hasOwnProperty(i)) {
                            anLevels.push(this.getLevelById(i));
                        }
                    }

                    return Ext.Array.max(anLevels);
                };

                R.prototype.getMinLevel = function() {
                    var ouh = this.metaData.ouHierarchy,
                        anLevels = [];

                    for (var i in ouh) {
                        if (ouh.hasOwnProperty(i)) {
                            anLevels.push(this.getLevelById(i));
                        }
                    }

                    return Ext.Array.min(anLevels);
                };

                R.prototype.getNumberOfNumericItemsInArray = function(array) {
                    if (!Ext.isArray(array)) {
                        return 0;
                    }

                    for (var i = 0, count = 0; i < array.length; i++) {
                        if (Ext.isNumeric(array[i])) {
                            count++;
                        }
                    }

                    return count;
                };

                R.prototype.getParentNameByIdAndLevel = function(ouId, level) {
                    var parentGraphIdArray = this.getParentGraphIdArray(ouId),
                        nLevel = level.level;

                    return this.getNameById(parentGraphIdArray[nLevel - 1]);
                };

                R.prototype.getParentNameByIdCombAndLevel = function(idComb, level) {
                    var ouId = idComb.split('-')[this.idCombinationIndex['ou']];

                    return this.getParentNameByIdAndLevel(ouId, level);
                };

                R.prototype.getParentGraphIdArray = function(id) {
                    return Ext.Array.clean((this.metaData.ouHierarchy[id] || '').split('/') || []);
                };

                R.prototype.getParentGraphNameArray = function(id) {
                    var getAncestorIdArray = this.getAncestorIdArray(id),
                        anchestorNameArray = [];

                    for (var i = 0; i < getAncestorIdArray.length; i++) {
                        anchestorNameArray[i] = this.getNameById(getAncestorIdArray[i]);
                    }

                    return anchestorNameArray;
                };

                R.prototype.getPeGroupNameByPeId = function(peId) {
                    var peName = this.getNameById(peId),
                        a = peName.split(' '),
                        a0 = a[0],
                        map = {
                            'Apr': 'April',
                            'Jul': 'July',
                            'Oct': 'October'
                        };

                    if (a.length === 1) {
                        return a0.slice(0,4);
                    }

                    return this.getNumberOfNumericItemsInArray(a) === 1 ? a.pop() : 'Financial ' + map[a0];
                };

                R.prototype.generateIdValueMap = function() {
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

                R.prototype.getValueByIdComb = function(idComb) {
                    return this.idValueMap[idComb];
                };

                R.prototype.getValueByIdParams = function(dxId, peId, ouId) {
                    return this.idValueMap[dxId + '-' + peId + '-' + ouId];
                };

                R.prototype.getValueByDxIdAndIdComb = function(dxId, idComb) {
                    var pe = this.getIdByIdComb(idComb, 'pe');
                    var ou = this.getIdByIdComb(idComb, 'ou');

                    return this.getValueByIdComb(dxId + '-' + this.getIdByIdComb(idComb, 'pe') + '-' + this.getIdByIdComb(idComb, 'ou'));
                };

                R.prototype.generateIdCombinations = function(aDxResIds, aPeResIds, aOuResIds) {
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
			})();

            // Data object
            (function() {
                var D = api.data.DataObject = function(config, dataType) {
                    var d = this,
                        indicator = 'indicator',
                        dataElement = 'dataElement';

                    d.dataType = dataType;
                    d.isIndicator = d.dataType === indicator;
                    d.isDataElement = d.dataType === dataElement;

                    d.id = config.id;
                    d.name = config.name;
                    d.displayName = config.displayName;
                    d.displayShortName = config.displayShortName;
                    d.groups = config.indicatorGroups || config.dataElementGroups || [];
                    d.group = d.groups[0] || {};
                    d.groupName = d.group.name || '';

                    d.numerator = config.numerator;
                    d.numeratorDescription = config.numeratorDescription;
                    d.denominator = config.denominator;
                    d.denominatorDescription = config.denominatorDescription;
                    d.description = config.description;
                    d.annualized = config.annualized;

                    d.type = config.indicatorType ? config.indicatorType.name : (config.aggregationType ? config.aggregationType : '');
                    d.typeName = d.type + (config.annualized ? ' (annualized)' : '');

                    d.legendSet = config.legendSet || null;

                    d.defaultLegendSet = {
                        name: 'Default percentage legend set',
                        legends: [
                            {name: 'Bad', startValue: 0, endValue: 50, color: '#ff0000'},
                            {name: 'Medium', startValue: 50, endValue: 80, color: '#ffff00'},
                            {name: 'Good', startValue: 80, endValue: 100, color: '#00bf00'},
                            {name: 'Too high', startValue: 100, endValue: 1000000000, color: '#f5f5f5'}
                        ]
                    };

                    d.defaultBgColor = '#fff';

                    // transient
                    d.strippedNumerator;
                    d.strippedDenominator;

                    d.numeratorIds;
                    d.denominatorIds;

                    d.numeratorTotal;
                    d.denominatorTotal;
                };

                D.prototype.stripFormula = function(formula) {
                    return (formula || '').replace(/#/g, '').replace(/{/g, '').replace(/}/g, '').replace(/\(|\)/g, "");
                };

                D.prototype.generateStrippedNumerator = function() {
                    return this.strippedNumerator = this.stripFormula(this.numerator);
                };

                D.prototype.generateStrippedDenominator = function() {
                    return this.strippedDenominator = this.stripFormula(this.denominator);
                };

                D.prototype.getIdsFromFormula = function(formula) {
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
                };

                D.prototype.generateNumeratorIds = function() {
                    return this.numeratorIds = this.getIdsFromFormula(this.numerator);
                };

                D.prototype.generateDenominatorIds = function() {
                    return this.denominatorIds = this.getIdsFromFormula(this.denominator);
                };

                D.prototype.getBgColorByValue = function(value) {
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

                D.prototype.getNumeratorTotal = function(response, idComb) {
                    if (this.isIndicator) {
                        var numeratorIds = this.generateNumeratorIds(),
                            strippedNumerator = Ext.clone(this.generateStrippedNumerator());

                        for (var k = 0, id, value; k < numeratorIds.length; k++) {
                            id = numeratorIds[k];
                            value = response.getValueByDxIdAndIdComb(id, idComb);

                            strippedNumerator = strippedNumerator.replace(id, value);
                        }

                        return this.numeratorTotal = eval(strippedNumerator);
                    }
                    else if (this.isDataElement) {
                        return this.numeratorTotal = response.getValueByIdComb(idComb);
                    }
                };

                D.prototype.getDenominatorTotal = function(response, idComb) {
                    if (this.isIndicator) {
                        var denominatorIds = this.generateDenominatorIds(),
                            strippedDenominator = Ext.clone(this.generateStrippedDenominator());

                        for (var k = 0, id, value; k < denominatorIds.length; k++) {
                            id = denominatorIds[k];
                            value = response.getValueByDxIdAndIdComb(id, idComb);

                            strippedDenominator = strippedDenominator.replace(id, value);
                        }

                        return this.denominatorTotal = eval(strippedDenominator);
                    }
                    else if (this.isDataElement) {
                        return this.denominatorTotal = 1;
                    }
                };
            })();

            // Table header
            (function() {
                var H = api.data.TableHeader = function(config) {
                    var h = this;

                    h.id = config.id;
                    h.elementId = Ext.data.IdGenerator.get('uuid').generate();
                    h.name = config.name;
                    h.objectName = config.objectName;

                    if (Ext.isNumeric(config.level)) {
                        h.level = parseInt(config.level);
                    }

                    h.cls = 'pivot-dim td-sortable pointer';

                    // transient
                    h.html;
                };

                H.prototype.generateHtml = function() {
                    this.html = '<td';
                    this.html += this.elementId ? (' id="' + this.elementId + '"') : '';
                    this.html += this.cls ? (' class="' + this.cls + '"') : '';
                    this.html += this.style ? (' style="' + this.style + '"') : '';
                    this.html += '>' + this.name + '</td>';

                    return this.html;
                };
            })();

            // Table cell
            (function() {
                var C = api.data.TableCell = function(config) {
                    var c = this;

                    c.name = config.name;
                    c.sortId = config.sortId;
                    c.cls = config.cls;
                    c.style = config.style;

                    // transient
                    c.html;
                };

                C.prototype.generateHtml = function() {
                    this.html = '<td';
                    this.html += this.cls ? (' class="' + this.cls + '"') : '';
                    this.html += this.style ? (' style="' + this.style + '"') : '';
                    this.html += '>' + this.name + '</td>';

                    return this.html;
                };
            })();

            // Data
            (function() {
                var D = api.data.Data = function(config) {
                    var d = this;

                    d.tableHeaders = config.tableHeaders;
                    d.tableRows = config.tableRows;
                    d.cls = config.cls;

                    d.sorting = {
                        id: '',
                        direction: ''
                    };

                    // transient
                    d.lastSorting = {
                        id: '',
                        direction: ''
                    };

                    d.html;

                    d.update;
                };

                D.prototype.getSortDirection = function(id) {
                    if (id === this.lastSorting.id) {
                        return this.lastSorting.direction === 'ASC' ? 'DESC' : 'ASC';
                    }

                    return 'ASC';
                };

                D.prototype.sortData = function() {
                    var sorting = this.sorting;

                    this.tableRows.sort( function(a, b) {

                        a = a[sorting.id]['sortId'];
                        b = b[sorting.id]['sortId'];

                        // string
                        if (Ext.isString(a) && Ext.isString(b)) {
                            a = a.toLowerCase();
                            b = b.toLowerCase();

                            if (sorting.direction === 'DESC') {
                                return a < b ? 1 : (a > b ? -1 : 0);
                            }
                            else {
                                return a < b ? -1 : (a > b ? 1 : 0);
                            }
                        }

                        // number
                        else if (Ext.isNumber(a) && Ext.isNumber(b)) {
                            return sorting.direction === 'DESC' ? b - a : a - b;
                        }

                        else if (Ext.isEmpty(a)) {
                            return sorting.emptyFirst ? -1 : 1;
                        }

                        else if (Ext.isEmpty(b)) {
                            return sorting.emptyFirst ? 1 : -1;
                        }

                        return -1;
                    });
                };

                D.prototype.addOptionsCls = function(options) {

                    // display density
                    this.cls += ' displaydensity-' + (layout.displayDensity || 'NORMAL').toLowerCase();

                    // font size
                    this.cls += ' fontsize-' + (layout.fontSize || 'NORMAL').toLowerCase();

                    return this.cls;
                };

                D.prototype.generateHtml = function() {
                    var html = '<table class="pivot ' + this.cls + '">';

                    html += '<tr>';

                    for (var i = 0; i < this.tableHeaders.length; i++) {
                        html += this.tableHeaders[i].generateHtml();
                    }

                    html += '</tr>';

                    for (var j = 0, row; j < this.tableRows.length; j++) {
                        row = this.tableRows[j];
                        html += '<tr>';

                        for (var k = 0, th; k < this.tableHeaders.length; k++) {
                            th = this.tableHeaders[k];
                            html += row[th.id].generateHtml();
                        }

                        html += '</tr>';
                    }

                    html += '</table>';

                    return this.html = html;
                };

                D.prototype.addHeaderClickListeners = function() {
                    var d = this;

                    for (var i = 0, th, el; i < this.tableHeaders.length; i++) {
                        th = this.tableHeaders[i];
                        el = Ext.get(th.elementId);
                        el.tableHeaderId = th.id;

                        el.on('click', function() {
                        	d.sorting.id = this.tableHeaderId;
                            d.sorting.direction = d.getSortDirection(this.tableHeaderId);

                            d.sortData();
                            d.update();

                            d.lastSorting.id = d.sorting.id;
                            d.lastSorting.direction = d.sorting.direction;
                        });
                    }
                };
            })();
        })();

		// support
		(function() {

			// prototype
			support.prototype = {};

				// array
			support.prototype.array = {};

			support.prototype.array.getLength = function(array, suppressWarning) {
				if (!Ext.isArray(array)) {
					if (!suppressWarning) {
						console.log('support.prototype.array.getLength: not an array');
					}

					return null;
				}

				return array.length;
			};

			support.prototype.array.sort = function(array, direction, key, emptyFirst) {
				// supports [number], [string], [{key: number}], [{key: string}], [[string]], [[number]]

				if (!support.prototype.array.getLength(array)) {
					return;
				}

				key = !!key || Ext.isNumber(key) ? key : 'name';

				array.sort( function(a, b) {

					// if object, get the property values
					if (Ext.isObject(a) && Ext.isObject(b)) {
						a = a[key];
						b = b[key];
					}

					// if array, get from the right index
					if (Ext.isArray(a) && Ext.isArray(b)) {
						a = a[key];
						b = b[key];
					}

					// string
					if (Ext.isString(a) && Ext.isString(b)) {
						a = a.toLowerCase();
						b = b.toLowerCase();

						if (direction === 'DESC') {
							return a < b ? 1 : (a > b ? -1 : 0);
						}
						else {
							return a < b ? -1 : (a > b ? 1 : 0);
						}
					}

					// number
					else if (Ext.isNumber(a) && Ext.isNumber(b)) {
						return direction === 'DESC' ? b - a : a - b;
					}

                    else if (a === undefined || a === null) {
                        return emptyFirst ? -1 : 1;
                    }

                    else if (b === undefined || b === null) {
                        return emptyFirst ? 1 : -1;
                    }

					return -1;
				});

				return array;
			};

            support.prototype.array.addObjectProperty = function(array, key, value) {
                if (Ext.isArray(array)) {
                    for (var i = 0; i < array.length; i++) {
                        array[i][key] = value;
                    }
                }

                return array;
            };

				// object
			support.prototype.object = {};

			support.prototype.object.getLength = function(object, suppressWarning) {
				if (!Ext.isObject(object)) {
					if (!suppressWarning) {
						console.log('support.prototype.object.getLength: not an object');
					}

					return null;
				}

				var size = 0;

				for (var key in object) {
					if (object.hasOwnProperty(key)) {
						size++;
					}
				}

				return size;
			};

			support.prototype.object.hasObject = function(object, property, value) {
				if (!support.prototype.object.getLength(object)) {
					return null;
				}

				for (var key in object) {
					var record = object[key];

					if (object.hasOwnProperty(key) && record[property] === value) {
						return true;
					}
				}

				return null;
			};

				// str
			support.prototype.str = {};

			support.prototype.str.replaceAll = function(str, find, replace) {
				return str.replace(new RegExp(find, 'g'), replace);
			};

			support.prototype.str.toggleDirection = function(direction) {
				return direction === 'DESC' ? 'ASC' : 'DESC';
			};

				// number
			support.prototype.number = {};

			support.prototype.number.getNumberOfDecimals = function(number) {
				var str = new String(number);
				return (str.indexOf('.') > -1) ? (str.length - str.indexOf('.') - 1) : 0;
			};

			support.prototype.number.roundIf = function(number, precision) {
				number = parseFloat(number);
				precision = parseFloat(precision);

				if (Ext.isNumber(number) && Ext.isNumber(precision)) {
					var numberOfDecimals = support.prototype.number.getNumberOfDecimals(number);
					return numberOfDecimals > precision ? Ext.Number.toFixed(number, precision) : number;
				}

				return number;
			};

			support.prototype.number.prettyPrint = function(number, separator) {
				separator = separator || 'space';

				if (separator === 'none') {
					return number;
				}

				return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, conf.report.digitGroupSeparator[separator]);
			};

                // date
            support.prototype.date = {};

            support.prototype.date.getYYYYMMDD = function(param) {
                if (!Ext.isString(param)) {
                    if (!(Object.prototype.toString.call(param) === '[object Date]' && param.toString() !== 'Invalid date')) {
                        return null;
                    }
                }

                var date = new Date(param),
                    month = '' + (1 + date.getMonth()),
                    day = '' + date.getDate();

                month = month.length === 1 ? '0' + month : month;
                day = day.length === 1 ? '0' + day : day;

                return date.getFullYear() + '-' + month + '-' + day;
            };

			// color
			support.color = {};

			support.color.hexToRgb = function(hex) {
				var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i,
					result;

				hex = hex.replace(shorthandRegex, function(m, r, g, b) {
					return r + r + g + g + b + b;
				});

				result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

				return result ? {
					r: parseInt(result[1], 16),
					g: parseInt(result[2], 16),
					b: parseInt(result[3], 16)
				} : null;
			};

            // connection
            support.connection = {};

            support.connection.ajax = function(requestConfig, authConfig) {
                if (authConfig.crossDomain && Ext.isString(authConfig.username) && Ext.isString(authConfig.password)) {
                    requestConfig.headers = Ext.isObject(authConfig.headers) ? authConfig.headers : {};
                    requestConfig.headers['Authorization'] = 'Basic ' + btoa(authConfig.username + ':' + authConfig.password);
                }

                Ext.Ajax.request(requestConfig);
            };
		}());

		// service
		(function() {

			// layout
			service.layout = {};

			service.layout.cleanDimensionArray = function(dimensionArray) {
				if (!support.prototype.array.getLength(dimensionArray)) {
					return null;
				}

				var array = [];

				for (var i = 0; i < dimensionArray.length; i++) {
					array.push(api.layout.Dimension(dimensionArray[i]));
				}

				array = Ext.Array.clean(array);

				return array.length ? array : null;
			};

			service.layout.sortDimensionArray = function(dimensionArray, key) {
				if (!support.prototype.array.getLength(dimensionArray, true)) {
					return null;
				}

				// Clean dimension array
				dimensionArray = service.layout.cleanDimensionArray(dimensionArray);

				if (!dimensionArray) {
					console.log('service.layout.sortDimensionArray: no valid dimensions');
					return null;
				}

				key = key || 'dimensionName';

				// Dimension order
				Ext.Array.sort(dimensionArray, function(a,b) {
					if (a[key] < b[key]) {
						return -1;
					}
					if (a[key] > b[key]) {
						return 1;
					}
					return 0;
				});

				// Sort object items, ids
				for (var i = 0, items; i < dimensionArray.length; i++) {
					support.prototype.array.sort(dimensionArray[i].items, 'ASC', 'id');

					if (support.prototype.array.getLength(dimensionArray[i].ids)) {
						support.prototype.array.sort(dimensionArray[i].ids);
					}
				}

				return dimensionArray;
			};

			service.layout.getObjectNameDimensionMapFromDimensionArray = function(dimensionArray) {
				var map = {};

				if (!support.prototype.array.getLength(dimensionArray)) {
					return null;
				}

				for (var i = 0, dimension; i < dimensionArray.length; i++) {
					dimension = api.layout.Dimension(dimensionArray[i]);

					if (dimension) {
						map[dimension.dimension] = dimension;
					}
				}

				return support.prototype.object.getLength(map) ? map : null;
			};

			service.layout.getObjectNameDimensionItemsMapFromDimensionArray = function(dimensionArray) {
				var map = {};

				if (!support.prototype.array.getLength(dimensionArray)) {
					return null;
				}

				for (var i = 0, dimension; i < dimensionArray.length; i++) {
					dimension = api.layout.Dimension(dimensionArray[i]);

					if (dimension) {
						map[dimension.dimension] = dimension.items;
					}
				}

				return support.prototype.object.getLength(map) ? map : null;
			};

			service.layout.getItemName = function(layout, response, id, isHtml) {
				var metaData = response.metaData,
					name = '';

				if (service.layout.isHierarchy(layout, response, id)) {
					var a = Ext.Array.clean(metaData.ouHierarchy[id].split('/'));
					a.shift();

					for (var i = 0; i < a.length; i++) {
						name += (isHtml ? '<span class="text-weak">' : '') + metaData.names[a[i]] + (isHtml ? '</span>' : '') + ' / ';
					}
				}

				name += metaData.names[id];

				return name;
			};

			service.layout.getExtendedLayout = function(layout) {
				var layout = Ext.clone(layout),
					xLayout;

				xLayout = {
					columns: [],
					rows: [],
					filters: [],

					columnObjectNames: [],
					columnDimensionNames: [],
					rowObjectNames: [],
					rowDimensionNames: [],

					// axis
					axisDimensions: [],
					axisObjectNames: [],
					axisDimensionNames: [],

						// for param string
					sortedAxisDimensionNames: [],

					// Filter
					filterDimensions: [],
					filterObjectNames: [],
					filterDimensionNames: [],

						// for param string
					sortedFilterDimensions: [],

					// all
					dimensions: [],
					objectNames: [],
					dimensionNames: [],

					// oject name maps
					objectNameDimensionsMap: {},
					objectNameItemsMap: {},
					objectNameIdsMap: {},

					// dimension name maps
					dimensionNameDimensionsMap: {},
					dimensionNameItemsMap: {},
					dimensionNameIdsMap: {},

						// for param string
					dimensionNameSortedIdsMap: {},

					// sort table by column
					//sortableIdObjects: []

                    dimensionNameAxisMap: {}
				};

				Ext.applyIf(xLayout, layout);

				// columns, rows, filters
				if (layout.columns) {
					for (var i = 0, dim, items, xDim; i < layout.columns.length; i++) {
						dim = layout.columns[i];
						items = dim.items;
						xDim = {};

						xDim.dimension = dim.dimension;
						xDim.objectName = dim.dimension;
						xDim.dimensionName = dimConf.objectNameMap[dim.dimension].dimensionName;

						if (items) {
							xDim.items = items;
							xDim.ids = [];

							for (var j = 0; j < items.length; j++) {
								xDim.ids.push(items[j].id);
							}
						}

						xLayout.columns.push(xDim);

						xLayout.columnObjectNames.push(xDim.objectName);
						xLayout.columnDimensionNames.push(xDim.dimensionName);

						xLayout.axisDimensions.push(xDim);
						xLayout.axisObjectNames.push(xDim.objectName);
						xLayout.axisDimensionNames.push(dimConf.objectNameMap[xDim.objectName].dimensionName);

						xLayout.objectNameDimensionsMap[xDim.objectName] = xDim;
						xLayout.objectNameItemsMap[xDim.objectName] = xDim.items;
						xLayout.objectNameIdsMap[xDim.objectName] = xDim.ids;

                        xLayout.dimensionNameAxisMap[xDim.dimensionName] = xLayout.columns;
					}
				}

				if (layout.rows) {
					for (var i = 0, dim, items, xDim; i < layout.rows.length; i++) {
						dim = Ext.clone(layout.rows[i]);
						items = dim.items;
						xDim = {};

						xDim.dimension = dim.dimension;
						xDim.objectName = dim.dimension;
						xDim.dimensionName = dimConf.objectNameMap[dim.dimension].dimensionName;

						if (items) {
							xDim.items = items;
							xDim.ids = [];

							for (var j = 0; j < items.length; j++) {
								xDim.ids.push(items[j].id);
							}
						}

						xLayout.rows.push(xDim);

						xLayout.rowObjectNames.push(xDim.objectName);
						xLayout.rowDimensionNames.push(xDim.dimensionName);

						xLayout.axisDimensions.push(xDim);
						xLayout.axisObjectNames.push(xDim.objectName);
						xLayout.axisDimensionNames.push(dimConf.objectNameMap[xDim.objectName].dimensionName);

						xLayout.objectNameDimensionsMap[xDim.objectName] = xDim;
						xLayout.objectNameItemsMap[xDim.objectName] = xDim.items;
						xLayout.objectNameIdsMap[xDim.objectName] = xDim.ids;

                        xLayout.dimensionNameAxisMap[xDim.dimensionName] = xLayout.rows;
					}
				}

				if (layout.filters) {
					for (var i = 0, dim, items, xDim; i < layout.filters.length; i++) {
						dim = layout.filters[i];
						items = dim.items;
						xDim = {};

						xDim.dimension = dim.dimension;
						xDim.objectName = dim.dimension;
						xDim.dimensionName = dimConf.objectNameMap[dim.dimension].dimensionName;

						if (items) {
							xDim.items = items;
							xDim.ids = [];

							for (var j = 0; j < items.length; j++) {
								xDim.ids.push(items[j].id);
							}
						}

						xLayout.filters.push(xDim);

						xLayout.filterDimensions.push(xDim);
						xLayout.filterObjectNames.push(xDim.objectName);
						xLayout.filterDimensionNames.push(dimConf.objectNameMap[xDim.objectName].dimensionName);

						xLayout.objectNameDimensionsMap[xDim.objectName] = xDim;
						xLayout.objectNameItemsMap[xDim.objectName] = xDim.items;
						xLayout.objectNameIdsMap[xDim.objectName] = xDim.ids;

                        xLayout.dimensionNameAxisMap[xDim.dimensionName] = xLayout.filters;
					}
				}

				// legend set
				xLayout.legendSet = layout.legendSet ? init.idLegendSetMap[layout.legendSet.id] : null;

				if (layout.legendSet) {
					xLayout.legendSet = init.idLegendSetMap[layout.legendSet.id];
					support.prototype.array.sort(xLayout.legendSet.legends, 'ASC', 'startValue');
				}

				// unique dimension names
				xLayout.axisDimensionNames = Ext.Array.unique(xLayout.axisDimensionNames);
				xLayout.filterDimensionNames = Ext.Array.unique(xLayout.filterDimensionNames);

				xLayout.columnDimensionNames = Ext.Array.unique(xLayout.columnDimensionNames);
				xLayout.rowDimensionNames = Ext.Array.unique(xLayout.rowDimensionNames);
				xLayout.filterDimensionNames = Ext.Array.unique(xLayout.filterDimensionNames);

					// for param string
				xLayout.sortedAxisDimensionNames = Ext.clone(xLayout.axisDimensionNames).sort();
				xLayout.sortedFilterDimensions = service.layout.sortDimensionArray(Ext.clone(xLayout.filterDimensions));

				// all
				xLayout.dimensions = [].concat(xLayout.axisDimensions, xLayout.filterDimensions);
				xLayout.objectNames = [].concat(xLayout.axisObjectNames, xLayout.filterObjectNames);
				xLayout.dimensionNames = [].concat(xLayout.axisDimensionNames, xLayout.filterDimensionNames);

				// dimension name maps
				for (var i = 0, dimName; i < xLayout.dimensionNames.length; i++) {
					dimName = xLayout.dimensionNames[i];

					xLayout.dimensionNameDimensionsMap[dimName] = [];
					xLayout.dimensionNameItemsMap[dimName] = [];
					xLayout.dimensionNameIdsMap[dimName] = [];
				}

				for (var i = 0, xDim; i < xLayout.dimensions.length; i++) {
					xDim = xLayout.dimensions[i];

					xLayout.dimensionNameDimensionsMap[xDim.dimensionName].push(xDim);
					xLayout.dimensionNameItemsMap[xDim.dimensionName] = xLayout.dimensionNameItemsMap[xDim.dimensionName].concat(xDim.items);
					xLayout.dimensionNameIdsMap[xDim.dimensionName] = xLayout.dimensionNameIdsMap[xDim.dimensionName].concat(xDim.ids);
				}

					// for param string
				for (var key in xLayout.dimensionNameIdsMap) {
					if (xLayout.dimensionNameIdsMap.hasOwnProperty(key)) {
						xLayout.dimensionNameSortedIdsMap[key] = Ext.clone(xLayout.dimensionNameIdsMap[key]).sort();
					}
				}

				// Uuid
				xLayout.tableUuid = init.el + '_' + Ext.data.IdGenerator.get('uuid').generate();

				return xLayout;
			};

			service.layout.getSyncronizedXLayout = function(xLayout, response) {
				var removeDimensionFromXLayout,
					dimensions = Ext.Array.clean([].concat(xLayout.columns || [], xLayout.rows || [], xLayout.filters || [])),
                    xOuDimension = xLayout.objectNameDimensionsMap[dimConf.organisationUnit.objectName],
                    isUserOrgunit = xOuDimension && Ext.Array.contains(xOuDimension.ids, 'USER_ORGUNIT'),
                    isUserOrgunitChildren = xOuDimension && Ext.Array.contains(xOuDimension.ids, 'USER_ORGUNIT_CHILDREN'),
                    isUserOrgunitGrandChildren = xOuDimension && Ext.Array.contains(xOuDimension.ids, 'USER_ORGUNIT_GRANDCHILDREN'),
                    isLevel = function() {
                        if (xOuDimension && Ext.isArray(xOuDimension.ids)) {
                            for (var i = 0; i < xOuDimension.ids.length; i++) {
                                if (xOuDimension.ids[i].substr(0,5) === 'LEVEL') {
                                    return true;
                                }
                            }
                        }

                        return false;
                    }(),
                    isGroup = function() {
                        if (xOuDimension && Ext.isArray(xOuDimension.ids)) {
                            for (var i = 0; i < xOuDimension.ids.length; i++) {
                                if (xOuDimension.ids[i].substr(0,8) === 'OU_GROUP') {
                                    return true;
                                }
                            }
                        }

                        return false;
                    }(),
                    co = dimConf.category.objectName,
                    ou = dimConf.organisationUnit.objectName,
                    headerNames = function() {
                        var headerNames = [];

                        for (var i = 0; i < response.headers.length; i++) {
                            headerNames.push(response.headers[i].name);
                        }

                        return headerNames;
                    }(),
                    layout;

				removeDimensionFromXLayout = function(objectName) {
					var getUpdatedAxis;

					getUpdatedAxis = function(axis) {
						var dimension;
						axis = Ext.clone(axis);

						for (var i = 0; i < axis.length; i++) {
							if (axis[i].dimension === objectName) {
								dimension = axis[i];
							}
						}

						if (dimension) {
							Ext.Array.remove(axis, dimension);
						}

						return axis;
					};

					if (xLayout.columns) {
						xLayout.columns = getUpdatedAxis(xLayout.columns);
					}
					if (xLayout.rows) {
						xLayout.rows = getUpdatedAxis(xLayout.rows);
					}
					if (xLayout.filters) {
						xLayout.filters = getUpdatedAxis(xLayout.filters);
					}
				};

                // set items from init/metaData/xLayout
                for (var i = 0, dim, metaDataDim, items; i < dimensions.length; i++) {
                    dim = dimensions[i];
                    dim.items = [];
                    metaDataDim = response.metaData[dim.objectName];

                    if (Ext.isArray(metaDataDim) && metaDataDim.length) {
                        var ids = Ext.clone(response.metaData[dim.dimensionName]);
                        for (var j = 0; j < ids.length; j++) {
                            dim.items.push({
                                id: ids[j],
                                name: response.metaData.names[ids[j]]
                            });
                        }
                    }
                    else {
                        dim.items = Ext.clone(xLayout.objectNameItemsMap[dim.objectName]);
                    }
                }

                // add missing names
                dimensions = Ext.Array.clean([].concat(xLayout.columns || [], xLayout.rows || [], xLayout.filters || []));

                for (var i = 0, idNameMap = response.metaData.names, dimItems; i < dimensions.length; i++) {
                    dimItems = dimensions[i].items;

                    if (Ext.isArray(dimItems) && dimItems.length) {
                        for (var j = 0, item; j < dimItems.length; j++) {
                            item = dimItems[j];

                            if (Ext.isObject(item) && Ext.isString(idNameMap[item.id]) && !Ext.isString(item.name)) {
                                item.name = idNameMap[item.id] || '';
                            }
                        }
                    }
                }

                // remove dimensions from layout that do not exist in response
                for (var i = 0, dimensionName; i < xLayout.axisDimensionNames.length; i++) {
                    dimensionName = xLayout.axisDimensionNames[i];
                    if (!Ext.Array.contains(headerNames, dimensionName)) {
                        removeDimensionFromXLayout(dimensionName);
                    }
                }

                // Add ou hierarchy dimensions
                //if (xOuDimension && xLayout.showHierarchy) {
                    //addOuHierarchyDimensions();
                //}

                // Re-layout
                layout = api.layout.Layout(xLayout);

                if (layout) {
                    return service.layout.getExtendedLayout(layout);
                }

                return null;
			};

			service.layout.getExtendedAxis = function(xLayout, type) {
				var dimensionNames,
					spanType,
					aDimensions = [],
					nAxisWidth = 1,
					nAxisHeight,
					aaUniqueFloorIds,
					aUniqueFloorWidth = [],
					aAccFloorWidth = [],
					aFloorSpan = [],
					aaGuiFloorIds = [],
					aaAllFloorIds = [],
					aCondoId = [],
					aaAllFloorObjects = [],
					uuidObjectMap = {};

				if (type === 'col') {
					dimensionNames = Ext.clone(xLayout.columnDimensionNames);
					spanType = 'colSpan';
				}
				else if (type === 'row') {
					dimensionNames = Ext.clone(xLayout.rowDimensionNames);
					spanType = 'rowSpan';
				}

				if (!(Ext.isArray(dimensionNames) && dimensionNames.length)) {
					return;
				}
	//dimensionNames = ['pe', 'ou'];

				// aDimensions: array of dimension objects with dimensionName property
				for (var i = 0; i < dimensionNames.length; i++) {
					aDimensions.push({
						dimensionName: dimensionNames[i]
					});
				}
	//aDimensions = [{
		//dimensionName: 'pe'
	//}]

				// aaUniqueFloorIds: array of arrays with unique ids for each dimension floor
				aaUniqueFloorIds = function() {
					var a = [];

					for (var i = 0; i < aDimensions.length; i++) {
						a.push(xLayout.dimensionNameIdsMap[aDimensions[i].dimensionName]);
					}

					return a;
				}();
	//aaUniqueFloorIds	= [ [de-id1, de-id2, de-id3],
	//					    [pe-id1],
	//					    [ou-id1, ou-id2, ou-id3, ou-id4] ]

				// nAxisHeight
				nAxisHeight = aaUniqueFloorIds.length;
	//nAxisHeight = 3


				// aUniqueFloorWidth, nAxisWidth, aAccFloorWidth
				for (var i = 0, nUniqueFloorWidth; i < nAxisHeight; i++) {
					nUniqueFloorWidth = aaUniqueFloorIds[i].length;

					aUniqueFloorWidth.push(nUniqueFloorWidth);
					nAxisWidth = nAxisWidth * nUniqueFloorWidth;
					aAccFloorWidth.push(nAxisWidth);
				}
	//aUniqueFloorWidth	= [3, 1, 4]
	//nAxisWidth		= 12 (3 * 1 * 4)
	//aAccFloorWidth	= [3, 3, 12]

				// aFloorSpan
				for (var i = 0; i < nAxisHeight; i++) {
					if (aUniqueFloorWidth[i] === 1) {
						if (i === 0) { // if top floor, set maximum span
							aFloorSpan.push(nAxisWidth);
						}
						else {
							if (xLayout.hideEmptyRows && type === 'row') {
								aFloorSpan.push(nAxisWidth / aAccFloorWidth[i]);
							}
							else { //if just one item and not top level, use same span as top level
								aFloorSpan.push(aFloorSpan[0]);
							}
						}
					}
					else {
						aFloorSpan.push(nAxisWidth / aAccFloorWidth[i]);
					}
				}
	//aFloorSpan = [4, 12, 1]


				// aaGuiFloorIds
				aaGuiFloorIds.push(aaUniqueFloorIds[0]);

				if (nAxisHeight.length > 1) {
					for (var i = 1, a, n; i < nAxisHeight; i++) {
						a = [];
						n = aUniqueFloorWidth[i] === 1 ? aUniqueFloorWidth[0] : aAccFloorWidth[i-1];

						for (var j = 0; j < n; j++) {
							a = a.concat(aaUniqueFloorIds[i]);
						}

						aaGuiFloorIds.push(a);
					}
				}
	//aaGuiFloorIds	= [ [d1, d2, d3], (3)
	//					[p1, p2, p3, p4, p5, p1, p2, p3, p4, p5, p1, p2, p3, p4, p5], (15)
	//					[o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2...] (30)
	//		  	  	  ]

				// aaAllFloorIds
				for (var i = 0, aAllFloorIds, aUniqueFloorIds, span, factor; i < nAxisHeight; i++) {
					aAllFloorIds = [];
					aUniqueFloorIds = aaUniqueFloorIds[i];
					span = aFloorSpan[i];
					factor = nAxisWidth / (span * aUniqueFloorIds.length);

					for (var j = 0; j < factor; j++) {
						for (var k = 0; k < aUniqueFloorIds.length; k++) {
							for (var l = 0; l < span; l++) {
								aAllFloorIds.push(aUniqueFloorIds[k]);
							}
						}
					}

					aaAllFloorIds.push(aAllFloorIds);
				}
	//aaAllFloorIds	= [ [d1, d1, d1, d1, d1, d1, d1, d1, d1, d1, d2, d2, d2, d2, d2, d2, d2, d2, d2, d2, d3, d3, d3, d3, d3, d3, d3, d3, d3, d3], (30)
	//					[p1, p2, p3, p4, p5, p1, p2, p3, p4, p5, p1, p2, p3, p4, p5, p1, p2, p3, p4, p5, p1, p2, p3, p4, p5, p1, p2, p3, p4, p5], (30)
	//					[o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2, o1, o2] (30)
	//		  	  	  ]

				// aCondoId
				for (var i = 0, id; i < nAxisWidth; i++) {
					id = '';

					for (var j = 0; j < nAxisHeight; j++) {
						id += aaAllFloorIds[j][i];
					}

					if (id) {
						aCondoId.push(id);
					}
				}
	//aCondoId = [ id11+id21+id31, id12+id22+id32, ... ]


				// allObjects
				for (var i = 0, allFloor; i < aaAllFloorIds.length; i++) {
					allFloor = [];

					for (var j = 0, obj; j < aaAllFloorIds[i].length; j++) {
						obj = {
							id: aaAllFloorIds[i][j],
							uuid: Ext.data.IdGenerator.get('uuid').generate(),
							dim: i,
							axis: type
						};

						// leaf?
						if (i === aaAllFloorIds.length - 1) {
							obj.leaf = true;
						}

						allFloor.push(obj);
					}

					aaAllFloorObjects.push(allFloor);
				}

				// add span and children
				for (var i = 0, aAboveFloorObjects, doorIds, uniqueDoorIds; i < aaAllFloorObjects.length; i++) {
                    doorIds = [];

					for (var j = 0, obj, doorCount = 0, oldestObj; j < aaAllFloorObjects[i].length; j++) {

						obj = aaAllFloorObjects[i][j];
                        doorIds.push(obj.id);

						if (doorCount === 0) {

							// span
							obj[spanType] = aFloorSpan[i];

							// children
                            if (obj.leaf) {
                                obj.children = 0;
                            }

							// first sibling
							obj.oldest = true;

							// root?
							if (i === 0) {
								obj.root = true;
							}

							// tmp oldest uuid
							oldestObj = obj;
						}

						obj.oldestSibling = oldestObj;

						if (++doorCount === aFloorSpan[i]) {
							doorCount = 0;
						}
					}

                    // set above floor door children to number of unique door ids on this floor
                    if (i > 0) {
                        aAboveFloorObjects = aaAllFloorObjects[i-1];
                        uniqueDoorIds = Ext.Array.unique(doorIds);

                        for (var j = 0; j < aAboveFloorObjects.length; j++) {
                            aAboveFloorObjects[j].children = uniqueDoorIds.length;
                        }
                    }
				}

				// add parents if more than 1 floor
				if (nAxisHeight > 1) {
					for (var i = 1, aAllFloor; i < nAxisHeight; i++) {
						aAllFloor = aaAllFloorObjects[i];

						//for (var j = 0, obj, doorCount = 0, span = aFloorSpan[i - 1], parentObj = aaAllFloorObjects[i - 1][0]; j < aAllFloor.length; j++) {
						for (var j = 0, doorCount = 0, span = aFloorSpan[i - 1]; j < aAllFloor.length; j++) {
							aAllFloor[j].parent = aaAllFloorObjects[i - 1][j];

							//doorCount++;

							//if (doorCount === span) {
								//parentObj = aaAllFloorObjects[i - 1][j + 1];
								//doorCount = 0;
							//}
						}
					}
				}

				// add uuids array to leaves
				if (aaAllFloorObjects.length) {

					// set span to second lowest span number: if aFloorSpan == [15,3,15,1], set span to 3
					var nSpan = nAxisHeight > 1 ? support.prototype.array.sort(Ext.clone(aFloorSpan))[1] : nAxisWidth,
						aAllFloorObjectsLast = aaAllFloorObjects[aaAllFloorObjects.length - 1];

					for (var i = 0, leaf, parentUuids, obj, leafUuids = []; i < aAllFloorObjectsLast.length; i++) {
						leaf = aAllFloorObjectsLast[i];
						leafUuids.push(leaf.uuid);
						parentUuids = [];
						obj = leaf;

						// get the uuid of the oldest sibling
						while (obj.parent) {
							obj = obj.parent;
							parentUuids.push(obj.oldestSibling.uuid);
						}

						// add parent uuids to leaf
						leaf.uuids = Ext.clone(parentUuids);

						// add uuid for all leaves
						if (leafUuids.length === nSpan) {
							for (var j = (i - nSpan) + 1, leaf; j <= i; j++) {
								leaf = aAllFloorObjectsLast[j];
								leaf.uuids = leaf.uuids.concat(leafUuids);
							}

							leafUuids = [];
						}
					}
				}

				// populate uuidObject map
				for (var i = 0; i < aaAllFloorObjects.length; i++) {
					for (var j = 0, object; j < aaAllFloorObjects[i].length; j++) {
						object = aaAllFloorObjects[i][j];

						uuidObjectMap[object.uuid] = object;
					}
				}

				return {
					type: type,
					items: aDimensions,
					xItems: {
						unique: aaUniqueFloorIds,
						gui: aaGuiFloorIds,
						all: aaAllFloorIds
					},
					objects: {
						all: aaAllFloorObjects
					},
					ids: aCondoId,
					span: aFloorSpan,
					dims: nAxisHeight,
					size: nAxisWidth,
					uuidObjectMap: uuidObjectMap
				};
			};

			service.layout.isHierarchy = function(layout, response, id) {
				return layout.showHierarchy && Ext.isObject(response.metaData.ouHierarchy) && response.metaData.ouHierarchy.hasOwnProperty(id);
			};

			service.layout.layout2plugin = function(layout, el) {
				var layout = Ext.clone(layout),
					dimensions = Ext.Array.clean([].concat(layout.columns || [], layout.rows || [], layout.filters || []));

				layout.url = init.contextPath;

				if (el) {
					layout.el = el;
				}

				if (Ext.isString(layout.id)) {
					return {id: layout.id};
				}

				for (var i = 0, dimension, item; i < dimensions.length; i++) {
					dimension = dimensions[i];

					delete dimension.id;
					delete dimension.ids;
					delete dimension.type;
					delete dimension.dimensionName;
					delete dimension.objectName;

					for (var j = 0, item; j < dimension.items.length; j++) {
						item = dimension.items[j];

						delete item.name;
						delete item.code;
						delete item.created;
						delete item.lastUpdated;
						delete item.value;
					}
				}

				if (layout.showRowTotals) {
					delete layout.showRowTotals;
				}

                if (layout.showColTotals) {
					delete layout.showColTotals;
				}

				if (layout.showColSubTotals) {
					delete layout.showColSubTotals;
				}

				if (layout.showRowSubTotals) {
					delete layout.showRowSubTotals;
				}

				if (layout.showDimensionLabels) {
					delete layout.showDimensionLabels;
				}

				if (!layout.hideEmptyRows) {
					delete layout.hideEmptyRows;
				}

				if (!layout.showHierarchy) {
					delete layout.showHierarchy;
				}

				if (layout.displayDensity === 'NORMAL') {
					delete layout.displayDensity;
				}

				if (layout.fontSize === 'NORMAL') {
					delete layout.fontSize;
				}

				if (layout.digitGroupSeparator === 'SPACE') {
					delete layout.digitGroupSeparator;
				}

				if (!layout.legendSet) {
					delete layout.legendSet;
				}

				if (!layout.sorting) {
					delete layout.sorting;
				}

				if (layout.aggregationType === 'DEFAULT') {
					delete layout.aggregationType;
				}

				if (layout.dataApprovalLevel && layout.dataApprovalLevel.id === 'DEFAULT') {
					delete layout.dataApprovalLevel;
				}

				delete layout.parentGraphMap;
				delete layout.reportingPeriod;
				delete layout.organisationUnit;
				delete layout.parentOrganisationUnit;
				delete layout.regression;
				delete layout.cumulative;
				delete layout.sortOrder;
				delete layout.topLimit;

				return layout;
			};

			// response
			service.response = {};

			service.response.getExtendedResponse = function(xLayout, response) {
				var ids = [];

				response = Ext.clone(response);

				response.nameHeaderMap = {};
				response.idValueMap = {};

				// extend headers
				(function() {

					// extend headers: index, ids, size
					for (var i = 0, header; i < response.headers.length; i++) {
						header = response.headers[i];

						// index
						header.index = i;

						if (header.meta) {

							// ids
							header.ids = Ext.clone(xLayout.dimensionNameIdsMap[header.name]) || [];

							// size
							header.size = header.ids.length;

							// collect ids, used by extendMetaData
							ids = ids.concat(header.ids);
						}
					}

					// nameHeaderMap (headerName: header)
					for (var i = 0, header; i < response.headers.length; i++) {
						header = response.headers[i];

						response.nameHeaderMap[header.name] = header;
					}
				}());

				// create value id map
				(function() {
					var valueHeaderIndex = response.nameHeaderMap[conf.finals.dimension.value.value].index,
						coHeader = response.nameHeaderMap[conf.finals.dimension.category.dimensionName],
						dx = dimConf.data.dimensionName,
						co = dimConf.category.dimensionName,
						axisDimensionNames = xLayout.axisDimensionNames,
						idIndexOrder = [];

					// idIndexOrder
					for (var i = 0; i < axisDimensionNames.length; i++) {
						idIndexOrder.push(response.nameHeaderMap[axisDimensionNames[i]].index);

						// If co exists in response and is not added in layout, add co after dx
						if (coHeader && !Ext.Array.contains(axisDimensionNames, co) && axisDimensionNames[i] === dx) {
							idIndexOrder.push(coHeader.index);
						}
					}

					// idValueMap
					for (var i = 0, row, id; i < response.rows.length; i++) {
						row = response.rows[i];
						id = '';

						for (var j = 0, index; j < idIndexOrder.length; j++) {
							index = idIndexOrder[j];

							//id += response.headers[index].name === co ? '.' : '';
							id += row[index];
						}

						response.idValueMap[id] = row[valueHeaderIndex];
					}
				}());

				return response;
			};

            service.response.addOuHierarchyDimensions = function(response) {
                var headers = response.headers,
                    ouHierarchy = response.metaData.ouHierarchy,
                    rows = response.rows,
                    ouIndex,
                    numLevels = 0,
                    initArray = [],
                    newHeaders = [],
                    a;

                if (!ouHierarchy) {
                    return;
                }

                // get ou index
                for (var i = 0; i < headers.length; i++) {
                    if (headers[i].name === 'ou') {
                        ouIndex = i;
                        break;
                    }
                }

                // get numLevels
                for (var i = 0; i < rows.length; i++) {
                    numLevels = Math.max(numLevels, Ext.Array.clean(ouHierarchy[rows[i][ouIndex]].split('/')).length);
                }

                // init array
                for (var i = 0; i < numLevels; i++) {
                    initArray.push('');
                }

                // extend rows
                for (var i = 0, row, ouArray; i < rows.length; i++) {
                    row = rows[i];
                    ouArray = Ext.applyIf(Ext.Array.clean(ouHierarchy[row[ouIndex]].split('/')), Ext.clone(initArray));

                    Ext.Array.insert(row, ouIndex, ouArray);
                }

                // create new headers
                for (var i = 0; i < numLevels; i++) {
                    newHeaders.push({
                        column: 'Organisation unit',
                        hidden: false,
                        meta: true,
                        name: 'ou',
                        type: 'java.lang.String'
                    });
                }

                Ext.Array.insert(headers, ouIndex, newHeaders);

                return response;
            };

            service.response.getValue = function(str) {
				var n = parseFloat(str);

                if (Ext.isBoolean(str)) {
                    return 1;
                }

                // return string if
                // - parsefloat(string) is not a number
                // - string is just starting with a number
                // - string is a valid date
				//if (!Ext.isNumber(n) || n != str || new Date(str).toString() !== 'Invalid Date') {
				if (!Ext.isNumber(n) || n != str) {
					return 0;
				}

                return n;
			};
        }());

		// web
		(function() {

			// mask
			web.mask = {};

			web.mask.show = function(component, message) {
				if (!Ext.isObject(component)) {
					console.log('support.gui.mask.show: component not an object');
					return null;
				}

				message = message || 'Loading..';

				if (component.mask && component.mask.destroy) {
					component.mask.destroy();
					component.mask = null;
				}

				component.mask = new Ext.create('Ext.LoadMask', component, {
					shadow: false,
					msg: message,
					style: 'box-shadow:0',
					bodyStyle: 'box-shadow:0'
				});

				component.mask.show();
			};

			web.mask.hide = function(component) {
				if (!Ext.isObject(component)) {
					console.log('support.gui.mask.hide: component not an object');
					return null;
				}

				if (component.mask && component.mask.destroy) {
					component.mask.destroy();
					component.mask = null;
				}
			};

			// window
			web.window = web.window || {};

			web.window.setAnchorPosition = function(w, target) {
				var vpw = app.getViewportWidth(),
					targetx = target ? target.getPosition()[0] : 4,
					winw = w.getWidth(),
					y = target ? target.getPosition()[1] + target.getHeight() + 4 : 33;

				if ((targetx + winw) > vpw) {
					w.setPosition((vpw - winw - 2), y);
				}
				else {
					w.setPosition(targetx, y);
				}
			};

			web.window.addHideOnBlurHandler = function(w) {
				var el = Ext.get(Ext.query('.x-mask')[0]);

				el.on('click', function() {
					if (w.hideOnBlur) {
						w.hide();
					}
				});

				w.hasHideOnBlurHandler = true;
			};

			web.window.addDestroyOnBlurHandler = function(w) {
				var maskElements = Ext.query('.x-mask'),
                    el = Ext.get(maskElements[0]);

				el.on('click', function() {
					if (w.destroyOnBlur) {
						w.destroy();
					}
				});

				w.hasDestroyOnBlurHandler = true;
			};

			// message
			web.message = {};

			web.message.alert = function(obj) {
                var config = {},
                    type,
                    window;

                if (!obj || (Ext.isObject(obj) && !obj.message && !obj.responseText)) {
                    return;
                }

                // if response object
                if (Ext.isObject(obj) && obj.responseText && !obj.message) {
                    obj = Ext.decode(obj.responseText);
                }

                // if string
                if (Ext.isString(obj)) {
                    obj = {
                        status: 'ERROR',
                        message: obj
                    };
                }

                // web message
                type = (obj.status || 'INFO').toLowerCase();

				config.title = obj.status;
				config.iconCls = 'ns-window-title-messagebox ' + type;

                // html
                config.html = '';
                config.html += obj.httpStatusCode ? 'Code: ' + obj.httpStatusCode + '<br>' : '';
                config.html += obj.httpStatus ? 'Status: ' + obj.httpStatus + '<br><br>' : '';
                config.html += obj.message + (obj.message.substr(obj.message.length - 1) === '.' ? '' : '.');

                // bodyStyle
                config.bodyStyle = 'padding: 12px; background: #fff; max-width: 600px; max-height: ' + app.getCenterRegionHeight() / 2 + 'px';

                // destroy handler
                config.modal = true;
                config.destroyOnBlur = true;

                // listeners
                config.listeners = {
                    show: function(w) {
                        w.setPosition(w.getPosition()[0], w.getPosition()[1] / 2);

						if (!w.hasDestroyOnBlurHandler) {
							web.window.addDestroyOnBlurHandler(w);
						}
                    }
                };

                window = Ext.create('Ext.window.Window', config);

                window.show();
            };

			// analytics
			web.analytics = {};

			web.analytics.getParamString = function(xLayout, isSorted) {
				var axisDimensionNames = isSorted ? xLayout.sortedAxisDimensionNames : xLayout.axisDimensionNames,
					filterDimensions = isSorted ? xLayout.sortedFilterDimensions : xLayout.filterDimensions,
					dimensionNameIdsMap = isSorted ? xLayout.dimensionNameSortedIdsMap : xLayout.dimensionNameIdsMap,
					paramString = '?',
					addCategoryDimension = false,
					map = xLayout.dimensionNameItemsMap,
					dx = dimConf.indicator.dimensionName,
					co = dimConf.category.dimensionName,
                    aggTypes = ['COUNT', 'SUM', 'STDDEV', 'VARIANCE', 'MIN', 'MAX'],
                    displayProperty = xLayout.displayProperty || init.userAccount.settings.keyAnalysisDisplayProperty || 'name';

				for (var i = 0, dimName, items; i < axisDimensionNames.length; i++) {
					dimName = axisDimensionNames[i];

					paramString += 'dimension=' + dimName;

					items = Ext.clone(dimensionNameIdsMap[dimName]);

					if (dimName === dx) {
						items = Ext.Array.unique(items);
					}

					if (dimName !== co) {
						paramString += ':' + items.join(';');
					}

					if (i < (axisDimensionNames.length - 1)) {
						paramString += '&';
					}
				}

				if (addCategoryDimension) {
					paramString += '&dimension=' + conf.finals.dimension.category.dimensionName;
				}

				if (Ext.isArray(filterDimensions) && filterDimensions.length) {
					for (var i = 0, dim; i < filterDimensions.length; i++) {
						dim = filterDimensions[i];

						paramString += '&filter=' + dim.dimensionName + ':' + dim.ids.join(';');
					}
				}

				if (xLayout.showHierarchy) {
					paramString += '&hierarchyMeta=true';
				}

				// aggregation type
				if (Ext.Array.contains(aggTypes, xLayout.aggregationType)) {
					paramString += '&aggregationType=' + xLayout.aggregationType;
				}

                // display property
                paramString += '&displayProperty=' + displayProperty.toUpperCase();

                // user org unit
                if (Ext.isArray(xLayout.userOrgUnit) && xLayout.userOrgUnit.length) {
                    paramString += '&userOrgUnit=';

                    for (var i = 0; i < xLayout.userOrgUnit.length; i++) {
                        paramString += xLayout.userOrgUnit[i] + (i < xLayout.userOrgUnit.length - 1 ? ';' : '');
                    }
				}

				// data approval level
				if (Ext.isObject(xLayout.dataApprovalLevel) && Ext.isString(xLayout.dataApprovalLevel.id) && xLayout.dataApprovalLevel.id !== 'DEFAULT') {
					paramString += '&approvalLevel=' + xLayout.dataApprovalLevel.id;
				}

                // TODO program
                if (xLayout.program && xLayout.program.id) {
                    paramString += '&program=' + xLayout.program.id;
                }

                // relative period date
                if (xLayout.relativePeriodDate) {
                    paramString += '&relativePeriodDate=' + xLayout.relativePeriodDate;
                }

				return paramString.replace(/#/g, '.');
			};

			web.analytics.validateUrl = function(url) {
				var msg;

                if (Ext.isIE) {
                    msg = 'Too many items selected (url has ' + url.length + ' characters). Internet Explorer accepts maximum 2048 characters.';
                }
                else {
					var len = url.length > 8000 ? '8000' : (url.length > 4000 ? '4000' : '2000');
					msg = 'Too many items selected (url has ' + url.length + ' characters). Please reduce to less than ' + len + ' characters.';
                }

                msg += '\n\n' + 'Hint: A good way to reduce the number of items is to use relative periods and level/group organisation unit selection modes.';

                webAlert(msg, 'warning');
			};

			// pivot
			web.report = {};

			web.report.getHtml = function(layout, fCallback) {
                var data,
                    aInReqIds = [],
                    aInReqItems = [],
                    aDeReqIds = [],
                    aDeReqItems = [],
                    aDsReqIds = [],
                    aDsReqItems = [],
                    aPeReqIds = [],
                    aOuReqIds = [],
                    oDimNameReqItemArrayMap = {},
                    sInName = 'indicator',
                    sDeName = 'dataElement',
                    sDsName = 'dataSet';

                oDimNameReqItemArrayMap[dimConf.period.dimensionName] = aPeReqIds;
                oDimNameReqItemArrayMap[dimConf.organisationUnit.dimensionName] = aOuReqIds;

                // columns (data)
                (function() {
                    var ddi = layout.dataDimensionItems,
                        dimMap = {};

                    dimMap[sInName] = aInReqIds;
                    dimMap[sDeName] = aDeReqIds;
                    dimMap[sDsName] = aDsReqIds;

                    // add objects to corresponding array
                    if (Ext.isArray(ddi) && ddi.length) {
                        for (var i = 0, obj; i < ddi.length; i++) {
                            obj = ddi[i];

                            for (var j = 0, names = [sInName, sDeName, sDsName]; j < names.length; j++) {
                                name = names[j];

                                if (obj.hasOwnProperty(name) && Ext.isObject(obj[name])) {
                                    dimMap[name].push(obj[name].id);
                                }
                            }
                        }
                    }
                })();

                // rows
                if (Ext.isArray(layout.rows)) {
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
                    idDataObjectMap = {};

                getIndicators = function() {
                    if (!aInReqIds.length) {
                        getDataElements();
                        return;
                    }

                    $.ajax({
                        url: init.contextPath + '/api/indicators.json?paging=false&filter=id:in:[' + aInReqIds.join(',') + ']&fields=id,name,displayName,displayShortName,description,indicatorType,annualized,indicatorGroups[id,name],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[name,legends[name,startValue,endValue,color]]',
                        headers: {'Authorization': 'Basic ' + btoa(appConfig.username + ':' + appConfig.password)}
                    }).done(function(r) {
                        if (r.indicators) {
                            for (var i = 0, obj; i < r.indicators.length; i++) {
                                obj = new api.data.DataObject(r.indicators[i], sInName);

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

                    $.ajax({
                        url: init.contextPath + '/api/dataElements.json?paging=false&filter=id:in:[' + aDeReqIds.join(',') + ']&fields=id,name,displayName,displayShortName,description,aggregationType,dataElementGroups[id,name],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[name,legends[name,startValue,endValue,color]]',
                        headers: {'Authorization': 'Basic ' + btoa(appConfig.username + ':' + appConfig.password)}
                    }).done(function(r) {
                        if (r.dataElements) {
                            for (var i = 0, obj; i < r.dataElements.length; i++) {
                                obj = new api.data.DataObject(r.dataElements[i], sDeName);

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

                    $.ajax({
                        url: init.contextPath + '/api/dataSets.json?paging=false&filter=id:in:[' + aDsReqIds.join(',') + ']&fields=id,name,displayName,displayShortName,valueType,dataSetGroups[name],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[name,legends[name,startValue,endValue,color]]',
                        headers: {'Authorization': 'Basic ' + btoa(appConfig.username + ':' + appConfig.password)}
                    }).done(function(r) {
                        aDsReqItems = r.dataSets;
                        support.prototype.array.addObjectProperty(aDsReqItems, 'type', sDsName);
                        getData();
                    });
                };

                getData = function() {
                    aDxReqIds = [].concat(aInReqIds || [], aDeReqIds || [], aDsReqIds || []);
                    aDxReqItems = [].concat(aInReqItems || [], aDeReqItems || [], aDsReqItems || []);

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

                    $.ajax({
                        url: init.contextPath + '/api/analytics.json?dimension=pe:' + aPeReqIds.join(';') + '&dimension=dx:' + sLookupSubElements + aDxReqIds.join(';') + '&dimension=ou:' + aOuReqIds.join(';') + '&hierarchyMeta=true&displayProperty=NAME&showHierarchy=true',
                        headers: {'Authorization': 'Basic ' + btoa(appConfig.username + ':' + appConfig.password)}
                    }).done(function(analyticsData) {
                        var response = new api.data.Response(analyticsData),
                            aDxResIds = aDxReqIds,
                            aPeResIds = response.metaData.pe,
                            aOuResIds = response.metaData.ou,
                            idCombinations = response.generateIdCombinations(aDxResIds, aPeResIds, aOuResIds),
                            tableHeaders = [],
                            tableRows = [];

                        response.generateIdValueMap();

                        // table headers

                        (function() {
                            var index = 0;

                            // ou headers
                            (function() {
                                var maxLevel = response.getMaxLevel(),
                                    minLevel = response.getMinLevel(),
                                    startLevel;

                                startLevel = layout.showHierarchy ? (maxLevel > 1 ? 1 : 0) : minLevel - 1;

                                for (var level; startLevel < maxLevel; startLevel++) {
                                    level = Ext.clone(init.organisationUnitLevels[startLevel]);
                                    level.objectName = 'ou';
                                    level.cls = 'pivot-dim';
                                    level.index = index++;

                                    tableHeaders.push(new api.data.TableHeader(level));
                                }
                            })();

                            // pe headers
                            tableHeaders.push(new api.data.TableHeader({
                                id: 'pe-group',
                                name: 'Period group',
                                objectName: 'pe',
                                cls: 'pivot-dim',
                                index: index++
                            }));

                            tableHeaders.push(new api.data.TableHeader({
                                id: 'pe',
                                name: 'Period',
                                objectName: 'pe',
                                cls: 'pivot-dim',
                                index: index++
                            }));

                            // dx headers
                            tableHeaders.push(new api.data.TableHeader({
                                id: 'dx-group',
                                name: 'Data group',
                                objectName: 'dx',
                                cls: 'pivot-dim',
                                index: index++
                            }));

                            tableHeaders.push(new api.data.TableHeader({
                                id: 'dx',
                                name: 'Data',
                                objectName: 'dx',
                                cls: 'pivot-dim',
                                index: index++
                            }));

                            tableHeaders.push(new api.data.TableHeader({
                                id: 'dx-type',
                                name: 'Type',
                                objectName: 'dx',
                                cls: 'pivot-dim'
                            }));

                            if (layout.showDataDescription) {
                                tableHeaders.push(new api.data.TableHeader({
                                    id: 'dx-description',
                                    name: 'Description',
                                    objectName: 'dx',
                                    cls: 'pivot-dim'
                                }));
                            }

                            tableHeaders.push(new api.data.TableHeader({
                                id: 'dx-numerator',
                                name: 'Numerator',
                                objectName: 'dx',
                                cls: 'pivot-dim',
                                index: index++
                            }));

                            tableHeaders.push(new api.data.TableHeader({
                                id: 'dx-denominator',
                                name: 'Denominator',
                                objectName: 'dx',
                                cls: 'pivot-dim',
                                index: index++
                            }));

                            tableHeaders.push(new api.data.TableHeader({
                                id: 'dx-value',
                                name: 'Value',
                                objectName: 'dx',
                                cls: 'pivot-dim',
                                index: index++
                            }));
                        })();

                        // table rows

                        (function() {

                            for (var i = 0, row, idComb, dxId, peId, ouId, dataObject, ouLevel; i < idCombinations.length; i++) {
                                idComb = idCombinations[i];
                                dxId = response.getIdByIdComb(idComb, 'dx');
                                peId = response.getIdByIdComb(idComb, 'pe');
                                ouId = response.getIdByIdComb(idComb, 'ou');
                                ouLevel = response.getLevelById(ouId);
                                dataObject = idDataObjectMap[dxId];
                                row = {};

                                for (var j = 0, th, ouName = '', value; j < tableHeaders.length; j++) {
                                    th = tableHeaders[j];

                                    // ou
                                    if (th.objectName === 'ou') {
                                        ouName = response.getParentNameByIdAndLevel(ouId, th) || (ouLevel === th.level ? response.getNameById(ouId) : '');

                                        row[th.id] = new api.data.TableCell({
                                            name: ouName,
                                            sortId: ouName,
                                            cls: 'pivot-value'
                                        });
                                    }

                                    // pe
                                    else if (th.objectName === 'pe') {
                                        if (th.id === 'pe-group') {
                                            row[th.id] = new api.data.TableCell({
                                                name: response.getPeGroupNameByPeId(peId),
                                                sortId: peId,
                                                cls: 'pivot-value'
                                            });
                                        }

                                        else if (th.id === 'pe') {
                                            row[th.id] = new api.data.TableCell({
                                                name: response.getNameById(peId),
                                                sortId: peId,
                                                cls: 'pivot-value'
                                            });
                                        }
                                    }

                                    // dx
                                    else if (th.objectName === 'dx') {

                                        if (th.id === 'dx-group') {
                                            row[th.id] = new api.data.TableCell({
                                                name: dataObject.groupName,
                                                sortId: dataObject.groupName,
                                                cls: 'pivot-value'
                                            });
                                        }
                                        else if (th.id === 'dx') {
                                            row[th.id] = new api.data.TableCell({
                                                name: dataObject.name,
                                                sortId: dataObject.name,
                                                cls: 'pivot-value'
                                            });
                                        }
                                        else if (th.id === 'dx-type') {
                                            row[th.id] = new api.data.TableCell({
                                                name: dataObject.typeName,
                                                sortId: dataObject.typeName,
                                                cls: 'pivot-value' + (dataObject.type.length === 1 ? ' td-nobreak' : '')
                                            });
                                        }
                                        else if (th.id === 'dx-description') {
                                            row[th.id] = new api.data.TableCell({
                                                name: dataObject.description,
                                                sortId: dataObject.description,
                                                cls: 'pivot-value'
                                            });
                                        }
                                        else if (th.id === 'dx-numerator') {
                                            var numeratorTotal = dataObject.getNumeratorTotal(response, idComb);

                                            row[th.id] = new api.data.TableCell({
                                                name: numeratorTotal || '',
                                                sortId: numeratorTotal || 0,
                                                cls: 'pivot-value'
                                            });
                                        }
                                        else if (th.id === 'dx-denominator') {
                                            var denominatorTotal = dataObject.getDenominatorTotal(response, idComb);

                                            row[th.id] = new api.data.TableCell({
                                                name: denominatorTotal || '',
                                                sortId: denominatorTotal || 0,
                                                cls: 'pivot-value'
                                            });
                                        }
                                        else if (th.id === 'dx-value') {
                                            value = response.getValueByIdComb(idComb);

                                            row[th.id] = new api.data.TableCell({
                                                name: value || '',
                                                sortId: parseFloat(value) || 0,
                                                cls: 'pivot-value',
                                                style: 'background-color:' + dataObject.getBgColorByValue(parseFloat(value))
                                            });
                                        }
                                    }
                                }

                                tableRows.push(row);
                            }
                        })();

                        data = new api.data.Data({
                            tableHeaders: tableHeaders,
                            tableRows: tableRows
                        });

                        data.addOptionsCls(layout);

                        if (fCallback) {
                            fCallback(data);
                        }

                        if (NS.isDebug) {
                            console.log('response', response);
                        }
                    });

                // end of indicator "done"
                };

                getIndicators();
            };
        }());

		// extend init
		(function() {

			// sort and extend dynamic dimensions
			if (Ext.isArray(init.dimensions)) {
				support.prototype.array.sort(init.dimensions);

				for (var i = 0, dim; i < init.dimensions.length; i++) {
					dim = init.dimensions[i];
					dim.dimensionName = dim.id;
					dim.objectName = conf.finals.dimension.dimension.objectName;
					conf.finals.dimension.objectNameMap[dim.id] = dim;
				}
			}

			// sort ouc
			if (init.user && init.user.ouc) {
				support.prototype.array.sort(init.user.ouc);
			}

			// legend set map
			init.idLegendSetMap = {};

			for (var i = 0, set; i < init.legendSets.length; i++) {
				set = init.legendSets[i];
				init.idLegendSetMap[set.id] = set;
			}
		}());

		// alert
		webAlert = web.message.alert;

		return {
            init: init,
            conf: conf,
            api: api,
            support: support,
            service: service,
            web: web,
            app: app,
            webAlert: webAlert
        };
	};
});
