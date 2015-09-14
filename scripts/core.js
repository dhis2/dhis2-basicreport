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
	PT = {};
	var NS = PT;

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
					'comma': ',',
					'space': '&nbsp;'
				},
				displayDensity: {
                    'xcompact': '2px',
					'compact': '4px',
					'normal': '6px',
					'comfortable': '8px',
                    'xcomfortable': '10px'
				},
				fontSize: {
					'xsmall': '9px',
					'small': '10px',
					'normal': '11px',
					'large': '12px',
					'xlarge': '14px'
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

                // showHierarchy: boolean (false)

				// displayDensity: string ('normal') - 'compact', 'normal', 'comfortable'

				// fontSize: string ('normal') - 'small', 'normal', 'large'

				// digitGroupSeparator: string ('space') - 'none', 'comma', 'space'

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
                    
					layout.showHierarchy = Ext.isBoolean(config.showHierarchy) ? config.showHierarchy : false;

					layout.displayDensity = Ext.isString(config.displayDensity) && !Ext.isEmpty(config.displayDensity) ? config.displayDensity : 'normal';
					layout.fontSize = Ext.isString(config.fontSize) && !Ext.isEmpty(config.fontSize) ? config.fontSize : 'normal';
					layout.digitGroupSeparator = Ext.isString(config.digitGroupSeparator) && !Ext.isEmpty(config.digitGroupSeparator) ? config.digitGroupSeparator : 'space';
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

			api.response = {};

			api.response.Header = function(config) {
				var config = Ext.clone(config);

				// name: string

				// meta: boolean

				return function() {
					if (!Ext.isObject(config)) {
						console.log('Header: config is not an object: ' + config);
						return;
					}

					if (!Ext.isString(config.name)) {
						console.log('Header: name is not a string: ' + config);
						return;
					}

					if (!Ext.isBoolean(config.meta)) {
						console.log('Header: meta is not boolean: ' + config);
						return;
					}

					return config;
				}();
			};

			api.response.Response = function(config) {
				var config = Ext.clone(config);

				// headers: [Header]

				return function() {
					if (!(config && Ext.isObject(config))) {
						console.log('Response: config is not an object');
						return;
					}

					if (!(config.headers && Ext.isArray(config.headers))) {
						console.log('Response: headers is not an array');
						return;
					}

					for (var i = 0, header; i < config.headers.length; i++) {
						config.headers[i] = api.response.Header(config.headers[i]);
					}

					config.headers = Ext.Array.clean(config.headers);

					if (!config.headers.length) {
						console.log('Response: no valid headers');
						return;
					}

					if (!(Ext.isArray(config.rows) && config.rows.length > 0)) {
						//console.log('No values found');
						//return;
					}

					if (config.rows.length > 0 && config.headers.length !== config.rows[0].length) {
						console.log('Response: headers.length !== rows[0].length');
					}

					return config;
				}();
			};
		}());

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

				if (layout.displayDensity === 'normal') {
					delete layout.displayDensity;
				}

				if (layout.fontSize === 'normal') {
					delete layout.fontSize;
				}

				if (layout.digitGroupSeparator === 'space') {
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

			web.report.getHtml = function(layout, callbackFn) {
                var BuildOutputReport,
                    makeTableHEADER,
                    makeTableBODY,
                    ReturnLookupValue,
                    ReturnLookup,
                    GetOUlevelName,
                    formatNumber,
                    ajax = support.connection.ajax;
                    
                BuildOutputReport = function(sDestination) {
                    var dxReqItems = [],
                        peReqItems = [],
                        ouReqItems = [],
                        dimNameReqItemArrayMap = {},
                        ouResItems = [];

                    dimNameReqItemArrayMap[dimConf.data.dimensionName] = dxReqItems;
                    dimNameReqItemArrayMap[dimConf.period.dimensionName] = peReqItems;
                    dimNameReqItemArrayMap[dimConf.organisationUnit.dimensionName] = ouReqItems;

                    for (var i = 0, dim; i < layout.columns.length; i++) {
                        dim = layout.columns[i];

                        for (var j = 0, item; j < dim.items.length; j++) {
                            item = dim.items[j];

                            dimNameReqItemArrayMap[dim.dimension].push(item.id);
                        }
                    }

                    var pRank = 1;
                    var ouHierarchyOffSet = 0;
                    var ArrDxName = [];
                    var ArrDxShort = [];
                    var ArrNumFormula = [];
                    var ArrNumFormulaItems = [];
                    var ArrNumDescription = [];
                    var ArrDenomFormula = [];
                    var ArrDenomFormulaItems = [];
                    var ArrDenomDescription = [];
                    var ArrTypeName = [];
                    var ArrDxGroupName = [];
                    var ArrDxIsIND = [];
                    var ArrDxLegendSet = [];
                    var lgIncr = 0;
                    var dxUniqueID = '';
                    var LookupSubElements = '';
                    var Nums = '';
                    var Denoms = '';

                    $.ajax({
                        url: init.contextPath + '/api/indicators.json?paging=false&filter=id:in:[' + dxReqItems.join(',') + ']&fields=id,name,displayName,displayShortName,indicatorType,indicatorGroups[name],numerator,numeratorDescription,denominator,denominatorDescription,legendSet[name,legends[name,startValue,endValue,color]]',
                        headers: {'Authorization': 'Basic ' + btoa(appConfig.username + ':' + appConfig.password)}
                    }).done(function(dxData) {
                        var indicators = dxData.indicators;

                        for (var i = 0, dxObjJ, dxLegendsets, numeratoritems, denominatoritems, lastNum; i < indicators.length; i++) {
                            dxObjJ = indicators[i];
                            dxUniqueID += (dxReqItems[i] + ';');
                            ArrDxIsIND[i] = 1;
                            ArrDxName[i] = dxObjJ.displayName;
                            ArrDxShort[i] = dxObjJ.displayShortName;
                            ArrNumFormula[i] = dxObjJ.numerator;
                            ArrNumDescription[i] = dxObjJ.numeratorDescription;
                            ArrDenomFormula[i] = dxObjJ.denominator;
                            ArrDenomDescription[i] = dxObjJ.denominatorDescription;
                            ArrTypeName[i] = dxObjJ.indicatorType.name;
                            ArrDxGroupName[i] = ((dxObjJ.indicatorGroups.length > 0) ? dxObjJ.indicatorGroups[0].name : '');
                            ArrDxLegendSet[i] = [];

                            if (dxObjJ.legendSet != undefined){
                                for (var p = 0; p < dxObjJ.legendSet.legends.length; p++)
                                {
                                    var sLegSet = (dxObjJ.legendSet.legends[p].name + ';' + dxObjJ.legendSet.legends[p].color + ';' + dxObjJ.legendSet.legends[p].startValue + ';' + dxObjJ.legendSet.legends[p].endValue);
                                    ArrDxLegendSet[i][lgIncr] = sLegSet;
                                    lgIncr += 1;
                                }
                            }

                            if (ArrNumFormula[i] != undefined){
                                var NumItems = '';
                                if (ArrNumFormula[i].indexOf('{') != 0){
                                    var ArrTmpOuter = ArrNumFormula[i].split('{');
                                    for (var p = 1; p < ArrTmpOuter.length; p++) 
                                    {
                                        var ArrTmpInner = ArrTmpOuter[p].split('}');
                                        // if current UID not already listed in 'known lookup uids' 
                                        if (LookupSubElements.indexOf(ArrTmpInner[0] + ';') < 0) {
                                            LookupSubElements += (ArrTmpInner[0]+';'); 
                                            NumItems += (ArrTmpInner[0]+';');
                                        }
                                    }
                                }
                                ArrNumFormulaItems[i] = NumItems;
                            }

                            if (ArrDenomFormula[i] != undefined){
                                var DenomItems = '';
                                if (ArrDenomFormula[i].indexOf('{') != 0){
                                    var ArrTmpOuter = ArrDenomFormula[i].split('{');
                                    for (var p = 1; p < ArrTmpOuter.length; p++) 
                                    {
                                        var ArrTmpInner = ArrTmpOuter[p].split('}');
                                        // if current UID not already listed in 'known lookup uids' 
                                        DenomItems += (ArrTmpInner[0]+';');
                                        if (LookupSubElements.indexOf(ArrTmpInner[0] + ';') < 0) {
                                            LookupSubElements += (ArrTmpInner[0]+';'); 
                                        }
                                    }
                                }
                                ArrDenomFormulaItems[i] = DenomItems;
                            }
                        }

                        // analytics

                        $.ajax({
                            url: init.contextPath + '/api/analytics.json?dimension=pe:' + peReqItems.join(';') + '&dimension=dx:' + LookupSubElements + dxReqItems.join(';') + '&dimension=ou:' + ouReqItems.join(';') + '&hierarchyMeta=true&displayProperty=NAME&showHierarchy=true',
                            headers: {'Authorization': 'Basic ' + btoa(appConfig.username + ':' + appConfig.password)}
                        }).done(function(analyticsData) {
                            var myData = analyticsData;
                            ouResItems = myData.metaData.ou;
                            
                            var sReturn = '';
                            var iNum = 0;
                            var iDen = 0;
                            var sParentPath;
                            var ParentArr;
                            var OUlevelJ;
                            var iHeaders = 0;

                            var objNames = JSON.parse(JSON.stringify(myData.metaData.names));
                            var objParentNames = JSON.parse(JSON.stringify(myData.metaData.ouNameHierarchy));
                            var objParentUIDs = JSON.parse(JSON.stringify(myData.metaData.ouHierarchy));

                            var objLevels = init.organisationUnitLevels;
                            
                            var MyHeaders = [];
                            var MyRows = [];

                            sParentPath = ReturnLookup(objParentUIDs,myData.rows[1][2]);
                            ParentArr = sParentPath.split("/");

                            for (var x=1; x<ParentArr.length; x++)
                            {
                                ouHierarchyOffSet = x;
                                if (ParentArr[x] == ouResItems){
                                    break;
                                }
                            }
                            
                            sParentPath = ReturnLookup(objParentNames,ReturnLookup(objNames,myData.rows[1][2]));
                            ParentArr = sParentPath.split("/");

                            MyHeaders[0] = 'RESERVED_ouh'; 
                            MyHeaders[1] = 'RESERVED_dx'; 
                            MyHeaders[2] = 'RESERVED_pe'; 
                            MyHeaders[3] = 'RESERVED_bgCol';

                            for (var x=ouHierarchyOffSet; x<ParentArr.length; x++)
                            {
                                MyHeaders[4+iHeaders] = GetOUlevelName(objLevels,x);
                                iHeaders += 1;
                            }

                            MyHeaders[4+iHeaders] = 'Group';
                            MyHeaders[4+iHeaders+1] = ReturnLookup(objNames,myData.headers[0].name);
                            MyHeaders[4+iHeaders+2] = 'Type';
                            MyHeaders[4+iHeaders+3] = ReturnLookup(objNames,myData.headers[1].name);

                            var peArr = (ReturnLookup(objNames,myData.rows[0][1])).split(" ");

                            for (var y=0; y<peArr.length; y++){
                                MyHeaders[(4+iHeaders + 3) + (y+1)] = ('Period P' + (y+1));
                            }

                            MyHeaders[(4+iHeaders + 3)+peArr.length+1] = 'Numerator';
                            MyHeaders[(4+iHeaders + 3)+peArr.length+2] = 'Denominator';
                            MyHeaders[(4+iHeaders + 3)+peArr.length+3] = 'Value';

                            var iCount = 0;

                            for (var i = 0; i < myData.rows.length; i++) 
                            {
                                if ((dxReqItems.join(';') + ';').indexOf(myData.rows[i][0] + ';') >= 0)
                                {
                                    for(var z = 0; z < dxReqItems.length; z++){
                                        if (myData.rows[i][0] == dxReqItems[z]){
                                            break;
                                        }
                                    }

                                    sParentPath = ReturnLookup(objParentNames,ReturnLookup(objNames,myData.rows[i][2]));
                                    ParentArr = sParentPath.split("/");
                                    MyRows[iCount] = [];

                                    MyRows[iCount][0] = sParentPath;
                                    MyRows[iCount][1] = ReturnLookup(objNames,myData.rows[i][0]);
                                    MyRows[iCount][2] = myData.rows[i][1];

                                    if (ArrDxLegendSet[z] != undefined){
                                        if (ArrDxLegendSet[z].length > 0){
                                            var bFound = 0;
                                            for(var iLg=0; iLg<ArrDxLegendSet[z].length; iLg++)
                                            {
                                                if ((ArrDxLegendSet[z][iLg]) != undefined){
                                                    //console.log('ArrDxLegendSet[z][iLg]: ' + ArrDxLegendSet[z][iLg]);
                                                    var LegArr = (ArrDxLegendSet[z][iLg]).split(';');
                                                    if (parseFloat((myData.rows[i][3])) >= parseFloat(LegArr[2]) && parseFloat((myData.rows[i][3])) <= parseFloat(LegArr[3])){
                                                        MyRows[iCount][3] = (LegArr[1]);
                                                        bFound = 1
                                                    }
                                                }
                                                else{
                                                    MyRows[iCount][3] = ('#ffffff');
                                                }
                                            }
                                            if (bFound == 0){
                                                MyRows[iCount][3] = ('#ffffff');
                                            }
                                        }
                                        else{
                                            MyRows[iCount][3] = ('#ffffff');
                                        }
                                    }
                                    else{
                                        MyRows[iCount][3] = ('#ffffff');
                                    }

                                    iHeaders = 0;

                                    for (var x=ouHierarchyOffSet; x<ParentArr.length; x++){
                                        MyRows[iCount][4 + iHeaders] = ParentArr[x];
                                        iHeaders += 1
                                    }

                                    MyRows[iCount][4 + iHeaders] = ArrDxGroupName[z];
                                    MyRows[iCount][4 + iHeaders+1] = MyRows[iCount][1];
                                    MyRows[iCount][4 + iHeaders+2] = ArrTypeName[z];
                                    MyRows[iCount][4 + iHeaders+3] = ReturnLookup(objNames,myData.rows[i][1]);

                                    var peArr = (ReturnLookup(objNames,myData.rows[i][1])).split(" ");

                                    for (var y=0; y<peArr.length; y++){
                                        MyRows[iCount][(7+iHeaders) + (y+1)] = peArr[y];
                                    }

                                    if (ArrDxIsIND[z]){

                                        /* START OF NUM/DENOM CALCULATIONS */
                                        var ArrN = ArrNumFormulaItems[z].split(';');
                                        var ArrD = ArrDenomFormulaItems[z].split(';');

                                        if (ArrN.length > 1){
                                            var sTempFormula = ArrNumFormula[z];
                                            for(var p = 0; p < (ArrN.length-1); p++) {
                                                var ArrFsub = (ArrN[p]).split(".");
                                                var sTempLookup = ArrFsub[0];
                                                sTempLookup = sTempLookup.replace(/{/g,'');
                                                sTempLookup = sTempLookup.replace(/}/g,'');
                                                sTempLookup = sTempLookup.replace(/#/g,'');
                                                iLookup = ReturnLookupValue(myData,sTempLookup,myData.rows[i][1],myData.rows[i][2])
                                                iLookup = ((iLookup || '').toString().length == 0 ? 0 : iLookup);
                                                if (sTempFormula.indexOf(ArrFsub[0] + '.' + ArrFsub[1]) < 0){
                                                    sTempFormula = sTempFormula.replace(sTempLookup,iLookup);
                                                }
                                                else{
                                                    sTempFormula = sTempFormula.replace(ArrFsub[0] + '.' + ArrFsub[1],iLookup);					
                                                }
                                            }
                                            sTempFormula = sTempFormula.replace(/{/g,'(');
                                            sTempFormula = sTempFormula.replace(/}/g,')');
                                            sTempFormula = sTempFormula.replace(/#/g,'');
                                            iNumTotal = eval(sTempFormula);
                                            //console.log(ArrTypeName[z] + ' NUM: ' + ArrNumFormula[z] + ' = ' + sTempFormula + ' [' + iNumTotal + ']');
                                        }
                                        else{
                                            if ((ArrNumFormula[z]).indexOf('{') >= 0){
                                                var ArrFsub = ArrNumFormula[z].split(".")
                                                var sTempFormula = ArrFsub[0];
                                                sTempFormula = sTempFormula.replace(/{/g,'');
                                                sTempFormula = sTempFormula.replace(/}/g,'');
                                                sTempFormula = sTempFormula.replace(/#/g,'');
                                                iNumTotal = ReturnLookupValue(myData,sTempLookup,myData.rows[i][1],myData.rows[i][2]);
                                            }
                                            else
                                            {
                                                sTempFormula = ArrNumFormula[z];
                                                iNumTotal = eval(sTempFormula);
                                            }
                                            //console.log(ArrTypeName[z] + ' NUM: ' + ArrNumFormula[z] + ' = ' + sTempFormula + ' [' + iNumTotal + ']');
                                        }

                                        if (ArrD.length > 1){
                                            var sTempFormula = ArrDenomFormula[z];
                                            for(var p = 0; p < (ArrD.length-1); p++) {
                                                var ArrFsub = (ArrD[p]).split(".");
                                                var sTempLookup = ArrFsub[0];
                                                sTempLookup = sTempLookup.replace(/{/g,'');
                                                sTempLookup = sTempLookup.replace(/}/g,'');
                                                sTempLookup = sTempLookup.replace(/#/g,'');
                                                iLookup = ReturnLookupValue(myData,sTempLookup,myData.rows[i][1],myData.rows[i][2]);
                                                iLookup = ((iLookup || '').toString().length == 0 ? 0 : iLookup);
                                                if (sTempFormula.indexOf(ArrFsub[0] + '.' + ArrFsub[1]) < 0){
                                                    sTempFormula = sTempFormula.replace(sTempLookup,iLookup);
                                                }
                                                else{
                                                    sTempFormula = sTempFormula.replace(ArrFsub[0] + '.' + ArrFsub[1],iLookup);					
                                                }
                                            }
                                            sTempFormula = sTempFormula.replace(/{/g,'(');
                                            sTempFormula = sTempFormula.replace(/}/g,')');
                                            sTempFormula = sTempFormula.replace(/#/g,'');
                                            iDenTotal = eval(sTempFormula);
                                            //console.log(ArrTypeName[z] + ' DEN: ' + ArrDenomFormula[z] + ' = ' + sTempFormula + ' [' + iDenTotal + ']');
                                        }
                                        else{
                                            if ((ArrDenomFormula[z]).indexOf('{') >= 0){
                                                var ArrFsub = ArrDenomFormula[z].split(".")
                                                var sTempFormula = ArrFsub[0];
                                                sTempFormula = sTempFormula.replace(/{/g,'');
                                                sTempFormula = sTempFormula.replace(/}/g,'');
                                                sTempFormula = sTempFormula.replace(/#/g,'');
                                                iDenTotal = ReturnLookupValue(myData,sTempLookup,myData.rows[i][1],myData.rows[i][2]);
                                            }
                                            else
                                            {
                                                sTempFormula = ArrDenomFormula[z];
                                                iDenTotal = eval(sTempFormula);
                                            }
                                            //console.log(ArrTypeName[z] + ' DEN: ' + ArrDenomFormula[z] + ' = ' + sTempFormula + ' [' + iDenTotal + ']');
                                        }
                                    }
                                    else{
                                        iNumTotal = parseFloat((myData.rows[i][3]).replace('.0',''));
                                        iDenTotal = 1;
                                    }

                                    //MyRows[iCount][7+iHeaders + (peArr.length) + 1] = ((ArrDxIsIND[z] == 0) ? '' : iNumTotal);
                                    //MyRows[iCount][7+iHeaders + (peArr.length) + 2] = ((ArrDxIsIND[z] == 0) ? '' : iDenTotal);
                                    MyRows[iCount][7+iHeaders + (peArr.length) + 1] = iNumTotal;
                                    MyRows[iCount][7+iHeaders + (peArr.length) + 2] = iDenTotal;
                                    MyRows[iCount][7+iHeaders + (peArr.length) + 3] = parseFloat((myData.rows[i][3]).replace('.0',''));
                                    
                                    iCount += 1;
                                }
                            }

                            function mySortingA(a,b) {
                                a = a[0]+a[1]+a[2];
                                b = b[0]+b[1]+b[2];
                                return a == b ? 0 : (a < b ? -1 : 1)
                            }

                            function mySortingAsc(a,b) {
                                a = a[1]+a[a.length-1];
                                b = b[1]+b[b.length-1];
                                return a == b ? 0 : (a < b ? -1 : 1)
                            }

                            function mySortingDesc(a,b) {
                                a = a[1]+a[a.length-1];
                                b = b[1]+b[b.length-1];
                                return a == b ? 0 : (a < b ? -1 : 1)
                            }

                            if (pRank == 1){
                                MyRows.sort(mySortingAsc);
                            }
                            else{
                                if (pRank == -1){
                                    MyRows.sort(mySortingDesc);
                                }
                                else{
                                    MyRows.sort(mySortingA);
                                }
                            }

                            var sReturn = '<table class="pivot displaydensity-comfortable">';
                            sReturn += makeTableHEADER(MyHeaders);
                            sReturn += makeTableBODY(MyRows);
                            sReturn += '</table>';

                            if (sDestination) {
                                $(sDestination).html(sReturn);
                            }

                            if (callbackFn) {
                                callbackFn(sReturn);
                            }
                        });                        

                    // end of indicator "done"
                    });
                };

                makeTableHEADER = function(myArray) {
                    var result = "<thead>";
                    result += "<tr>";
                    for(var i = 4; i < (myArray.length); i++) {
                        result += "<th class='pivot-dim-label'>" + myArray[i] + "</th>";
                    }
                    result += "</tr>";
                    result += "</thead>";
                    return result;
                };

                makeTableBODY = function(myMultiDimensionArray) {
                    var result = "<tbody>";
                    for(var i = 0; i < myMultiDimensionArray.length; i++) {
                        result += "<tr>";
                        for (var j = 4; j < myMultiDimensionArray[i].length; j++) {
                            result += "<td style='white-space: normal;" + ((j == (myMultiDimensionArray[i].length-1)) ? "background-color:" + myMultiDimensionArray[i][3] + ";" : "") + "'>" + myMultiDimensionArray[i][j] + "</td>";
                        }
                        result += "</tr>";
                    }
                    result += "</tbody>";
                    return result;
                };

                ReturnLookupValue = function(theData, dx, pe, ou) {
                    for (var i = 0; i < theData.rows.length; i++) {
                        if ((theData.rows[i][0] === dx) && (theData.rows[i][1] === pe) && (theData.rows[i][2] === ou)) {
                            return theData.rows[i][3];
                        }
                    }
                };

                ReturnLookup = function(theData,val) {
                    return theData[val];
                };

                GetOUlevelName = function(OUlevelJ, iOU) {
                    for (i = 0; i < OUlevelJ.length; i++) {
                        if (OUlevelJ[i].level == iOU) {
                            return OUlevelJ[i].name;
                        }                        
                    }
                };

                formatNumber = function(num) {
                    return ("" + num).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, function($1) { return $1 + "," });
                };

                BuildOutputReport();
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
