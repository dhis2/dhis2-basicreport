Ext.onReady( function() {
	var NS = PT,

		LayoutWindow,
		OptionsWindow,
		FavoriteWindow,
		SharingWindow,
		InterpretationWindow,
        AboutWindow,

		extendCore,
		createViewport,
		dimConf,

		ns = {
			core: {},
			app: {}
		};

	// set app config
	(function() {

		// ext configuration
		Ext.QuickTips.init();

		Ext.override(Ext.LoadMask, {
			onHide: function() {
				this.callParent();
			}
		});

        Ext.override(Ext.grid.Scroller, {
            afterRender: function() {
                var me = this;
                me.callParent();
                me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
                Ext.cache[me.el.id].skipGarbageCollection = true;
                // add another scroll event listener to check, if main listeners is active
                Ext.EventManager.addListener(me.scrollEl, 'scroll', me.onElScrollCheck, me);
                // ensure this listener doesn't get removed
                Ext.cache[me.scrollEl.id].skipGarbageCollection = true;
            },

            // flag to check, if main listeners is active
            wasScrolled: false,

            // synchronize the scroller with the bound gridviews
            onElScroll: function(event, target) {
                this.wasScrolled = true; // change flag -> show that listener is alive
                this.fireEvent('bodyscroll', event, target);
            },

            // executes just after main scroll event listener and check flag state
            onElScrollCheck: function(event, target, options) {
                var me = this;

                if (!me.wasScrolled) {
                    // Achtung! Event listener was disappeared, so we'll add it again
                    me.mon(me.scrollEl, 'scroll', me.onElScroll, me);
                }
                me.wasScrolled = false; // change flag to initial value
            }

        });

        Ext.override(Ext.data.TreeStore, {
            load: function(options) {
                options = options || {};
                options.params = options.params || {};

                var me = this,
                    node = options.node || me.tree.getRootNode(),
                    root;

                // If there is not a node it means the user hasnt defined a rootnode yet. In this case lets just
                // create one for them.
                if (!node) {
                    node = me.setRootNode({
                        expanded: true
                    });
                }

                if (me.clearOnLoad) {
                    node.removeAll(true);
                }

                options.records = [node];

                Ext.applyIf(options, {
                    node: node
                });
                //options.params[me.nodeParam] = node ? node.getId() : 'root';

                if (node) {
                    node.set('loading', true);
                }

                return me.callParent([options]);
            }
        });

		// right click handler
		document.body.oncontextmenu = function() {
			return false;
		};
	}());

	// constructors
	OptionsWindow = function() {
		var displayDensity,
			fontSize,
            digitGroupSeparator,
            legendSet,
			
			style,

			comboboxWidth = 262,
            comboBottomMargin = 1,
            checkboxBottomMargin = 2,
            separatorTopMargin = 6,
			window;

		displayDensity = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin-bottom:' + comboBottomMargin + 'px',
			width: comboboxWidth,
			labelWidth: 130,
			fieldLabel: NS.i18n.display_density,
			labelStyle: 'color:#333',
			queryMode: 'local',
			valueField: 'id',
			editable: false,
			value: 'normal',
			store: Ext.create('Ext.data.Store', {
				fields: ['id', 'text'],
				data: [
					{id: 'COMPACT', text: NS.i18n.compact},
					{id: 'NORMAL', text: NS.i18n.normal},
					{id: 'COMFORTABLE', text: NS.i18n.comfortable}
				]
			})
		});

		fontSize = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin-bottom:' + comboBottomMargin + 'px',
			width: comboboxWidth,
			labelWidth: 130,
			fieldLabel: NS.i18n.font_size,
			labelStyle: 'color:#333',
			queryMode: 'local',
			valueField: 'id',
			editable: false,
			value: 'normal',
			store: Ext.create('Ext.data.Store', {
				fields: ['id', 'text'],
				data: [
					{id: 'LARGE', text: NS.i18n.large},
					{id: 'NORMAL', text: NS.i18n.normal},
					{id: 'SMALL', text: NS.i18n.small_}
				]
			})
		});

		digitGroupSeparator = Ext.create('Ext.form.field.ComboBox', {
			labelStyle: 'color:#333',
			cls: 'ns-combo',
			style: 'margin-bottom:' + comboBottomMargin + 'px',
			width: comboboxWidth,
			labelWidth: 130,
			fieldLabel: NS.i18n.digit_group_separator,
			queryMode: 'local',
			valueField: 'id',
			editable: false,
			value: 'space',
			store: Ext.create('Ext.data.Store', {
				fields: ['id', 'text'],
				data: [
					{id: 'COMMA', text: 'Comma'},
					{id: 'SPACE', text: 'Space'},
					{id: 'NONE', text: 'None'}
				]
			})
		});

		legendSet = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin-bottom:' + comboBottomMargin + 'px',
			width: comboboxWidth,
			labelWidth: 130,
			fieldLabel: NS.i18n.legend_set,
			labelStyle: 'color:#333',
			valueField: 'id',
			displayField: 'name',
			editable: false,
			value: 0,
			store: ns.app.stores.legendSet
		});

		style = {
			bodyStyle: 'border:0 none',
			style: 'margin-left:14px',
			items: [
				displayDensity,
				fontSize,
				digitGroupSeparator,
				legendSet
			]
		};

		window = Ext.create('Ext.window.Window', {
			title: NS.i18n.table_options,
			bodyStyle: 'background-color:#fff; padding:2px 2px 1px',
			closeAction: 'hide',
			autoShow: true,
			modal: true,
			resizable: false,
			hideOnBlur: true,
			getOptions: function() {
				return {
					displayDensity: displayDensity.getValue(),
					fontSize: fontSize.getValue(),
					digitGroupSeparator: digitGroupSeparator.getValue(),
					legendSet: {id: legendSet.getValue()}
				};
			},
			setOptions: function(layout) {
                displayDensity.setValue(Ext.isString(layout.displayDensity) ? layout.displayDensity : 'normal');
				fontSize.setValue(Ext.isString(layout.fontSize) ? layout.fontSize : 'normal');
				digitGroupSeparator.setValue(Ext.isString(layout.digitGroupSeparator) ? layout.digitGroupSeparator : 'space');
				legendSet.setValue(Ext.isObject(layout.legendSet) && Ext.isString(layout.legendSet.id) ? layout.legendSet.id : 0);
			},
			items: [
				{
					bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
					style: 'margin-top:4px; margin-bottom:6px; margin-left:5px',
					html: NS.i18n.style
				},
				style
			],
			bbar: [
				'->',
				{
					text: NS.i18n.hide,
					handler: function() {
						window.hide();
					}
				},
				{
					text: '<b>' + NS.i18n.update + '</b>',
					handler: function() {
						var config = ns.core.web.report.getLayoutConfig(),
							layout = ns.core.api.layout.Layout(config);

						if (!layout) {
							return;
						}

						ns.core.web.report.createReport(layout, false);

						window.hide();
					}
				}
			],
			listeners: {
				show: function(w) {
					if (ns.app.optionsButton.rendered) {
						ns.core.web.window.setAnchorPosition(w, ns.app.optionsButton);

						if (!w.hasHideOnBlurHandler) {
							ns.core.web.window.addHideOnBlurHandler(w);
						}
					}

					if (!legendSet.store.isLoaded) {
						legendSet.store.load();
					}

					// cmp
					w.displayDensity = displayDensity;
					w.fontSize = fontSize;
					w.digitGroupSeparator = digitGroupSeparator;
					w.legendSet = legendSet;
				}
			}
		});

		return window;
	};

	AboutWindow = function() {
		return Ext.create('Ext.window.Window', {
			title: NS.i18n.about,
			bodyStyle: 'background:#fff; padding:6px',
			modal: true,
            resizable: false,
			hideOnBlur: true,
			listeners: {
				show: function(w) {
					ns.ajax({
						url: ns.core.init.contextPath + '/api/system/info.json',
						success: function(r) {
							var info = Ext.decode(r.responseText),
								divStyle = 'padding:3px',
								html = '<div class="user-select">';

							if (Ext.isObject(info)) {
								html += '<div style="' + divStyle + '"><b>' + NS.i18n.time_since_last_data_update + ': </b>' + info.intervalSinceLastAnalyticsTableSuccess + '</div>';
								html += '<div style="' + divStyle + '"><b>' + NS.i18n.version + ': </b>' + info.version + '</div>';
								html += '<div style="' + divStyle + '"><b>' + NS.i18n.revision + ': </b>' + info.revision + '</div>';
                                html += '<div style="' + divStyle + '"><b>' + NS.i18n.username + ': </b>' + ns.core.init.userAccount.username + '</div>';
                                html += '</div>';
							}
							else {
								html += 'No system info found';
							}

							w.update(html);
						},
						failure: function(r) {
							w.update(r.status + '\n' + r.statusText + '\n' + r.responseText);
						},
                        callback: function() {
                            document.body.oncontextmenu = true;

                            if (ns.app.aboutButton.rendered) {
                                ns.core.web.window.setAnchorPosition(w, ns.app.aboutButton);

                                if (!w.hasHideOnBlurHandler) {
                                    ns.core.web.window.addHideOnBlurHandler(w);
                                }
                            }
                        }
					});
				},
                hide: function() {
                    document.body.oncontextmenu = function() {
                        return false;
                    };
                },
                destroy: function() {
                    document.body.oncontextmenu = function() {
                        return false;
                    };
                }
			}
		});
	};

	// core
	extendCore = function(core) {
        var init = core.init,
            conf = core.conf,
			api = core.api,
			support = core.support,
			service = core.service,
			web = core.web,
            dimConf = conf.finals.dimension;

        // init
        (function() {

			// root nodes
			for (var i = 0; i < init.rootNodes.length; i++) {
				init.rootNodes[i].expanded = true;
				init.rootNodes[i].path = '/' + conf.finals.root.id + '/' + init.rootNodes[i].id;
			}

			// sort organisation unit levels
			if (Ext.isArray(init.organisationUnitLevels)) {
				support.prototype.array.sort(init.organisationUnitLevels, 'ASC', 'level');
			}
		}());

		// web
		(function() {

			// multiSelect
			web.multiSelect = web.multiSelect || {};

			web.multiSelect.select = function(a, s) {
				var selected = a.getValue();
				if (selected.length) {
					var array = [];
					Ext.Array.each(selected, function(item) {
                        array.push(a.store.getAt(a.store.findExact('id', item)));
					});
					s.store.add(array);
				}
				this.filterAvailable(a, s);
			};

			web.multiSelect.selectAll = function(a, s, isReverse) {
                var array = a.store.getRange();
				if (isReverse) {
					array.reverse();
				}
				s.store.add(array);
				this.filterAvailable(a, s);
			};

			web.multiSelect.unselect = function(a, s) {
				var selected = s.getValue();
				if (selected.length) {
					Ext.Array.each(selected, function(id) {
						a.store.add(s.store.getAt(s.store.findExact('id', id)));
						s.store.remove(s.store.getAt(s.store.findExact('id', id)));
					});
					this.filterAvailable(a, s);
                    a.store.sortStore();
				}
			};

			web.multiSelect.unselectAll = function(a, s) {
				a.store.add(s.store.getRange());
				s.store.removeAll();
				this.filterAvailable(a, s);
                a.store.sortStore();
			};

			web.multiSelect.filterAvailable = function(a, s) {
				if (a.store.getRange().length && s.store.getRange().length) {
					var recordsToRemove = [];

					a.store.each( function(ar) {
						var removeRecord = false;

						s.store.each( function(sr) {
							if (sr.data.id === ar.data.id) {
								removeRecord = true;
							}
						});

						if (removeRecord) {
							recordsToRemove.push(ar);
						}
					});

					a.store.remove(recordsToRemove);
				}
			};

			web.multiSelect.setHeight = function(ms, panel, fill) {
				for (var i = 0, height; i < ms.length; i++) {
					height = panel.getHeight() - fill - (ms[i].hasToolbar ? 25 : 0);
					ms[i].setHeight(height);
				}
			};

			// url
			web.url = web.url || {};

			web.url.getParam = function(s) {
				var output = '';
				var href = window.location.href;
				if (href.indexOf('?') > -1 ) {
					var query = href.substr(href.indexOf('?') + 1);
					var query = query.split('&');
					for (var i = 0; i < query.length; i++) {
						if (query[i].indexOf('=') > -1) {
							var a = query[i].split('=');
							if (a[0].toLowerCase() === s) {
								output = a[1];
								break;
							}
						}
					}
				}
				return unescape(output);
			};

			// storage
			web.storage = web.storage || {};

				// internal
			web.storage.internal = web.storage.internal || {};

			web.storage.internal.add = function(store, storage, parent, records) {
				if (!Ext.isObject(store)) {
					console.log('support.storeage.add: store is not an object');
					return null;
				}

				storage = storage || store.storage;
				parent = parent || store.parent;

				if (!Ext.isObject(storage)) {
					console.log('support.storeage.add: storage is not an object');
					return null;
				}

				store.each( function(r) {
					if (storage[r.data.id]) {
						storage[r.data.id] = {id: r.data.id, name: r.data.name, parent: parent};
					}
				});

				if (support.prototype.array.getLength(records, true)) {
					Ext.Array.each(records, function(r) {
						if (storage[r.data.id]) {
							storage[r.data.id] = {id: r.data.id, name: r.data.name, parent: parent};
						}
					});
				}
			};

			web.storage.internal.load = function(store, storage, parent, records) {
				var a = [];

				if (!Ext.isObject(store)) {
					console.log('support.storeage.load: store is not an object');
					return null;
				}

				storage = storage || store.storage;
				parent = parent || store.parent;

				store.removeAll();

				for (var key in storage) {
					var record = storage[key];

					if (storage.hasOwnProperty(key) && record.parent === parent) {
						a.push(record);
					}
				}

				if (support.prototype.array.getLength(records)) {
					a = a.concat(records);
				}

				store.add(a);
				store.sort('name', 'ASC');
			};

				// session
			web.storage.session = web.storage.session || {};

			web.storage.session.set = function(layout, session, url) {
				if (NS.isSessionStorage) {
					var dhis2 = JSON.parse(sessionStorage.getItem('dhis2')) || {};
					dhis2[session] = layout;
					sessionStorage.setItem('dhis2', JSON.stringify(dhis2));

					if (Ext.isString(url)) {
						window.location.href = url;
					}
				}
			};

            // document
            web.document = web.document || {};

            web.document.printResponseCSV = function(response) {
                var headers = response.headers,
                    names = response.metaData.names,
                    rows = response.rows,
                    csv = '',
                    alink;

                // headers
                for (var i = 0; i < headers.length; i++) {
                    csv += '"' + headers[i].column + '"' + (i < headers.length - 1 ? ',' : '\n');
                }

                // rows
                for (var i = 0; i < rows.length; i++) {
                    for (var j = 0, id, isMeta; j < rows[i].length; j++) {
                        val = rows[i][j];
                        isMeta = headers[j].meta;

                        csv += '"' + (isMeta && names[val] ? names[val] : val) + '"';
                        csv += j < rows[i].length - 1 ? ',' : '\n';
                    }
                }

                alink = document.createElement('a');
                alink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
                alink.setAttribute('download', 'data.csv');
                alink.click();
            };

			// mouse events
			web.events = web.events || {};

			web.events.setValueMouseHandlers = function(layout, response, uuidDimUuidsMap, uuidObjectMap) {
				var valueEl;

				for (var key in uuidDimUuidsMap) {
					if (uuidDimUuidsMap.hasOwnProperty(key)) {
						valueEl = Ext.get(key);

						if (valueEl && parseFloat(valueEl.dom.textContent)) {
							valueEl.dom.onValueMouseClick = web.events.onValueMouseClick;
							valueEl.dom.onValueMouseOver = web.events.onValueMouseOver;
							valueEl.dom.onValueMouseOut = web.events.onValueMouseOut;
							valueEl.dom.layout = layout;
							valueEl.dom.response = response;
							valueEl.dom.uuidDimUuidsMap = uuidDimUuidsMap;
							valueEl.dom.uuidObjectMap = uuidObjectMap;
							valueEl.dom.setAttribute('onclick', 'this.onValueMouseClick(this.layout, this.response, this.uuidDimUuidsMap, this.uuidObjectMap, this.id);');
							valueEl.dom.setAttribute('onmouseover', 'this.onValueMouseOver(this);');
							valueEl.dom.setAttribute('onmouseout', 'this.onValueMouseOut(this);');
						}
					}
				}
			};

			web.events.onValueMouseClick = function(layout, response, uuidDimUuidsMap, uuidObjectMap, uuid) {
				var uuids = uuidDimUuidsMap[uuid],
					layoutConfig = Ext.clone(layout),
					parentGraphMap = ns.app.viewport.treePanel.getParentGraphMap(),
					objects = [],
					menu;

				// modify layout dimension items based on uuid objects

				// get objects
				for (var i = 0; i < uuids.length; i++) {
					objects.push(uuidObjectMap[uuids[i]]);
				}

				// clear layoutConfig dimension items
				for (var i = 0, a = Ext.Array.clean([].concat(layoutConfig.columns || [], layoutConfig.rows || [])); i < a.length; i++) {
					a[i].items = [];
				}

				// add new items
				for (var i = 0, obj, axis; i < objects.length; i++) {
					obj = objects[i];

					axis = obj.axis === 'col' ? layoutConfig.columns || [] : layoutConfig.rows || [];

					if (axis.length) {
						axis[obj.dim].items.push({
							id: obj.id,
							name: response.metaData.names[obj.id]
						});
					}
				}

				// parent graph map
				layoutConfig.parentGraphMap = {};

				for (var i = 0, id; i < objects.length; i++) {
					id = objects[i].id;

					if (parentGraphMap.hasOwnProperty(id)) {
						layoutConfig.parentGraphMap[id] = parentGraphMap[id];
					}
				}

				// menu
				menu = Ext.create('Ext.menu.Menu', {
					shadow: true,
					showSeparator: false,
					items: [
						{
							text: 'Open selection as chart' + '&nbsp;&nbsp;', //i18n
							iconCls: 'ns-button-icon-chart',
							param: 'chart',
							handler: function() {
								web.storage.session.set(layoutConfig, 'analytical', init.contextPath + '/dhis-web-visualizer/index.html?s=analytical');
							},
							listeners: {
								render: function() {
									this.getEl().on('mouseover', function() {
										web.events.onValueMenuMouseHover(uuidDimUuidsMap, uuid, 'mouseover', 'chart');
									});

									this.getEl().on('mouseout', function() {
										web.events.onValueMenuMouseHover(uuidDimUuidsMap, uuid, 'mouseout', 'chart');
									});
								}
							}
						},
						{
							text: 'Open selection as map' + '&nbsp;&nbsp;', //i18n
							iconCls: 'ns-button-icon-map',
							param: 'map',
							disabled: true,
							handler: function() {
								web.storage.session.set(layoutConfig, 'analytical', init.contextPath + '/dhis-web-mapping/index.html?s=analytical');
							},
							listeners: {
								render: function() {
									this.getEl().on('mouseover', function() {
										web.events.onValueMenuMouseHover(uuidDimUuidsMap, uuid, 'mouseover', 'map');
									});

									this.getEl().on('mouseout', function() {
										web.events.onValueMenuMouseHover(uuidDimUuidsMap, uuid, 'mouseout', 'map');
									});
								}
							}
						}
					]
				});

				menu.showAt(function() {
					var el = Ext.get(uuid),
						xy = el.getXY();

					xy[0] += el.getWidth() - 5;
					xy[1] += el.getHeight() - 5;

					return xy;
				}());
			};

			web.events.onValueMouseOver = function(uuid) {
				Ext.get(uuid).addCls('highlighted');
			};

			web.events.onValueMouseOut = function(uuid) {
				Ext.get(uuid).removeCls('highlighted');
			};

			web.events.onValueMenuMouseHover = function(uuidDimUuidsMap, uuid, event, param) {
				var dimUuids;

				// dimension elements
				if (param === 'chart') {
					if (Ext.isString(uuid) && Ext.isArray(uuidDimUuidsMap[uuid])) {
						dimUuids = uuidDimUuidsMap[uuid];

						for (var i = 0, el; i < dimUuids.length; i++) {
							el = Ext.get(dimUuids[i]);

							if (el) {
								if (event === 'mouseover') {
									el.addCls('highlighted');
								}
								else if (event === 'mouseout') {
									el.removeCls('highlighted');
								}
							}
						}
					}
				}
			};

			web.events.setColumnHeaderMouseHandlers = function(layout, xResponse) {
				if (Ext.isArray(xResponse.sortableIdObjects)) {
					for (var i = 0, obj, el; i < xResponse.sortableIdObjects.length; i++) {
						obj = xResponse.sortableIdObjects[i];
						el = Ext.get(obj.uuid);

						el.dom.layout = layout;
						el.dom.xResponse = xResponse;
						el.dom.metaDataId = obj.id;
						el.dom.onColumnHeaderMouseClick = web.events.onColumnHeaderMouseClick;
						el.dom.onColumnHeaderMouseOver = web.events.onColumnHeaderMouseOver;
						el.dom.onColumnHeaderMouseOut = web.events.onColumnHeaderMouseOut;

						el.dom.setAttribute('onclick', 'this.onColumnHeaderMouseClick(this.layout, this.xResponse, this.metaDataId)');
						el.dom.setAttribute('onmouseover', 'this.onColumnHeaderMouseOver(this)');
						el.dom.setAttribute('onmouseout', 'this.onColumnHeaderMouseOut(this)');
					}
				}
			};

			web.events.onColumnHeaderMouseClick = function(layout, xResponse, id) {
				if (layout.sorting && layout.sorting.id === id) {
					layout.sorting.direction = support.prototype.str.toggleDirection(layout.sorting.direction);
				}
				else {
					layout.sorting = {
						id: id,
						direction: 'DESC'
					};
				}

                web.mask.show(ns.app.centerRegion, 'Sorting...');

                Ext.defer(function() {
                    web.report.createReport(layout, null, xResponse, false);
                }, 10);
			};

			web.events.onColumnHeaderMouseOver = function(el) {
				Ext.get(el).addCls('pointer highlighted');
			};

			web.events.onColumnHeaderMouseOut = function(el) {
				Ext.get(el).removeCls('pointer highlighted');
			};

			// report
			web.report = web.report || {};

			web.report.getLayoutConfig = function() {
				var panels = ns.app.accordion.panels,
					config = ns.app.optionsWindow.getOptions(),
                    dx = dimConf.data.dimensionName,
                    map = dimConf.objectNameMap;

				config.columns = [];
                config.rows = [];
                config.dataDimensionItems = [];

				// panel data
				for (var i = 0, dim, dimName; i < panels.length; i++) {
					dim = panels[i].getDimension();
                    
					if (dim) {
                        if (dim.dimension === dx) {

                            // columns
                            config.columns.push(dim);

                            // dataDimensionItems
                            for (var j = 0, item, ddi; j < dim.items.length; j++) {
                                ddi = {};
                                item = dim.items[j];

                                ddi[map[item.objectName].value] = item;                                

                                config.dataDimensionItems.push(ddi);
                            }
                        }
                        else {

                            // rows
                            config.rows.push(dim);
                        }
					}
				}
                
				return config;
			};

			web.report.loadTable = function(id) {
				if (!Ext.isString(id)) {
					console.log('Invalid report table id');
					return;
				}

				ns.ajax({
					url: init.contextPath + '/api/reportTables/' + id + '.json?fields=' + conf.url.analysisFields.join(','),
					failure: function(r) {
						web.mask.hide(ns.app.centerRegion);

                        r = Ext.decode(r.responseText);

                        if (Ext.Array.contains([403], parseInt(r.httpStatusCode))) {
                            r.message = NS.i18n.you_do_not_have_access_to_all_items_in_this_favorite || r.message;
                        }

                        ns.alert(r);
					},
					success: function(r) {
						var layoutConfig = Ext.decode(r.responseText),
							layout = api.layout.Layout(layoutConfig);

						if (layout) {
							web.report.getData(layout, true);
						}
					}
				});
			};

			web.report.getData = function(layout, isUpdateGui) {
				var xLayout,
					paramString,
                    sortedParamString,
                    onFailure;

				if (!layout) {
					return;
				}

                onFailure = function(r) {
                    ns.app.viewport.setGui(layout, xLayout, isUpdateGui);
                    web.mask.hide(ns.app.centerRegion);

                    if (r) {
                        r = Ext.decode(r.responseText);

                        if (Ext.Array.contains([413, 414], parseInt(r.httpStatusCode))) {
                            web.analytics.validateUrl(init.contextPath + '/api/analytics.json' + paramString);
                        }
                        else {
                            ns.alert(r);
                        }
                    }
                };

				xLayout = service.layout.getExtendedLayout(layout);
				paramString = web.analytics.getParamString(xLayout) + '&skipData=true';
				sortedParamString = web.analytics.getParamString(xLayout, true) + '&skipMeta=true';

				// show mask
				web.mask.show(ns.app.centerRegion);

                // timing
                ns.app.dateData = new Date();

                ns.ajax({
					url: init.contextPath + '/api/analytics.json' + paramString,
					timeout: 60000,
					headers: {
						'Content-Type': 'application/json',
						'Accepts': 'application/json'
					},
					disableCaching: false,
					failure: function(r) {
                        onFailure(r);
					},
					success: function(r) {
                        var metaData = Ext.decode(r.responseText).metaData;

                        ns.ajax({
                            url: init.contextPath + '/api/analytics.json' + sortedParamString,
                            timeout: 60000,
                            headers: {
                                'Content-Type': 'application/json',
                                'Accepts': 'application/json'
                            },
                            disableCaching: false,
                            failure: function(r) {
                                onFailure(r);
                            },
                            success: function(r) {
                                ns.app.dateCreate = new Date();

                                var response = api.response.Response(Ext.decode(r.responseText));

                                if (!response) {
                                    onFailure();
                                    return;
                                }

                                response.metaData = metaData;

                                ns.app.paramString = sortedParamString;

                                web.report.createReport(layout, response, null, isUpdateGui);
                            }
                        });
                    }
                });
			};

			web.report.createReport = function(layout) {
                web.mask.show(ns.app.centerRegion);
                
                web.report.getHtml(layout, function(html) {
                    ns.app.centerRegion.removeAll(true);
                    ns.app.centerRegion.update(html);

                    // after render
                    ns.app.layout = layout;

                    if (NS.isDebug) {
                        console.log("RENDER", (ns.app.dateTotal - ns.app.dateRender) / 1000);
                        console.log(ns.app.layout);
                    }

                    web.mask.hide(ns.app.centerRegion);
                });
			};
		}());
	};

	// viewport
	createViewport = function() {
        var indicatorAvailableStore,
            indicatorGroupStore,
			dataElementAvailableStore,
			dataElementGroupStore,
			dataSetAvailableStore,
            //eventDataItemAvailableStore,
            //programIndicatorAvailableStore,
            //programStore,
            dataSelectedStore,
			periodTypeStore,
			fixedPeriodAvailableStore,
			fixedPeriodSelectedStore,
			//reportTableStore,
			organisationUnitLevelStore,
			organisationUnitGroupStore,
			legendSetStore,

            isScrolled,
            onDataTypeSelect,
            dataType,
            dataSelected,

            indicatorLabel,
            indicatorSearch,
            indicatorFilter,
            indicatorGroup,
            indicatorAvailable,
            indicatorSelected,
            indicator,
			dataElementLabel,
            dataElementSearch,
            dataElementFilter,
            dataElementAvailable,
            dataElementSelected,
            dataElementGroup,
            dataElementDetailLevel,
            dataElement,
            dataSetLabel,
            dataSetSearch,
            dataSetFilter,
            dataSetAvailable,
            dataSetSelected,
            dataSet,
            //onEventDataItemProgramSelect,
            //eventDataItemProgram,
            //eventDataItemLabel,
            //eventDataItemSearch,
            //eventDataItemFilter,
            //eventDataItemAvailable,
            //eventDataItemSelected,
            //eventDataItem,
            //onProgramIndicatorProgramSelect,
            //programIndicatorProgram,
            //programIndicatorLabel,
            //programIndicatorSearch,
            //programIndicatorFilter,
            //programIndicatorAvailable,
            //programIndicatorSelected,
            //programIndicator,
            data,

			rewind,
            relativePeriodDefaults,
            relativePeriod,
            fixedPeriodAvailable,
            fixedPeriodSelected,
            onPeriodTypeSelect,
            periodType,
            period,
            treePanel,
            userOrganisationUnit,
            userOrganisationUnitChildren,
            userOrganisationUnitGrandChildren,
            organisationUnitLevel,
            organisationUnitGroup,
            toolMenu,
            tool,
            toolPanel,
            organisationUnit,
            dimensionPanelMap = {},
			//getDimensionPanel,
			//getDimensionPanels,
			update,

			accordionBody,
            accordion,
            westRegion,
            layoutButton,
            optionsButton,
            favoriteButton,
            getParamString,
            openTableLayoutTab,
            openPlainDataSource,
            downloadButton,
            interpretationItem,
            pluginItem,
            favoriteUrlItem,
            apiUrlItem,
            shareButton,
            aboutButton,
            defaultButton,
            centerRegion,
            setGui,
            viewport,

			accordionPanels = [],

            dimConf = ns.core.conf.finals.dimension;

		ns.app.stores = ns.app.stores || {};

		indicatorAvailableStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'objectName'],
            lastPage: null,
            nextPage: 1,
            isPending: false,
            reset: function() {
                this.removeAll();
                this.lastPage = null;
                this.nextPage = 1;
                this.isPending = false;
                indicatorSearch.hideFilter();
            },
            loadDataAndUpdate: function(data, append) {
                ns.core.support.prototype.array.addObjectProperty(data, 'objectName', dimConf.indicator.objectName);
                
                this.clearFilter(); // work around
                this.loadData(data, append);
                this.updateFilter();
            },
            getRecordsByIds: function(ids) {
                var records = [];

                ids = Ext.Array.from(ids);

                for (var i = 0, index; i < ids.length; i++) {
                    index = this.findExact('id', ids[i]);

                    if (index !== -1) {
                        records.push(this.getAt(index));
                    }
                }

                return records;
            },
            updateFilter: function() {
                var selectedStoreIds = dataSelectedStore.getIds();

                this.clearFilter();

                this.filterBy(function(record) {
                    return !Ext.Array.contains(selectedStoreIds, record.data.id);
                });
            },
            loadPage: function(uid, filter, append, noPaging, fn) {
                var store = this,
					params = {},
                    path;

                uid = (Ext.isString(uid) || Ext.isNumber(uid)) ? uid : indicatorGroup.getValue();
                filter = filter || indicatorFilter.getValue() || null;

                if (!append) {
                    this.lastPage = null;
                    this.nextPage = 1;
                }

                if (store.nextPage === store.lastPage) {
                    return;
                }

				if (Ext.isString(uid)) {
					path = '/indicators.json?fields=id,' + ns.core.init.namePropertyUrl + '&filter=indicatorGroups.id:eq:' + uid + (filter ? '&filter=name:like:' + filter : '');
				}
				else if (uid === 0) {
					path = '/indicators.json?fields=id,' + ns.core.init.namePropertyUrl + '' + (filter ? '&filter=name:like:' + filter : '');
				}

				if (!path) {
					return;
				}

				if (noPaging) {
					params.paging = false;
				}
				else {
					params.page = store.nextPage;
					params.pageSize = 50;
				}

                store.isPending = true;
                ns.core.web.mask.show(indicatorAvailable.boundList);

                ns.ajax({
                    url: ns.core.init.contextPath + '/api' + path,
                    params: params,
                    success: function(r) {
                        var response = Ext.decode(r.responseText),
                            data = response.indicators || [],
                            pager = response.pager;

                        store.loadStore(data, pager, append, fn);
                    },
                    callback: function() {
                        store.isPending = false;
                        ns.core.web.mask.hide(indicatorAvailable.boundList);
                    }
                });
            },
            loadStore: function(data, pager, append, fn) {
				pager = pager || {};

                this.loadDataAndUpdate(data, append);
                this.sortStore();

                this.lastPage = this.nextPage;

                if (pager.pageCount > this.nextPage) {
                    this.nextPage++;
                }

                this.isPending = false;

                //ns.core.web.multiSelect.filterAvailable({store: indicatorAvailableStore}, {store: indicatorSelectedStore});

                if (fn) {
					fn();
				}
            },
			storage: {},
			parent: null,
			sortStore: function() {
				this.sort('name', 'ASC');
			}
		});
		ns.app.stores.indicatorAvailable = indicatorAvailableStore;

		indicatorGroupStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'index'],
			proxy: {
				type: 'ajax',
				url: ns.core.init.contextPath + '/api/indicatorGroups.json?fields=id,name&paging=false',
                headers: {'Authorization': 'Basic ' + ns.ajax(null, null, true)},
				reader: {
					type: 'json',
					root: 'indicatorGroups'
				},
				pageParam: false,
				startParam: false,
				limitParam: false
			},
			listeners: {
				load: function(s) {
					s.add({
						id: 0,
						name: '[ ' + NS.i18n.all_indicators + ' ]',
						index: -1
					});
					s.sort([
						{
							property: 'index',
							direction: 'ASC'
						},
						{
							property: 'name',
							direction: 'ASC'
						}
					]);
				}
			}
		});
		ns.app.stores.indicatorGroup = indicatorGroupStore;

		dataElementAvailableStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
            lastPage: null,
            nextPage: 1,
            isPending: false,
            reset: function() {
                this.removeAll();
                this.lastPage = null;
                this.nextPage = 1;
                this.isPending = false;
                dataElementSearch.hideFilter();
            },
            loadDataAndUpdate: function(data, append) {
                this.clearFilter(); // work around
                this.loadData(data, append);
                this.updateFilter();
            },
            getRecordsByIds: function(ids) {
                var records = [];

                ids = Ext.Array.from(ids);

                for (var i = 0, index; i < ids.length; i++) {
                    index = this.findExact('id', ids[i]);

                    if (index !== -1) {
                        records.push(this.getAt(index));
                    }
                }

                return records;
            },
            updateFilter: function() {
                var selectedStoreIds = dataSelectedStore.getIds();

                this.clearFilter();

                if (selectedStoreIds.length) {
                    this.filterBy(function(record) {
                        return !Ext.Array.contains(selectedStoreIds, record.data.id);
                    });
                }
            },
            loadPage: function(uid, filter, append, noPaging, fn) {
                uid = (Ext.isString(uid) || Ext.isNumber(uid)) ? uid : dataElementGroup.getValue();
                filter = filter || dataElementFilter.getValue() || null;

                if (!append) {
                    this.lastPage = null;
                    this.nextPage = 1;
                }

                if (dataElementDetailLevel.getValue() === dimConf.dataElement.objectName) {
                    this.loadTotalsPage(uid, filter, append, noPaging, fn);
                }
                else if (dataElementDetailLevel.getValue() === dimConf.operand.objectName) {
                    this.loadDetailsPage(uid, filter, append, noPaging, fn);
                }
            },
            loadTotalsPage: function(uid, filter, append, noPaging, fn) {
                var store = this,
					params = {},
                    path;

                if (store.nextPage === store.lastPage) {
                    return;
                }

				if (Ext.isString(uid)) {
					path = '/dataElements.json?fields=id,' + ns.core.init.namePropertyUrl + '&filter=dataElementGroups.id:eq:' + uid + (filter ? '&filter=name:like:' + filter : '');
				}
				else if (uid === 0) {
					path = '/dataElements.json?fields=id,' + ns.core.init.namePropertyUrl + '&filter=domainType:eq:AGGREGATE' + '' + (filter ? '&filter=name:like:' + filter : '');
				}

				if (!path) {
					return;
				}

				if (noPaging) {
					params.paging = false;
				}
				else {
					params.page = store.nextPage;
					params.pageSize = 50;
				}

                store.isPending = true;
                ns.core.web.mask.show(dataElementAvailable.boundList);

                ns.ajax({
                    url: ns.core.init.contextPath + '/api' + path,
                    params: params,
                    success: function(r) {
                        var response = Ext.decode(r.responseText),
                            data = response.dataElements || [],
                            pager = response.pager;

                        store.loadStore(data, pager, append, fn);
                    },
                    callback: function() {
                        store.isPending = false;
                        ns.core.web.mask.hide(dataElementAvailable.boundList);
                    }
                });
            },
			loadDetailsPage: function(uid, filter, append, noPaging, fn) {
                var store = this,
					params = {},
                    path;

                if (store.nextPage === store.lastPage) {
                    return;
                }

				if (Ext.isString(uid)) {
					path = '/dataElementOperands.json?fields=id,' + ns.core.init.namePropertyUrl + '&filter=dataElement.dataElementGroups.id:eq:' + uid + (filter ? '&filter=name:like:' + filter : '');
				}
				else if (uid === 0) {
					path = '/dataElementOperands.json?fields=id,' + ns.core.init.namePropertyUrl + '' + (filter ? '&filter=name:like:' + filter : '');
				}

				if (!path) {
					return;
				}

				if (noPaging) {
					params.paging = false;
				}
				else {
					params.page = store.nextPage;
					params.pageSize = 50;
				}

                store.isPending = true;
                ns.core.web.mask.show(dataElementAvailable.boundList);

                ns.ajax({
                    url: ns.core.init.contextPath + '/api' + path,
                    params: params,
                    success: function(r) {
                        var response = Ext.decode(r.responseText),
							data = response.objects || response.dataElementOperands || [],
                            pager = response.pager;

                        store.loadStore(data, pager, append, fn);
                    },
                    callback: function() {
                        store.isPending = false;
                        ns.core.web.mask.hide(dataElementAvailable.boundList);
                    }
                });
			},
            loadStore: function(data, pager, append, fn) {
				pager = pager || {};

                this.loadDataAndUpdate(data, append);
                this.sortStore();

                this.lastPage = this.nextPage;

                if (pager.pageCount > this.nextPage) {
                    this.nextPage++;
                }

                this.isPending = false;

				//ns.core.web.multiSelect.filterAvailable({store: dataElementAvailableStore}, {store: dataElementSelectedStore});

                if (fn) {
					fn();
				}
            },
            sortStore: function() {
				this.sort('name', 'ASC');
			}
		});
		ns.app.stores.dataElementAvailable = dataElementAvailableStore;

		dataElementGroupStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'index'],
			proxy: {
				type: 'ajax',
				url: ns.core.init.contextPath + '/api/dataElementGroups.json?fields=id,' + ns.core.init.namePropertyUrl + '&paging=false',
                headers: {'Authorization': 'Basic ' + ns.ajax(null, null, true)},
				reader: {
					type: 'json',
					root: 'dataElementGroups'
				},
				pageParam: false,
				startParam: false,
				limitParam: false
			},
			listeners: {
				load: function(s) {
                    s.add({
                        id: 0,
                        name: '[ ' + NS.i18n.all_data_elements + ' ]',
                        index: -1
                    });

					s.sort([
						{property: 'index', direction: 'ASC'},
						{property: 'name', direction: 'ASC'}
					]);
				}
			}
		});
		ns.app.stores.dataElementGroup = dataElementGroupStore;

		dataSetAvailableStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
            lastPage: null,
            nextPage: 1,
            isPending: false,
            reset: function() {
                this.removeAll();
                this.lastPage = null;
                this.nextPage = 1;
                this.isPending = false;
                dataSetSearch.hideFilter();
            },
            loadDataAndUpdate: function(data, append) {
                this.clearFilter(); // work around
                this.loadData(data, append);
                this.updateFilter();
            },
            getRecordsByIds: function(ids) {
                var records = [];

                ids = Ext.Array.from(ids);

                for (var i = 0, index; i < ids.length; i++) {
                    index = this.findExact('id', ids[i]);

                    if (index !== -1) {
                        records.push(this.getAt(index));
                    }
                }

                return records;
            },
            updateFilter: function() {
                var selectedStoreIds = dataSelectedStore.getIds();

                this.clearFilter();

                this.filterBy(function(record) {
                    return !Ext.Array.contains(selectedStoreIds, record.data.id);
                });
            },
            loadPage: function(filter, append, noPaging, fn) {
                var store = this,
					params = {},
                    path;

                filter = filter || dataSetFilter.getValue() || null;

                if (!append) {
                    this.lastPage = null;
                    this.nextPage = 1;
                }

                if (store.nextPage === store.lastPage) {
                    return;
                }

                path = '/dataSets.json?fields=id,' + ns.core.init.namePropertyUrl + '' + (filter ? '&filter=name:like:' + filter : '');

				if (noPaging) {
					params.paging = false;
				}
				else {
					params.page = store.nextPage;
					params.pageSize = 50;
				}

                store.isPending = true;
                ns.core.web.mask.show(dataSetAvailable.boundList);

                ns.ajax({
                    url: ns.core.init.contextPath + '/api' + path,
                    params: params,
                    success: function(r) {
                        var response = Ext.decode(r.responseText),
                            data = response.dataSets || [],
                            pager = response.pager;

                        store.loadStore(data, pager, append, fn);
                    },
                    callback: function() {
                        store.isPending = false;
                        ns.core.web.mask.hide(dataSetAvailable.boundList);
                    }
                });
            },
            loadStore: function(data, pager, append, fn) {
				pager = pager || {};

                this.loadDataAndUpdate(data, append);
                this.sortStore();

                this.lastPage = this.nextPage;

                if (pager.pageCount > this.nextPage) {
                    this.nextPage++;
                }

                this.isPending = false;

				//ns.core.web.multiSelect.filterAvailable({store: dataSetAvailableStore}, {store: dataSetSelectedStore});

                if (fn) {
					fn();
				}
            },
			storage: {},
			parent: null,
            isLoaded: false,
			sortStore: function() {
				this.sort('name', 'ASC');
			}
		});
		ns.app.stores.dataSetAvailable = dataSetAvailableStore;

        dataSelectedStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			data: [],
            getIds: function() {
                var records = this.getRange(),
                    ids = [];

                for (var i = 0; i < records.length; i++) {
                    ids.push(records[i].data.id);
                }

                return ids;
            },
            addRecords: function(records, objectName) {
                var prop = 'objectName',
                    recordsToAdd = [],
                    objectsToAdd = [];

                records = Ext.Array.from(records);

                if (records.length) {
                    for (var i = 0, record; i < records.length; i++) {
                        record = records[i];

                        // record
                        if (record.data) {
                            if (objectName) {
                                record.set(prop, objectName);
                            }
                            recordsToAdd.push(record);
                        }
                        // object
                        else {
                            if (objectName) {
                                record[prop] = objectName;
                            }
                            objectsToAdd.push(record);
                        }
                    }

                    if (recordsToAdd.length) {
                        this.add(recordsToAdd);
                    }

                    if (objectsToAdd.length) {
                        this.loadData(objectsToAdd, true);
                    }
                }
            },
            removeByIds: function(ids) {
                ids = Ext.Array.from(ids);

                for (var i = 0, index; i < ids.length; i++) {
                    index = this.findExact('id', ids[i]);

                    if (index !== -1) {
                        this.removeAt(index);
                    }
                }
            },
            removeByProperty: function(property, values) {
                if (!(property && values)) {
                    return;
                }

                var recordsToRemove = [];

                values = Ext.Array.from(values);

                this.each(function(record) {
                    if (Ext.Array.contains(values, record.data[property])) {
                        recordsToRemove.push(record);
                    }
                });

                this.remove(recordsToRemove);
            },
            listeners: {
                add: function() {
                    data.updateStoreFilters();
                },
                remove: function() {
                    data.updateStoreFilters();
                },
                clear: function() {
                    data.updateStoreFilters();
                }
            }
		});
		ns.app.stores.dataSelected = dataSelectedStore;

		periodTypeStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			data: ns.core.conf.period.periodTypes
		});
		ns.app.stores.periodType = periodTypeStore;

		fixedPeriodAvailableStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'index'],
			data: [],
			setIndex: function(periods) {
				for (var i = 0; i < periods.length; i++) {
					periods[i].index = i;
				}
			},
			sortStore: function() {
				this.sort('index', 'ASC');
			}
		});
		ns.app.stores.fixedPeriodAvailable = fixedPeriodAvailableStore;

		fixedPeriodSelectedStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			data: []
		});
		ns.app.stores.fixedPeriodSelected = fixedPeriodSelectedStore;

		organisationUnitLevelStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'level'],
			data: ns.core.init.organisationUnitLevels
		});
		ns.app.stores.organisationUnitLevel = organisationUnitLevelStore;

		organisationUnitGroupStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name'],
			proxy: {
				type: 'ajax',
				url: ns.core.init.contextPath + '/api/organisationUnitGroups.json?fields=id,' + ns.core.init.namePropertyUrl + '&paging=false',
                headers: {'Authorization': 'Basic ' + ns.ajax(null, null, true)},
				reader: {
					type: 'json',
					root: 'organisationUnitGroups'
				},
				pageParam: false,
				startParam: false,
				limitParam: false
			}
		});
		ns.app.stores.organisationUnitGroup = organisationUnitGroupStore;

		legendSetStore = Ext.create('Ext.data.Store', {
			fields: ['id', 'name', 'index'],
			data: function() {
				var data = ns.core.init.legendSets;
				data.unshift({id: 0, name: NS.i18n.none, index: -1});
				return data;
			}(),
			sorters: [
				{property: 'index', direction: 'ASC'},
				{property: 'name', direction: 'ASC'}
			]
		});
		ns.app.stores.legendSet = legendSetStore;

		// data

		isScrolled = function(e) {
			var el = e.srcElement,
				scrollBottom = el.scrollTop + ((el.clientHeight / el.scrollHeight) * el.scrollHeight);

			return scrollBottom / el.scrollHeight > 0.9;
		};

        onDataTypeSelect = function(type) {
            type = type || 'in';

            if (type === 'in') {
                indicator.show();
                dataElement.hide();
                dataSet.hide();
                //eventDataItem.hide();
                //programIndicator.hide();

                //dataSelected.show();
            }
            else if (type === 'de') {
                indicator.hide();
                dataElement.show();
                dataSet.hide();
                //eventDataItem.hide();
                //programIndicator.hide();
            }
            else if (type === 'ds') {
                indicator.hide();
                dataElement.hide();
                dataSet.show();
                //eventDataItem.hide();
                //programIndicator.hide();

				if (!dataSetAvailableStore.isLoaded) {
                    dataSetAvailableStore.isLoaded = true;
					dataSetAvailableStore.loadPage(null, false);
                }
            }
            //else if (type === 'di') {
                //indicator.hide();
                //dataElement.hide();
                //dataSet.hide();
                //eventDataItem.show();
                //programIndicator.hide();

                //if (!programStore.isLoaded) {
                    //programStore.isLoaded = true;
                    //programStore.load();
                //}
            //}
            //else if (type === 'pi') {
                //indicator.hide();
                //dataElement.hide();
                //dataSet.hide();
                //eventDataItem.hide();
                //programIndicator.show();

                //if (!programStore.isLoaded) {
                    //programStore.isLoaded = true;
                    //programStore.load();
                //}
            //}
        };

        dataType = Ext.create('Ext.form.field.ComboBox', {
            cls: 'ns-combo',
            style: 'margin-bottom:1px',
            width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding,
            valueField: 'id',
            displayField: 'name',
            //emptyText: NS.i18n.data_type,
            editable: false,
            queryMode: 'local',
            value: 'in',
            store: {
                fields: ['id', 'name'],
                data: [
                     {id: 'in', name: NS.i18n.indicators},
                     {id: 'de', name: NS.i18n.data_elements},
                     {id: 'ds', name: NS.i18n.reporting_rates}
                    // {id: 'di', name: NS.i18n.event_data_items},
                    // {id: 'pi', name: NS.i18n.program_indicators}
                ]
            },
            listeners: {
                select: function(cb) {
                    onDataTypeSelect(cb.getValue());
                }
            }
        });

        dataSelected = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-right',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
			ddReorder: true,
			store: dataSelectedStore,
			tbar: [
				{
					xtype: 'button',
					icon: 'images/arrowleftdouble.png',
					width: 22,
					handler: function() {
						//ns.core.web.multiSelect.unselectAll(programIndicatorAvailable, programIndicatorSelected);
                        dataSelectedStore.removeAll();
                        data.updateStoreFilters();
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowleft.png',
					width: 22,
					handler: function() {
						//ns.core.web.multiSelect.unselect(programIndicatorAvailable, programIndicatorSelected);
                        dataSelectedStore.removeByIds(dataSelected.getValue());
                        data.updateStoreFilters();
					}
				},
				'->',
				{
					xtype: 'label',
					text: NS.i18n.selected,
					cls: 'ns-toolbar-multiselect-right-label'
				}
			],
			listeners: {
				afterrender: function() {
					this.boundList.on('itemdblclick', function() {
						//ns.core.web.multiSelect.unselect(programIndicatorAvailable, this);
                        dataSelectedStore.removeByIds(dataSelected.getValue());
                        data.updateStoreFilters();
					}, this);
				}
			}
		});

        // indicator
        indicatorLabel = Ext.create('Ext.form.Label', {
            text: NS.i18n.available,
            cls: 'ns-toolbar-multiselect-left-label',
            style: 'margin-right:5px'
        });

        indicatorSearch = Ext.create('Ext.button.Button', {
            width: 22,
            height: 22,
            cls: 'ns-button-icon',
            disabled: true,
            style: 'background: url(images/search_14.png) 3px 3px no-repeat',
            showFilter: function() {
                indicatorLabel.hide();
                this.hide();
                indicatorFilter.show();
                indicatorFilter.reset();
            },
            hideFilter: function() {
                indicatorLabel.show();
                this.show();
                indicatorFilter.hide();
                indicatorFilter.reset();
            },
            handler: function() {
                this.showFilter();
            }
        });

        indicatorFilter = Ext.create('Ext.form.field.Trigger', {
            cls: 'ns-trigger-filter',
            emptyText: 'Filter available..',
            height: 22,
            hidden: true,
            enableKeyEvents: true,
            fieldStyle: 'height:22px; border-right:0 none',
            style: 'height:22px',
            onTriggerClick: function() {
				if (this.getValue()) {
					this.reset();
					this.onKeyUpHandler();
				}
            },
            onKeyUpHandler: function() {
                var value = indicatorGroup.getValue(),
                    store = indicatorAvailableStore;

                if (Ext.isString(value) || Ext.isNumber(value)) {
                    store.loadPage(null, this.getValue(), false);
                }
            },
            listeners: {
                keyup: {
                    fn: function(cmp) {
                        cmp.onKeyUpHandler();
                    },
                    buffer: 100
                },
                show: function(cmp) {
                    cmp.focus(false, 50);
                },
                focus: function(cmp) {
                    cmp.addCls('ns-trigger-filter-focused');
                },
                blur: function(cmp) {
                    cmp.removeCls('ns-trigger-filter-focused');
                }
            }
        });

        indicatorGroup = Ext.create('Ext.form.field.ComboBox', {
            cls: 'ns-combo',
            style: 'margin-bottom:1px; margin-top:0px',
            width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding,
            valueField: 'id',
            displayField: 'name',
            emptyText: NS.i18n.select_indicator_group,
            editable: false,
            store: indicatorGroupStore,
			loadAvailable: function(reset) {
				var store = indicatorAvailableStore,
					id = this.getValue();

				if (id !== null) {
                    if (reset) {
                        store.reset();
                    }

                    store.loadPage(id, null, false);
				}
			},
			listeners: {
				select: function(cb) {
					cb.loadAvailable(true);

                    indicatorSearch.enable();
				}
			}
        });

		indicatorAvailable = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-left',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
			store: indicatorAvailableStore,
			tbar: [
				indicatorLabel,
                indicatorSearch,
                indicatorFilter,
				'->',
				{
					xtype: 'button',
					icon: 'images/arrowright.png',
					width: 22,
					handler: function() {
                        if (indicatorAvailable.getValue().length) {
                            var records = indicatorAvailableStore.getRecordsByIds(indicatorAvailable.getValue());
                            dataSelectedStore.addRecords(records, 'in');
                        }
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowrightdouble.png',
					width: 22,
					handler: function() {
						indicatorAvailableStore.loadPage(null, null, null, true, function() {
                            dataSelectedStore.addRecords(indicatorAvailableStore.getRange(), 'in');
						});
					}
				}
			],
			listeners: {
				render: function(ms) {
                    var el = Ext.get(ms.boundList.getEl().id + '-listEl').dom;

                    el.addEventListener('scroll', function(e) {
                        if (isScrolled(e) && !indicatorAvailableStore.isPending) {
                            indicatorAvailableStore.loadPage(null, null, true);
                        }
                    });

					ms.boundList.on('itemdblclick', function(bl, record) {
                        dataSelectedStore.addRecords(record, 'in');
					}, ms);
				}
			}
		});

		indicatorSelected = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-right',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
			ddReorder: true,
			store: dataSelectedStore,
			tbar: [
				{
					xtype: 'button',
					icon: 'images/arrowleftdouble.png',
					width: 22,
					handler: function() {
                        if (dataSelectedStore.getRange().length) {
                            dataSelectedStore.removeAll();
                        }
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowleft.png',
					width: 22,
					handler: function() {
                        if (indicatorSelected.getValue().length) {
                            dataSelectedStore.removeByIds(indicatorSelected.getValue());
                        }
					}
				},
				'->',
				{
					xtype: 'label',
					text: NS.i18n.selected,
					cls: 'ns-toolbar-multiselect-right-label'
				}
			],
			listeners: {
				afterrender: function() {
					this.boundList.on('itemdblclick', function(bl, record) {
                        dataSelectedStore.removeByIds(record.data.id);
					}, this);
				}
			}
		});

		indicator = Ext.create('Ext.panel.Panel', {
			xtype: 'panel',
			//title: '<div class="ns-panel-title-data">' + NS.i18n.indicators + '</div>',
            preventHeader: true,
			hideCollapseTool: true,
            dimension: dimConf.indicator.objectName,
            bodyStyle: 'border:0 none',
			items: [
				indicatorGroup,
				{
					xtype: 'panel',
					layout: 'column',
					bodyStyle: 'border-style:none',
					items: [
                        indicatorAvailable,
						indicatorSelected
					]
				}
			],
			listeners: {
				added: function() {
					//accordionPanels.push(this);
				},
				expand: function(p) {
					//p.onExpand();
				}
			}
		});

        // data element
        dataElementLabel = Ext.create('Ext.form.Label', {
            text: NS.i18n.available,
            cls: 'ns-toolbar-multiselect-left-label',
            style: 'margin-right:5px'
        });

        dataElementSearch = Ext.create('Ext.button.Button', {
            width: 22,
            height: 22,
            cls: 'ns-button-icon',
            disabled: true,
            style: 'background: url(images/search_14.png) 3px 3px no-repeat',
            showFilter: function() {
                dataElementLabel.hide();
                this.hide();
                dataElementFilter.show();
                dataElementFilter.reset();
            },
            hideFilter: function() {
                dataElementLabel.show();
                this.show();
                dataElementFilter.hide();
                dataElementFilter.reset();
            },
            handler: function() {
                this.showFilter();
            }
        });

        dataElementFilter = Ext.create('Ext.form.field.Trigger', {
            cls: 'ns-trigger-filter',
            emptyText: 'Filter available..',
            height: 22,
            hidden: true,
            enableKeyEvents: true,
            fieldStyle: 'height:22px; border-right:0 none',
            style: 'height:22px',
            onTriggerClick: function() {
				if (this.getValue()) {
					this.reset();
					this.onKeyUpHandler();
				}
            },
            onKeyUpHandler: function() {
                var value = dataElementGroup.getValue(),
                    store = dataElementAvailableStore;

                if (Ext.isString(value) || Ext.isNumber(value)) {
                    store.loadPage(null, this.getValue(), false);
                }
            },
            listeners: {
                keyup: {
                    fn: function(cmp) {
                        cmp.onKeyUpHandler();
                    },
                    buffer: 100
                },
                show: function(cmp) {
                    cmp.focus(false, 50);
                },
                focus: function(cmp) {
                    cmp.addCls('ns-trigger-filter-focused');
                },
                blur: function(cmp) {
                    cmp.removeCls('ns-trigger-filter-focused');
                }
            }
        });

		dataElementAvailable = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-left',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
            isPending: false,
            page: 1,
			store: dataElementAvailableStore,
			tbar: [
				dataElementLabel,
                dataElementSearch,
                dataElementFilter,
				'->',
				{
					xtype: 'button',
					icon: 'images/arrowright.png',
					width: 22,
					handler: function() {
                        if (dataElementAvailable.getValue().length) {
                            var records = dataElementAvailableStore.getRecordsByIds(dataElementAvailable.getValue());
                            dataSelectedStore.addRecords(records, 'de');
                        }
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowrightdouble.png',
					width: 22,
					handler: function() {
						dataElementAvailableStore.loadPage(null, null, null, true, function() {
                            dataSelectedStore.addRecords(dataElementAvailableStore.getRange(), 'de');
						});
					}
				}
			],
			listeners: {
				render: function(ms) {
                    var el = Ext.get(ms.boundList.getEl().id + '-listEl').dom;

                    el.addEventListener('scroll', function(e) {
                        if (isScrolled(e) && !dataElementAvailableStore.isPending) {
                            dataElementAvailableStore.loadPage(null, null, true);
                        }
                    });

					ms.boundList.on('itemdblclick', function(bl, record) {
                        dataSelectedStore.addRecords(record, 'de');
					}, ms);
				}
			}
		});

		dataElementSelected = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-right',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
			ddReorder: true,
			store: dataSelectedStore,
			tbar: [
				{
					xtype: 'button',
					icon: 'images/arrowleftdouble.png',
					width: 22,
					handler: function() {
                        if (dataSelectedStore.getRange().length) {
                            dataSelectedStore.removeAll();
                        }
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowleft.png',
					width: 22,
					handler: function() {
                        if (dataElementSelected.getValue().length) {
                            dataSelectedStore.removeByIds(dataElementSelected.getValue());
                        }
					}
				},
				'->',
				{
					xtype: 'label',
					text: NS.i18n.selected,
					cls: 'ns-toolbar-multiselect-right-label'
				}
			],
			listeners: {
				afterrender: function() {
					this.boundList.on('itemdblclick', function(bl, record) {
                        dataSelectedStore.removeByIds(record.data.id);
					}, this);
				}
			}
		});

		dataElementGroup = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin:0 1px 1px 0',
			width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding - 90,
			valueField: 'id',
			displayField: 'name',
			emptyText: NS.i18n.select_data_element_group,
			editable: false,
			store: dataElementGroupStore,
			loadAvailable: function(reset) {
				var store = dataElementAvailableStore,
					id = this.getValue();

				if (id !== null) {
                    if (reset) {
                        store.reset();
                    }

                    store.loadPage(id, null, false);
				}
			},
			listeners: {
				select: function(cb) {
					cb.loadAvailable(true);

                    dataElementSearch.enable();
				}
			}
		});

		dataElementDetailLevel = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			style: 'margin-bottom:1px',
			baseBodyCls: 'small',
			queryMode: 'local',
			editable: false,
			valueField: 'id',
			displayField: 'text',
			width: 90 - 1,
			value: dimConf.dataElement.objectName,
			store: {
				fields: ['id', 'text'],
				data: [
					{id: ns.core.conf.finals.dimension.dataElement.objectName, text: NS.i18n.totals},
					{id: ns.core.conf.finals.dimension.operand.objectName, text: NS.i18n.details}
				]
			},
			listeners: {
				select: function(cb) {
					dataElementGroup.loadAvailable(true);
                    dataSelectedStore.removeByProperty('objectName', 'de');
				}
			}
		});

		dataElement = Ext.create('Ext.panel.Panel', {
			xtype: 'panel',
			//title: '<div class="ns-panel-title-data">' + NS.i18n.data_elements + '</div>',
            preventHeader: true,
            hidden: true,
			hideCollapseTool: true,
            bodyStyle: 'border:0 none',
            dimension: dimConf.dataElement.objectName,
			items: [
				{
					xtype: 'container',
					layout: 'column',
					items: [
						dataElementGroup,
						dataElementDetailLevel
					]
				},
				{
					xtype: 'panel',
					layout: 'column',
					bodyStyle: 'border-style:none',
					items: [
                        dataElementAvailable,
						dataElementSelected
					]
				}
			],
			listeners: {
				added: function() {
					//accordionPanels.push(this);
				},
				expand: function(p) {
					//p.onExpand();
				}
			}
		});

        // data set
        dataSetLabel = Ext.create('Ext.form.Label', {
            text: NS.i18n.available,
            cls: 'ns-toolbar-multiselect-left-label',
            style: 'margin-right:5px'
        });

        dataSetSearch = Ext.create('Ext.button.Button', {
            width: 22,
            height: 22,
            cls: 'ns-button-icon',
            style: 'background: url(images/search_14.png) 3px 3px no-repeat',
            showFilter: function() {
                dataSetLabel.hide();
                this.hide();
                dataSetFilter.show();
                dataSetFilter.reset();
            },
            hideFilter: function() {
                dataSetLabel.show();
                this.show();
                dataSetFilter.hide();
                dataSetFilter.reset();
            },
            handler: function() {
                this.showFilter();
            }
        });

        dataSetFilter = Ext.create('Ext.form.field.Trigger', {
            cls: 'ns-trigger-filter',
            emptyText: 'Filter available..',
            height: 22,
            hidden: true,
            enableKeyEvents: true,
            fieldStyle: 'height:22px; border-right:0 none',
            style: 'height:22px',
            onTriggerClick: function() {
				if (this.getValue()) {
					this.reset();
					this.onKeyUpHandler();
				}
            },
            onKeyUpHandler: function() {
                var store = dataSetAvailableStore;
                store.loadPage(this.getValue(), false);
            },
            listeners: {
                keyup: {
                    fn: function(cmp) {
                        cmp.onKeyUpHandler();
                    },
                    buffer: 100
                },
                show: function(cmp) {
                    cmp.focus(false, 50);
                },
                focus: function(cmp) {
                    cmp.addCls('ns-trigger-filter-focused');
                },
                blur: function(cmp) {
                    cmp.removeCls('ns-trigger-filter-focused');
                }
            }
        });

		dataSetAvailable = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-left',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
			store: dataSetAvailableStore,
			tbar: [
				dataSetLabel,
                dataSetSearch,
                dataSetFilter,
				'->',
				{
					xtype: 'button',
					icon: 'images/arrowright.png',
					width: 22,
					handler: function() {
                        if (dataSetAvailable.getValue().length) {
                            var records = dataSetAvailableStore.getRecordsByIds(dataSetAvailable.getValue());
                            dataSelectedStore.addRecords(records, 'ds');
                        }
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowrightdouble.png',
					width: 22,
					handler: function() {
						dataSetAvailableStore.loadPage(null, null, true, function() {
                            dataSelectedStore.addRecords(dataSetAvailableStore.getRange(), 'ds');
						});
					}
				}
			],
			listeners: {
				render: function(ms) {
                    var el = Ext.get(ms.boundList.getEl().id + '-listEl').dom;

                    el.addEventListener('scroll', function(e) {
                        if (isScrolled(e) && !dataSetAvailableStore.isPending) {
                            dataSetAvailableStore.loadPage(null, true);
                        }
                    });

					ms.boundList.on('itemdblclick', function(bl, record) {
                        dataSelectedStore.addRecords(record, 'ds');
					}, ms);
				}
			}
		});

		dataSetSelected = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-right',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			valueField: 'id',
			displayField: 'name',
			ddReorder: true,
			store: dataSelectedStore,
			tbar: [
				{
					xtype: 'button',
					icon: 'images/arrowleftdouble.png',
					width: 22,
					handler: function() {
                        if (dataSelectedStore.getRange().length) {
                            dataSelectedStore.removeAll();
                        }
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowleft.png',
					width: 22,
					handler: function() {
                        if (dataSetSelected.getValue().length) {
                            dataSelectedStore.removeByIds(dataSetSelected.getValue());
                        }
					}
				},
				'->',
				{
					xtype: 'label',
					text: NS.i18n.selected,
					cls: 'ns-toolbar-multiselect-right-label'
				}
			],
			listeners: {
				afterrender: function() {
					this.boundList.on('itemdblclick', function(bl, record) {
                        dataSelectedStore.removeByIds(record.data.id);
					}, this);
				}
			}
		});

		dataSet = Ext.create('Ext.panel.Panel', {
			xtype: 'panel',
			//title: '<div class="ns-panel-title-data">' + NS.i18n.reporting_rates + '</div>',
            preventHeader: true,
            hidden: true,
			hideCollapseTool: true,
            bodyStyle: 'border:0 none',
            dimension: dimConf.dataSet.objectName,
			items: [
				{
					xtype: 'panel',
					layout: 'column',
					bodyStyle: 'border-style:none',
					items: [
						dataSetAvailable,
						dataSetSelected
					]
				}
			],
			listeners: {
				added: function() {
					//accordionPanels.push(this);
				},
				expand: function(p) {
					//p.onExpand();
				}
			}
		});

        data = {
			xtype: 'panel',
			title: '<div class="ns-panel-title-data">' + NS.i18n.data + '</div>',
			hideCollapseTool: true,
            dimension: dimConf.data.objectName,
            updateStoreFilters: function() {
                indicatorAvailableStore.updateFilter();
                dataElementAvailableStore.updateFilter();
                dataSetAvailableStore.updateFilter();
                //eventDataItemAvailableStore.updateFilter();
                //programIndicatorAvailableStore.updateFilter();
            },
			getDimension: function() {
				var config = {
					dimension: dimConf.data.objectName,
					items: []
				};

				dataSelectedStore.each( function(r) {
					config.items.push({
						id: r.data.id,
						name: r.data.name,
                        objectName: r.data.objectName
					});
				});

                // TODO program
                //if (eventDataItemProgram.getValue() || programIndicatorProgram.getValue()) {
                    //config.program = {id: eventDataItemProgram.getValue() || programIndicatorProgram.getValue()};
                //}

				return config.items.length ? config : null;
			},
			onExpand: function() {
                var conf = ns.core.conf.layout,
                    h = westRegion.hasScrollbar ? conf.west_scrollbarheight_accordion_indicator : conf.west_maxheight_accordion_indicator;

				accordion.setThisHeight(h);

				ns.core.web.multiSelect.setHeight([indicatorAvailable, indicatorSelected], this, conf.west_fill_accordion_indicator);
                ns.core.web.multiSelect.setHeight([dataElementAvailable, dataElementSelected], this, conf.west_fill_accordion_dataelement);
                ns.core.web.multiSelect.setHeight([dataSetAvailable, dataSetSelected], this, conf.west_fill_accordion_dataset);
                //ns.core.web.multiSelect.setHeight([eventDataItemAvailable, eventDataItemSelected], this, conf.west_fill_accordion_eventdataitem);
                //ns.core.web.multiSelect.setHeight([programIndicatorAvailable, programIndicatorSelected], this, conf.west_fill_accordion_programindicator);
			},
			items: [
                dataType,
                indicator,
                dataElement,
                dataSet
                //eventDataItem,
                //programIndicator
			],
			listeners: {
				added: function() {
					accordionPanels.push(this);
				},
				expand: function(p) {
					p.onExpand();
				}
			}
		};

		// period

		rewind = Ext.create('Ext.form.field.Checkbox', {
			relativePeriodId: 'rewind',
			boxLabel: 'Rewind one period',
			xable: function() {
				this.setDisabled(period.isNoRelativePeriods());
			}
		});

        relativePeriodDefaults = {
            labelSeparator: '',
            style: 'margin-bottom:0',
            listeners: {
                added: function(chb) {
                    if (chb.xtype === 'checkbox') {
                        period.checkboxes.push(chb);
                        relativePeriod.valueComponentMap[chb.relativePeriodId] = chb;

                        if (chb.relativePeriodId === ns.core.init.systemInfo.analysisRelativePeriod) {
                            chb.setValue(true);
                        }
                    }
                }
            }
        };

		relativePeriod = {
			xtype: 'panel',
            layout: 'column',
			hideCollapseTool: true,
			autoScroll: true,
			bodyStyle: 'border:0 none',
			valueComponentMap: {},
			items: [
				{
					xtype: 'container',
                    columnWidth: 0.34,
					bodyStyle: 'border-style:none',
					items: [
						{
							xtype: 'panel',
							//columnWidth: 0.34,
							bodyStyle: 'border-style:none; padding:0 0 0 8px',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.weeks,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_WEEK',
									boxLabel: NS.i18n.this_week
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_WEEK',
									boxLabel: NS.i18n.last_week
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_4_WEEKS',
									boxLabel: NS.i18n.last_4_weeks
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_12_WEEKS',
									boxLabel: NS.i18n.last_12_weeks
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_52_WEEKS',
									boxLabel: NS.i18n.last_52_weeks
								}
							]
						},
						{
							xtype: 'panel',
							//columnWidth: 0.34,
							bodyStyle: 'border-style:none; padding:5px 0 0 8px',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.quarters,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_QUARTER',
									boxLabel: NS.i18n.this_quarter
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_QUARTER',
									boxLabel: NS.i18n.last_quarter
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_4_QUARTERS',
									boxLabel: NS.i18n.last_4_quarters
								}
							]
						},
						{
							xtype: 'panel',
							//columnWidth: 0.35,
							bodyStyle: 'border-style:none; padding:5px 0 0 8px',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.years,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_YEAR',
									boxLabel: NS.i18n.this_year
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_YEAR',
									boxLabel: NS.i18n.last_year
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_5_YEARS',
									boxLabel: NS.i18n.last_5_years
								}
							]
						}
					]
				},
				{
					xtype: 'container',
                    columnWidth: 0.33,
					bodyStyle: 'border-style:none',
					items: [
						{
							xtype: 'panel',
							//columnWidth: 0.33,
							bodyStyle: 'border-style:none',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.months,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_MONTH',
									boxLabel: NS.i18n.this_month
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_MONTH',
									boxLabel: NS.i18n.last_month
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_3_MONTHS',
									boxLabel: NS.i18n.last_3_months
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_6_MONTHS',
									boxLabel: NS.i18n.last_6_months
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_12_MONTHS',
									boxLabel: NS.i18n.last_12_months
								}
							]
						},
						{
							xtype: 'panel',
							//columnWidth: 0.33,
							bodyStyle: 'border-style:none; padding:5px 0 0',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.sixmonths,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_SIX_MONTH',
									boxLabel: NS.i18n.this_sixmonth
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_SIX_MONTH',
									boxLabel: NS.i18n.last_sixmonth
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_2_SIXMONTHS',
									boxLabel: NS.i18n.last_2_sixmonths
								}
							]
						}
					]
				},
				{
					xtype: 'container',
                    columnWidth: 0.33,
					bodyStyle: 'border-style:none',
					items: [
						{
							xtype: 'panel',
							//columnWidth: 0.33,
							bodyStyle: 'border-style:none',
                            style: 'margin-bottom: 32px',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.bimonths,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_BIMONTH',
									boxLabel: NS.i18n.this_bimonth
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_BIMONTH',
									boxLabel: NS.i18n.last_bimonth
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_6_BIMONTHS',
									boxLabel: NS.i18n.last_6_bimonths
								}
							]
						},
						{
							xtype: 'panel',
							//columnWidth: 0.33,
							bodyStyle: 'border-style:none; padding:5px 0 0',
							defaults: relativePeriodDefaults,
							items: [
								{
									xtype: 'label',
									text: NS.i18n.financial_years,
									cls: 'ns-label-period-heading'
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'THIS_FINANCIAL_YEAR',
									boxLabel: NS.i18n.this_financial_year
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_FINANCIAL_YEAR',
									boxLabel: NS.i18n.last_financial_year
								},
								{
									xtype: 'checkbox',
									relativePeriodId: 'LAST_5_FINANCIAL_YEARS',
									boxLabel: NS.i18n.last_5_financial_years
								}
							]
						}
					]
				}
			]
		};

		fixedPeriodAvailable = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-left',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			height: 180,
			valueField: 'id',
			displayField: 'name',
			store: fixedPeriodAvailableStore,
			tbar: [
				{
					xtype: 'label',
					text: NS.i18n.available,
					cls: 'ns-toolbar-multiselect-left-label'
				},
				'->',
				{
					xtype: 'button',
					icon: 'images/arrowright.png',
					width: 22,
					handler: function() {
						ns.core.web.multiSelect.select(fixedPeriodAvailable, fixedPeriodSelected);
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowrightdouble.png',
					width: 22,
					handler: function() {
						ns.core.web.multiSelect.selectAll(fixedPeriodAvailable, fixedPeriodSelected, true);
					}
				},
				' '
			],
			listeners: {
				afterrender: function() {
					this.boundList.on('itemdblclick', function() {
						ns.core.web.multiSelect.select(fixedPeriodAvailable, fixedPeriodSelected);
					}, this);
				}
			}
		});

		fixedPeriodSelected = Ext.create('Ext.ux.form.MultiSelect', {
			cls: 'ns-toolbar-multiselect-right',
			width: (ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding) / 2,
			height: 180,
			valueField: 'id',
			displayField: 'name',
			ddReorder: true,
			store: fixedPeriodSelectedStore,
			tbar: [
				' ',
				{
					xtype: 'button',
					icon: 'images/arrowleftdouble.png',
					width: 22,
					handler: function() {
						ns.core.web.multiSelect.unselectAll(fixedPeriodAvailable, fixedPeriodSelected);
					}
				},
				{
					xtype: 'button',
					icon: 'images/arrowleft.png',
					width: 22,
					handler: function() {
						ns.core.web.multiSelect.unselect(fixedPeriodAvailable, fixedPeriodSelected);
					}
				},
				'->',
				{
					xtype: 'label',
					text: NS.i18n.selected,
					cls: 'ns-toolbar-multiselect-right-label'
				}
			],
			listeners: {
				afterrender: function() {
					this.boundList.on('itemdblclick', function() {
						ns.core.web.multiSelect.unselect(fixedPeriodAvailable, fixedPeriodSelected);
					}, this);
				}
			}
		});

        onPeriodTypeSelect = function() {
            var type = periodType.getValue(),
                periodOffset = periodType.periodOffset,
                generator = ns.core.init.periodGenerator,
                periods = generator.generateReversedPeriods(type, type === 'Yearly' ? periodOffset - 5 : periodOffset);

            for (var i = 0; i < periods.length; i++) {
                periods[i].id = periods[i].iso;
            }

            fixedPeriodAvailableStore.setIndex(periods);
            fixedPeriodAvailableStore.loadData(periods);
            ns.core.web.multiSelect.filterAvailable(fixedPeriodAvailable, fixedPeriodSelected);
        };

        periodType = Ext.create('Ext.form.field.ComboBox', {
            cls: 'ns-combo',
            style: 'margin-bottom:1px',
            width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding - 62 - 62 - 2,
            valueField: 'id',
            displayField: 'name',
            emptyText: NS.i18n.select_period_type,
            editable: false,
            queryMode: 'remote',
            store: periodTypeStore,
            periodOffset: 0,
            listeners: {
                select: function() {
                    periodType.periodOffset = 0;
                    onPeriodTypeSelect();
                }
            }
        });

		period = {
			xtype: 'panel',
			title: '<div class="ns-panel-title-period">Periods</div>',
			hideCollapseTool: true,
            dimension: dimConf.period.objectName,
			checkboxes: [],
			getDimension: function() {
				var config = {
						dimension: dimConf.period.objectName,
						items: []
					};

				fixedPeriodSelectedStore.each( function(r) {
					config.items.push({
						id: r.data.id,
						name: r.data.name
					});
				});

				for (var i = 0; i < this.checkboxes.length; i++) {
					if (this.checkboxes[i].getValue()) {
						config.items.push({
							id: this.checkboxes[i].relativePeriodId,
							name: ''
						});
					}
				}

				return config.items.length ? config : null;
			},
			onExpand: function() {
				var h = ns.app.westRegion.hasScrollbar ?
					ns.core.conf.layout.west_scrollbarheight_accordion_period : ns.core.conf.layout.west_maxheight_accordion_period;
				accordion.setThisHeight(h);
				ns.core.web.multiSelect.setHeight(
					[fixedPeriodAvailable, fixedPeriodSelected],
					this,
					ns.core.conf.layout.west_fill_accordion_period
				);
			},
			resetRelativePeriods: function() {
				var a = this.checkboxes;
				for (var i = 0; i < a.length; i++) {
					a[i].setValue(false);
				}
			},
			isNoRelativePeriods: function() {
				var a = this.checkboxes;
				for (var i = 0; i < a.length; i++) {
					if (a[i].getValue()) {
						return false;
					}
				}
				return true;
			},
			items: [
				{
					xtype: 'panel',
					layout: 'column',
					bodyStyle: 'border-style:none',
					style: 'margin-top:0px',
					items: [
                        periodType,
						{
							xtype: 'button',
							text: NS.i18n.prev_year,
							style: 'margin-left:1px; border-radius:2px',
							height: 24,
                            width: 62,
							handler: function() {
								if (periodType.getValue()) {
									periodType.periodOffset--;
                                    onPeriodTypeSelect();
								}
							}
						},
						{
							xtype: 'button',
							text: NS.i18n.next_year,
							style: 'margin-left:1px; border-radius:2px',
							height: 24,
                            width: 62,
							handler: function() {
								if (periodType.getValue()) {
									periodType.periodOffset++;
                                    onPeriodTypeSelect();
								}
							}
						}
					]
				},
				{
					xtype: 'panel',
					layout: 'column',
					bodyStyle: 'border-style:none; padding-bottom:2px',
					items: [
						fixedPeriodAvailable,
						fixedPeriodSelected
					]
				},
				relativePeriod
			],
			listeners: {
				added: function() {
					accordionPanels.push(this);
				},
				expand: function(p) {
					p.onExpand();
				}
			}
		};

		// organisation unit

		treePanel = Ext.create('Ext.tree.Panel', {
			cls: 'ns-tree',
			style: 'border-top: 1px solid #ddd; padding-top: 1px',
			width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding,
			displayField: 'name',
			rootVisible: false,
			autoScroll: true,
			multiSelect: true,
			rendered: false,
			reset: function() {
				var rootNode = this.getRootNode().findChild('id', ns.core.init.rootNodes[0].id);
				this.collapseAll();
				this.expandPath(rootNode.getPath());
				this.getSelectionModel().select(rootNode);
			},
			selectRootIf: function() {
				if (this.getSelectionModel().getSelection().length < 1) {
					var node = this.getRootNode().findChild('id', ns.core.init.rootNodes[0].id);
					if (this.rendered) {
						this.getSelectionModel().select(node);
					}
					return node;
				}
			},
			isPending: false,
			recordsToSelect: [],
			recordsToRestore: [],
			multipleSelectIf: function(map, doUpdate) {
				if (this.recordsToSelect.length === ns.core.support.prototype.object.getLength(map)) {
					this.getSelectionModel().select(this.recordsToSelect);
					this.recordsToSelect = [];
					this.isPending = false;

					if (doUpdate) {
						update();
					}
				}
			},
			multipleExpand: function(id, map, doUpdate) {
				var that = this,
					rootId = ns.core.conf.finals.root.id,
					path = map[id];

				if (path.substr(0, rootId.length + 1) !== ('/' + rootId)) {
					path = '/' + rootId + path;
				}

				that.expandPath(path, 'id', '/', function() {
					record = Ext.clone(that.getRootNode().findChild('id', id, true));
					that.recordsToSelect.push(record);
					that.multipleSelectIf(map, doUpdate);
				});
			},
            select: function(url, params) {
                if (!params) {
                    params = {};
                }
                ns.ajax({
                    url: url,
                    method: 'GET',
                    params: params,
                    scope: this,
                    success: function(r) {
                        var a = Ext.decode(r.responseText).organisationUnits;
                        this.numberOfRecords = a.length;
                        for (var i = 0; i < a.length; i++) {
                            this.multipleExpand(a[i].id, a[i].path);
                        }
                    }
                });
            },
			getParentGraphMap: function() {
				var selection = this.getSelectionModel().getSelection(),
					map = {};

				if (Ext.isArray(selection) && selection.length) {
					for (var i = 0, pathArray, key; i < selection.length; i++) {
						pathArray = selection[i].getPath().split('/');
						map[pathArray.pop()] = pathArray.join('/');
					}
				}

				return map;
			},
			selectGraphMap: function(map, update) {
				if (!ns.core.support.prototype.object.getLength(map)) {
					return;
				}

				this.isPending = true;

				for (var key in map) {
					if (map.hasOwnProperty(key)) {
						treePanel.multipleExpand(key, map, update);
					}
				}
			},
			store: Ext.create('Ext.data.TreeStore', {
				fields: ['id', 'name', 'hasChildren'],
				proxy: {
					type: 'rest',
					format: 'json',
					noCache: false,
					extraParams: {
						fields: 'children[id,' + ns.core.init.namePropertyUrl + ',children::isNotEmpty|rename(hasChildren)&paging=false'
					},
					url: ns.core.init.contextPath + '/api/organisationUnits',
                    headers: {'Authorization': 'Basic ' + ns.ajax(null, null, true)},
					reader: {
						type: 'json',
						root: 'children'
					},
					sortParam: false
				},
				sorters: [{
					property: 'name',
					direction: 'ASC'
				}],
				root: {
					id: ns.core.conf.finals.root.id,
					expanded: true,
					children: ns.core.init.rootNodes
				},
				listeners: {
					load: function(store, node, records) {
						Ext.Array.each(records, function(record) {
                            if (Ext.isBoolean(record.data.hasChildren)) {
                                record.set('leaf', !record.data.hasChildren);
                            }
                        });
					}
				}
			}),
			xable: function(values) {
				for (var i = 0; i < values.length; i++) {
					if (!!values[i]) {
						this.disable();
						return;
					}
				}

				this.enable();
			},
			listeners: {
				beforeitemexpand: function() {
					if (!treePanel.isPending) {
						treePanel.recordsToRestore = treePanel.getSelectionModel().getSelection();
					}
				},
				itemexpand: function() {
					if (!treePanel.isPending && treePanel.recordsToRestore.length) {
						treePanel.getSelectionModel().select(treePanel.recordsToRestore);
						treePanel.recordsToRestore = [];
					}
				},
				render: function() {
					this.rendered = true;
				},
				afterrender: function() {
					this.getSelectionModel().select(0);
				},
				itemcontextmenu: function(v, r, h, i, e) {
					v.getSelectionModel().select(r, false);

					if (v.menu) {
						v.menu.destroy();
					}
					v.menu = Ext.create('Ext.menu.Menu', {
						id: 'treepanel-contextmenu',
						showSeparator: false,
						shadow: false
					});
					if (!r.data.leaf) {
						v.menu.add({
							id: 'treepanel-contextmenu-item',
							text: NS.i18n.select_sub_units,
							icon: 'images/node-select-child.png',
							handler: function() {
								r.expand(false, function() {
									v.getSelectionModel().select(r.childNodes, true);
									v.getSelectionModel().deselect(r);
								});
							}
						});
					}
					else {
						return;
					}

					v.menu.showAt(e.xy);
				}
			}
		});

		userOrganisationUnit = Ext.create('Ext.form.field.Checkbox', {
			columnWidth: 0.25,
			style: 'padding-top: 3px; padding-left: 5px; margin-bottom: 0',
			boxLabel: NS.i18n.user_organisation_unit,
			labelWidth: ns.core.conf.layout.form_label_width,
			handler: function(chb, checked) {
				treePanel.xable([checked, userOrganisationUnitChildren.getValue(), userOrganisationUnitGrandChildren.getValue()]);
			}
		});

		userOrganisationUnitChildren = Ext.create('Ext.form.field.Checkbox', {
			columnWidth: 0.26,
			style: 'padding-top: 3px; margin-bottom: 0',
			boxLabel: NS.i18n.user_sub_units,
			labelWidth: ns.core.conf.layout.form_label_width,
			handler: function(chb, checked) {
				treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitGrandChildren.getValue()]);
			}
		});

		userOrganisationUnitGrandChildren = Ext.create('Ext.form.field.Checkbox', {
			columnWidth: 0.4,
			style: 'padding-top: 3px; margin-bottom: 0',
			boxLabel: NS.i18n.user_sub_x2_units,
			labelWidth: ns.core.conf.layout.form_label_width,
			handler: function(chb, checked) {
				treePanel.xable([checked, userOrganisationUnit.getValue(), userOrganisationUnitChildren.getValue()]);
			}
		});

		organisationUnitLevel = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			multiSelect: true,
			style: 'margin-bottom:0',
			width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding - 37,
			valueField: 'level',
			displayField: 'name',
			emptyText: NS.i18n.select_organisation_unit_levels,
			editable: false,
			hidden: true,
			store: organisationUnitLevelStore
		});

		organisationUnitGroup = Ext.create('Ext.form.field.ComboBox', {
			cls: 'ns-combo',
			multiSelect: true,
			style: 'margin-bottom:0',
			width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding - 37,
			valueField: 'id',
			displayField: 'name',
			emptyText: NS.i18n.select_organisation_unit_groups,
			editable: false,
			hidden: true,
			store: organisationUnitGroupStore
		});

		toolMenu = Ext.create('Ext.menu.Menu', {
			shadow: false,
			showSeparator: false,
			menuValue: 'orgunit',
			clickHandler: function(param) {
				if (!param) {
					return;
				}

				var items = this.items.items;
				this.menuValue = param;

				// Menu item icon cls
				for (var i = 0; i < items.length; i++) {
					if (items[i].setIconCls) {
						if (items[i].param === param) {
							items[i].setIconCls('ns-menu-item-selected');
						}
						else {
							items[i].setIconCls('ns-menu-item-unselected');
						}
					}
				}

				// Gui
				if (param === 'orgunit') {
					userOrganisationUnit.show();
					userOrganisationUnitChildren.show();
					userOrganisationUnitGrandChildren.show();
					organisationUnitLevel.hide();
					organisationUnitGroup.hide();

					if (userOrganisationUnit.getValue() || userOrganisationUnitChildren.getValue()) {
						treePanel.disable();
					}
				}
				else if (param === 'level') {
					userOrganisationUnit.hide();
					userOrganisationUnitChildren.hide();
					userOrganisationUnitGrandChildren.hide();
					organisationUnitLevel.show();
					organisationUnitGroup.hide();
					treePanel.enable();
				}
				else if (param === 'group') {
					userOrganisationUnit.hide();
					userOrganisationUnitChildren.hide();
					userOrganisationUnitGrandChildren.hide();
					organisationUnitLevel.hide();
					organisationUnitGroup.show();
					treePanel.enable();
				}
			},
			items: [
				{
					xtype: 'label',
					text: 'Selection mode',
					style: 'padding:7px 5px 5px 7px; font-weight:bold; border:0 none'
				},
				{
					text: NS.i18n.select_organisation_units + '&nbsp;&nbsp;',
					param: 'orgunit',
					iconCls: 'ns-menu-item-selected'
				},
				{
					text: 'Select levels' + '&nbsp;&nbsp;',
					param: 'level',
					iconCls: 'ns-menu-item-unselected'
				},
				{
					text: 'Select groups' + '&nbsp;&nbsp;',
					param: 'group',
					iconCls: 'ns-menu-item-unselected'
				}
			],
			listeners: {
				afterrender: function() {
					this.getEl().addCls('ns-btn-menu');
				},
				click: function(menu, item) {
					this.clickHandler(item.param);
				}
			}
		});

		tool = Ext.create('Ext.button.Button', {
			cls: 'ns-button-organisationunitselection',
			iconCls: 'ns-button-icon-gear',
			width: 36,
			height: 24,
			menu: toolMenu
		});

		toolPanel = Ext.create('Ext.panel.Panel', {
			width: 36,
			bodyStyle: 'border:0 none; text-align:right',
			style: 'margin-right:1px',
			items: tool
		});

		organisationUnit = {
			xtype: 'panel',
			title: '<div class="ns-panel-title-organisationunit">' + NS.i18n.organisation_units + '</div>',
			bodyStyle: 'padding:1px',
			hideCollapseTool: true,
            dimension: dimConf.organisationUnit.objectName,
			collapsed: false,
			getDimension: function() {
				var r = treePanel.getSelectionModel().getSelection(),
					config = {
						dimension: ns.core.conf.finals.dimension.organisationUnit.objectName,
						items: []
					};

				if (toolMenu.menuValue === 'orgunit') {
					if (userOrganisationUnit.getValue() || userOrganisationUnitChildren.getValue() || userOrganisationUnitGrandChildren.getValue()) {
						if (userOrganisationUnit.getValue()) {
							config.items.push({
								id: 'USER_ORGUNIT',
								name: ''
							});
						}
						if (userOrganisationUnitChildren.getValue()) {
							config.items.push({
								id: 'USER_ORGUNIT_CHILDREN',
								name: ''
							});
						}
						if (userOrganisationUnitGrandChildren.getValue()) {
							config.items.push({
								id: 'USER_ORGUNIT_GRANDCHILDREN',
								name: ''
							});
						}
					}
					else {
						for (var i = 0; i < r.length; i++) {
							config.items.push({id: r[i].data.id});
						}
					}
				}
				else if (toolMenu.menuValue === 'level') {
					var levels = organisationUnitLevel.getValue();

					for (var i = 0; i < levels.length; i++) {
						config.items.push({
							id: 'LEVEL-' + levels[i],
							name: ''
						});
					}

					for (var i = 0; i < r.length; i++) {
						config.items.push({
							id: r[i].data.id,
							name: ''
						});
					}
				}
				else if (toolMenu.menuValue === 'group') {
					var groupIds = organisationUnitGroup.getValue();

					for (var i = 0; i < groupIds.length; i++) {
						config.items.push({
							id: 'OU_GROUP-' + groupIds[i],
							name: ''
						});
					}

					for (var i = 0; i < r.length; i++) {
						config.items.push({
							id: r[i].data.id,
							name: ''
						});
					}
				}

				return config.items.length ? config : null;
			},
            onExpand: function() {
                var h = ns.app.westRegion.hasScrollbar ?
                    ns.core.conf.layout.west_scrollbarheight_accordion_organisationunit : ns.core.conf.layout.west_maxheight_accordion_organisationunit;
                accordion.setThisHeight(h);
                treePanel.setHeight(this.getHeight() - ns.core.conf.layout.west_fill_accordion_organisationunit);
            },
            items: [
                {
                    layout: 'column',
                    bodyStyle: 'border:0 none',
                    style: 'padding-bottom:1px',
                    items: [
                        toolPanel,
                        {
                            width: ns.core.conf.layout.west_fieldset_width - ns.core.conf.layout.west_width_padding - 37,
                            layout: 'column',
                            bodyStyle: 'border:0 none',
                            items: [
                                userOrganisationUnit,
                                userOrganisationUnitChildren,
                                userOrganisationUnitGrandChildren,
                                organisationUnitLevel,
                                organisationUnitGroup
                            ]
                        }
                    ]
                },
                treePanel
            ],
            listeners: {
                added: function() {
                    accordionPanels.push(this);
                },
                expand: function(p) {
                    p.onExpand();
                }
            }
        };

		// viewport

		update = function() {
			var config = ns.core.web.report.getLayoutConfig()
                layout = ns.core.api.layout.Layout(config);
                
			if (!layout) {
				return;
			}

			ns.core.web.report.createReport(layout, false);
		};

		accordionBody = Ext.create('Ext.panel.Panel', {
			layout: 'accordion',
			activeOnTop: true,
			cls: 'ns-accordion',
			bodyStyle: 'border:0 none; margin-bottom:2px',
			height: 700,
			items: function() {
				var panels = [
                    data,
					period,
					organisationUnit
				];
				//dims = Ext.clone(ns.core.init.dimensions),
                //dimPanels = getDimensionPanels(dims, 'ns-panel-title-dimension');

                //// idPanelMap
                //for (var i = 0, dimPanel; i < dimPanels.length; i++) {
                    //dimPanel = dimPanels[i];

                    //dimensionPanelMap[dimPanel.dimension] = dimPanel;
                //}

                //// panels
				//panels = panels.concat(dimPanels);

				last = panels[panels.length - 1];
				last.cls = 'ns-accordion-last';

				return panels;
			}()
		});

		accordion = Ext.create('Ext.panel.Panel', {
			bodyStyle: 'border-style:none; padding:1px; padding-bottom:0; overflow-y:scroll;',
			items: accordionBody,
			panels: accordionPanels,
			setThisHeight: function(mx) {
				var panelHeight = this.panels.length * 28,
					height;

				if (westRegion.hasScrollbar) {
					height = panelHeight + mx;
					this.setHeight(viewport.getHeight() - 2);
					accordionBody.setHeight(height - 2);
				}
				else {
					height = westRegion.getHeight() - ns.core.conf.layout.west_fill;
					mx += panelHeight;
					accordion.setHeight((height > mx ? mx : height) - 2);
					accordionBody.setHeight((height > mx ? mx : height) - 2);
				}
			},
			getExpandedPanel: function() {
				for (var i = 0, panel; i < this.panels.length; i++) {
					if (!this.panels[i].collapsed) {
						return this.panels[i];
					}
				}

				return null;
			},
			getFirstPanel: function() {
				return this.panels[0];
			},
			listeners: {
				added: function() {
					ns.app.accordion = this;
				}
			}
		});

		westRegion = Ext.create('Ext.panel.Panel', {
			region: 'west',
			preventHeader: true,
			collapsible: true,
			collapseMode: 'mini',
			width: function() {
				if (Ext.isWebKit) {
					return ns.core.conf.layout.west_width + 8;
				}
				else {
					if (Ext.isLinux && Ext.isGecko) {
						return ns.core.conf.layout.west_width + 13;
					}
					return ns.core.conf.layout.west_width + 17;
				}
			}(),
			items: accordion,
			listeners: {
				added: function() {
					ns.app.westRegion = this;
				}
			}
		});

		layoutButton = Ext.create('Ext.button.Button', {
			text: 'Layout',
			menu: {},
			handler: function() {
				if (!ns.app.layoutWindow) {
					ns.app.layoutWindow = LayoutWindow();
				}

				ns.app.layoutWindow.show();
			},
			listeners: {
				added: function() {
					ns.app.layoutButton = this;
				}
			}
		});

		optionsButton = Ext.create('Ext.button.Button', {
			text: NS.i18n.options,
			menu: {},
			handler: function() {
				if (!ns.app.optionsWindow) {
					ns.app.optionsWindow = OptionsWindow();
				}

				ns.app.optionsWindow.show();
			},
			listeners: {
				added: function() {
					ns.app.optionsButton = this;
				}
			}
		});

		aboutButton = Ext.create('Ext.button.Button', {
			text: NS.i18n.about,
            menu: {},
			handler: function() {
				if (ns.app.aboutWindow && ns.app.aboutWindow.destroy) {
					ns.app.aboutWindow.destroy();
				}

				ns.app.aboutWindow = AboutWindow();
				ns.app.aboutWindow.show();
			},
			listeners: {
				added: function() {
					ns.app.aboutButton = this;
				}
			}
		});

		centerRegion = Ext.create('Ext.panel.Panel', {
			region: 'center',
			bodyStyle: 'padding:1px',
			autoScroll: true,
			fullSize: true,
			//cmp: [defaultButton],
			toggleCmp: function(show) {
				//for (var i = 0; i < this.cmp.length; i++) {
					//if (show) {
						//this.cmp[i].show();
					//}
					//else {
						//this.cmp[i].hide();
					//}
				//}
			},
			tbar: {
				defaults: {
					height: 26
				},
				items: [
					{
						text: '<<<',
						handler: function(b) {
							var text = b.getText();
							text = text === '<<<' ? '>>>' : '<<<';
							b.setText(text);

							westRegion.toggleCollapse();
						}
					},
					{
						text: '<b>' + NS.i18n.update + '</b>',
						handler: function() {
							update();
						}
					},
					//layoutButton,
					{
						xtype: 'tbseparator',
						height: 18,
						style: 'border-color:transparent; border-right-color:#d1d1d1; margin-right:4px',
					},
					optionsButton,
					//{
						//xtype: 'tbseparator',
						//height: 18,
						//style: 'border-color:transparent; border-right-color:#d1d1d1; margin-right:4px',
					//},
					//favoriteButton,
					//downloadButton,
					//shareButton,
					'->',
                    aboutButton,
                    {
						xtype: 'button',
						text: NS.i18n.home,
						handler: function() {
							window.location.href = ns.core.init.contextPath + '/dhis-web-commons-about/redirect.action';
						}
					}
				]
			},
			listeners: {
				added: function() {
					ns.app.centerRegion = this;
				},
				afterrender: function(p) {
					var html = '';

					html += '<div class="ns-viewport-text" style="padding:20px">';
					html += '<h3>' + NS.i18n.example1 + '</h3>';
					html += '<div>- ' + NS.i18n.example2 + '</div>';
					html += '<div>- ' + NS.i18n.example3 + '</div>';
					html += '<div>- ' + NS.i18n.example4 + '</div>';
					html += '<h3 style="padding-top:20px">' + NS.i18n.example5 + '</h3>';
					html += '<div>- ' + NS.i18n.example6 + '</div>';
					html += '<div>- ' + NS.i18n.example7 + '</div>';
					html += '<div>- ' + NS.i18n.example8 + '</div>';
					html += '</div>';

					p.update(html);
				},
				resize: function() {
					var width = this.getWidth();

					if (width < 768 && this.fullSize) {
						this.toggleCmp(false);
						this.fullSize = false;
					}
					else if (width >= 768 && !this.fullSize) {
						this.toggleCmp(true);
						this.fullSize = true;
					}
				}
			}
		});

		setGui = function(layout, xLayout, updateGui) {
			var dimensions = Ext.Array.clean([].concat(layout.columns || [], layout.rows || [], layout.filters || [])),
				dimMap = ns.core.service.layout.getObjectNameDimensionMapFromDimensionArray(dimensions),
				recMap = ns.core.service.layout.getObjectNameDimensionItemsMapFromDimensionArray(dimensions),
				graphMap = layout.parentGraphMap,
				objectName,
				periodRecords,
				fixedPeriodRecords = [],
				dimNames = [],
				isOu = false,
				isOuc = false,
				isOugc = false,
				levels = [],
				groups = [],
				orgunits = [];

			// state
			downloadButton.enable();
            shareButton.enable();

			// set gui
			if (!updateGui) {
				return;
			}

            // dx
            dataSelectedStore.removeAll();

			indicatorAvailableStore.removeAll();
            indicatorGroup.clearValue();

			dataElementAvailableStore.removeAll();
            dataElementGroup.clearValue();
            dataElementDetailLevel.reset();

			dataSetAvailableStore.removeAll();

			//eventDataItemAvailableStore.removeAll();
			//programIndicatorAvailableStore.removeAll();

            //if (Ext.isObject(xLayout.program) && Ext.isString(xLayout.program.id)) {
                //eventDataItemProgram.setValue(xLayout.program.id);
                //onEventDataItemProgramSelect(xLayout.program.id)
            //}

            if (dimMap['dx']) {
                dataSelectedStore.addRecords(recMap['dx']);
            }

			// periods
			fixedPeriodSelectedStore.removeAll();
			period.resetRelativePeriods();
			periodRecords = recMap[dimConf.period.objectName] || [];
			for (var i = 0, periodRecord, checkbox; i < periodRecords.length; i++) {
				periodRecord = periodRecords[i];
				checkbox = relativePeriod.valueComponentMap[periodRecord.id];
				if (checkbox) {
					checkbox.setValue(true);
				}
				else {
					fixedPeriodRecords.push(periodRecord);
				}
			}
			fixedPeriodSelectedStore.add(fixedPeriodRecords);
			ns.core.web.multiSelect.filterAvailable({store: fixedPeriodAvailableStore}, {store: fixedPeriodSelectedStore});

			// group sets
			for (var key in dimensionPanelMap) {
				if (dimensionPanelMap.hasOwnProperty(key)) {
					var panel = dimensionPanelMap[key],
                        a = panel.availableStore,
						s = panel.selectedStore;

                    // reset
                    a.reset();
                    s.removeAll();
                    panel.selectedAll.setValue(false);

                    // add
                    if (Ext.Array.contains(xLayout.objectNames, key)) {
                        if (recMap[key]) {
                            s.add(recMap[key]);
                            ns.core.web.multiSelect.filterAvailable({store: a}, {store: s});
                        }
                        else {
                            panel.selectedAll.setValue(true);
                        }
                    }
				}
			}

			// layout
			ns.app.stores.dimension.removeAll();
			ns.app.stores.col.removeAll();
			ns.app.stores.row.removeAll();
			ns.app.stores.filter.removeAll();

			if (layout.columns) {
				dimNames = [];

				for (var i = 0, dim; i < layout.columns.length; i++) {
					dim = dimConf.objectNameMap[layout.columns[i].dimension];

					if (!Ext.Array.contains(dimNames, dim.dimensionName)) {
						ns.app.stores.col.add({
							id: dim.dimensionName,
							name: dimConf.objectNameMap[dim.dimensionName].name
						});

						dimNames.push(dim.dimensionName);
					}

					ns.app.stores.dimension.remove(ns.app.stores.dimension.getById(dim.dimensionName));
				}
			}

			if (layout.rows) {
				dimNames = [];

				for (var i = 0, dim; i < layout.rows.length; i++) {
					dim = dimConf.objectNameMap[layout.rows[i].dimension];

					if (!Ext.Array.contains(dimNames, dim.dimensionName)) {
						ns.app.stores.row.add({
							id: dim.dimensionName,
							name: dimConf.objectNameMap[dim.dimensionName].name
						});

						dimNames.push(dim.dimensionName);
					}

					ns.app.stores.dimension.remove(ns.app.stores.dimension.getById(dim.dimensionName));
				}
			}

			if (layout.filters) {
				dimNames = [];

				for (var i = 0, dim; i < layout.filters.length; i++) {
					dim = dimConf.objectNameMap[layout.filters[i].dimension];

					if (!Ext.Array.contains(dimNames, dim.dimensionName)) {
						ns.app.stores.filter.add({
							id: dim.dimensionName,
							name: dimConf.objectNameMap[dim.dimensionName].name
						});

						dimNames.push(dim.dimensionName);
					}

					ns.app.stores.dimension.remove(ns.app.stores.dimension.getById(dim.dimensionName));
				}
			}

            // add assigned categories as dimension
            if (!ns.app.layoutWindow.hasDimension(dimConf.category.dimensionName)) {
                ns.app.stores.dimension.add({id: dimConf.category.dimensionName, name: dimConf.category.name});
            }

            // add data as dimension
            if (!ns.app.layoutWindow.hasDimension(dimConf.data.dimensionName)) {
                ns.app.stores.dimension.add({id: dimConf.data.dimensionName, name: dimConf.data.name});
            }

            // add orgunit as dimension
            if (!ns.app.layoutWindow.hasDimension(dimConf.organisationUnit.dimensionName)) {
                ns.app.stores.dimension.add({id: dimConf.organisationUnit.dimensionName, name: dimConf.organisationUnit.name});
            }

			// options
			if (ns.app.optionsWindow) {
				ns.app.optionsWindow.setOptions(layout);
			}

			// organisation units
			if (recMap[dimConf.organisationUnit.objectName]) {
				for (var i = 0, ouRecords = recMap[dimConf.organisationUnit.objectName]; i < ouRecords.length; i++) {
					if (ouRecords[i].id === 'USER_ORGUNIT') {
						isOu = true;
					}
					else if (ouRecords[i].id === 'USER_ORGUNIT_CHILDREN') {
						isOuc = true;
					}
					else if (ouRecords[i].id === 'USER_ORGUNIT_GRANDCHILDREN') {
						isOugc = true;
					}
					else if (ouRecords[i].id.substr(0,5) === 'LEVEL') {
						levels.push(parseInt(ouRecords[i].id.split('-')[1]));
					}
					else if (ouRecords[i].id.substr(0,8) === 'OU_GROUP') {
						groups.push(ouRecords[i].id.split('-')[1]);
					}
					else {
						orgunits.push(ouRecords[i].id);
					}
				}

				if (levels.length) {
					toolMenu.clickHandler('level');
					organisationUnitLevel.setValue(levels);
				}
				else if (groups.length) {
					toolMenu.clickHandler('group');
					organisationUnitGroup.setValue(groups);
				}
				else {
					toolMenu.clickHandler('orgunit');
					userOrganisationUnit.setValue(isOu);
					userOrganisationUnitChildren.setValue(isOuc);
					userOrganisationUnitGrandChildren.setValue(isOugc);
				}

				if (!(isOu || isOuc || isOugc)) {
					if (Ext.isObject(graphMap)) {
						treePanel.selectGraphMap(graphMap);
					}
				}
			}
			else {
				treePanel.reset();
			}
		};

		viewport = Ext.create('Ext.container.Viewport', {
			layout: 'border',
			period: period,
			treePanel: treePanel,
			setGui: setGui,
            westRegion: westRegion,
            centerRegion: centerRegion,
			items: [
				westRegion,
				centerRegion
			],
			listeners: {
				render: function() {
					ns.app.viewport = this;

                    //ns.app.layoutWindow = LayoutWindow();
                    //ns.app.layoutWindow.hide();

                    ns.app.optionsWindow = OptionsWindow();
                    ns.app.optionsWindow.hide();
				},
				afterrender: function() {

					// resize event handler
					westRegion.on('resize', function() {
						var panel = accordion.getExpandedPanel();

						if (panel) {
							panel.onExpand();
						}
					});

					// left gui
					var viewportHeight = westRegion.getHeight(),
						numberOfTabs = (ns.core.init.dimensions ? ns.core.init.dimensions.length : 0) + 3,
						tabHeight = 28,
						minPeriodHeight = 380;

					if (viewportHeight > numberOfTabs * tabHeight + minPeriodHeight) {
						if (!Ext.isIE) {
							accordion.setAutoScroll(false);
							westRegion.setWidth(ns.core.conf.layout.west_width);
							accordion.doLayout();
						}
					}
					else {
						westRegion.hasScrollbar = true;
					}

					// expand first panel
					accordion.getFirstPanel().expand();

					// look for url params
					var id = ns.core.web.url.getParam('id'),
						session = ns.core.web.url.getParam('s'),
						layout;

					if (id) {
						ns.core.web.report.loadTable(id);
					}
					else if (Ext.isString(session) && NS.isSessionStorage && Ext.isObject(JSON.parse(sessionStorage.getItem('dhis2'))) && session in JSON.parse(sessionStorage.getItem('dhis2'))) {
						layout = ns.core.api.layout.Layout(JSON.parse(sessionStorage.getItem('dhis2'))[session]);

						if (layout) {
							ns.core.web.report.getData(layout, true);
						}
					}

                    var initEl = document.getElementById('init');
                    initEl.parentNode.removeChild(initEl);

                    Ext.getBody().setStyle('background', '#fff');
                    Ext.getBody().setStyle('opacity', 0);

					// fade in
					Ext.defer( function() {
						Ext.getBody().fadeIn({
							duration: 600
						});
					}, 300 );
				}
			}
		});

		// add listeners
		(function() {
			ns.app.stores.indicatorAvailable.on('load', function() {
				ns.core.web.multiSelect.filterAvailable(indicatorAvailable, indicatorSelected);
			});

			ns.app.stores.dataElementAvailable.on('load', function() {
				ns.core.web.multiSelect.filterAvailable(dataElementAvailable, dataElementSelected);
			});

			ns.app.stores.dataSetAvailable.on('load', function(s) {
				ns.core.web.multiSelect.filterAvailable(dataSetAvailable, dataSetSelected);
				s.sort('name', 'ASC');
			});
		}());

		return viewport;
	};

	// initialize
	(function() {
		var requests = [],
			callbacks = 0,
			init = {},
            cors,
            ajax,
            fn;

		fn = function() {
			if (++callbacks === requests.length) {

				ns.core = NS.getCore(init, cors);
                ns.alert = ns.core.webAlert;
                ns.ajax = ajax;
				extendCore(ns.core);

				dimConf = ns.core.conf.finals.dimension;
				ns.app.viewport = createViewport();

                ns.core.app.getViewportWidth = function() { return ns.app.viewport.getWidth(); };
                ns.core.app.getViewportHeight = function() { return ns.app.viewport.getHeight(); };
                ns.core.app.getCenterRegionWidth = function() { return ns.app.viewport.centerRegion.getWidth(); };
                ns.core.app.getCenterRegionHeight = function() { return ns.app.viewport.centerRegion.getHeight(); };

                NS.instances.push(ns);
			}
		};

        ajax = function(requestConfig, authConfig, skipRequest) {
            requestConfig = requestConfig || {};
            authConfig = authConfig || cors;
            
            if (authConfig.crossDomain && Ext.isString(authConfig.username) && Ext.isString(authConfig.password)) {
                requestConfig.headers = Ext.isObject(authConfig.headers) ? authConfig.headers : {};
                requestConfig.headers['Authorization'] = 'Basic ' + btoa(authConfig.username + ':' + authConfig.password);
            }

            if (skipRequest) {
                return btoa(authConfig.username + ':' + authConfig.password);
            }
            
            Ext.Ajax.request(requestConfig);
        };

		// requests
        Ext.Ajax.request({
            url: 'conf/cors.conf',
            callback: function(options, success, r) {
                cors = success ? Ext.decode(r.responseText) : {};
                
                Ext.Ajax.request({
                    url: 'manifest.webapp',
                    success: function(r) {
                        init.contextPath = Ext.decode(r.responseText).activities.dhis.href;

                        // system info
                        ajax({
                            url: init.contextPath + '/api/system/info.json',
                            success: function(r) {
                                init.systemInfo = Ext.decode(r.responseText);
                                init.contextPath = init.systemInfo.contextPath || init.contextPath;

                                // date, calendar
                                ajax({
                                    url: init.contextPath + '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyAnalysisRelativePeriod&key=keyHideUnapprovedDataInAnalytics',
                                    success: function(r) {
                                        var systemSettings = Ext.decode(r.responseText);
                                        init.systemInfo.dateFormat = Ext.isString(systemSettings.keyDateFormat) ? systemSettings.keyDateFormat.toLowerCase() : 'yyyy-mm-dd';
                                        init.systemInfo.calendar = systemSettings.keyCalendar;
                                        init.systemInfo.analysisRelativePeriod = systemSettings.keyAnalysisRelativePeriod || 'LAST_12_MONTHS';
                                        init.systemInfo.hideUnapprovedDataInAnalytics = systemSettings.keyHideUnapprovedDataInAnalytics;

                                        // user-account
                                        ajax({
                                            url: init.contextPath + '/api/me/user-account.json',
                                            success: function(r) {
                                                init.userAccount = Ext.decode(r.responseText);

                                                // init
                                                var defaultKeyUiLocale = 'en',
                                                    defaultKeyAnalysisDisplayProperty = 'name',
                                                    namePropertyUrl,
                                                    contextPath,
                                                    keyUiLocale,
                                                    dateFormat;

                                                init.userAccount.settings.keyUiLocale = init.userAccount.settings.keyUiLocale || defaultKeyUiLocale;
                                                init.userAccount.settings.keyAnalysisDisplayProperty = init.userAccount.settings.keyAnalysisDisplayProperty || defaultKeyAnalysisDisplayProperty;

                                                // local vars
                                                contextPath = init.contextPath;
                                                keyUiLocale = init.userAccount.settings.keyUiLocale;
                                                keyAnalysisDisplayProperty = init.userAccount.settings.keyAnalysisDisplayProperty;
                                                namePropertyUrl = keyAnalysisDisplayProperty === defaultKeyAnalysisDisplayProperty ? keyAnalysisDisplayProperty : keyAnalysisDisplayProperty + '|rename(' + defaultKeyAnalysisDisplayProperty + ')';
                                                dateFormat = init.systemInfo.dateFormat;

                                                init.namePropertyUrl = namePropertyUrl;

                                                // calendar
                                                (function() {
                                                    var dhis2PeriodUrl = contextPath + '/dhis-web-commons/javascripts/dhis2/dhis2.period.js',
                                                        defaultCalendarId = 'gregorian',
                                                        calendarIdMap = {'iso8601': defaultCalendarId},
                                                        calendarId = calendarIdMap[init.systemInfo.calendar] || init.systemInfo.calendar || defaultCalendarId,
                                                        calendarIds = ['coptic', 'ethiopian', 'islamic', 'julian', 'nepali', 'thai'],
                                                        calendarScriptUrl,
                                                        createGenerator;

                                                    // calendar
                                                    createGenerator = function() {
                                                        init.calendar = $.calendars.instance(calendarId);
                                                        init.periodGenerator = new dhis2.period.PeriodGenerator(init.calendar, init.systemInfo.dateFormat);
                                                    };

                                                    if (Ext.Array.contains(calendarIds, calendarId)) {
                                                        calendarScriptUrl = contextPath + '/dhis-web-commons/javascripts/jQuery/calendars/jquery.calendars.' + calendarId + '.min.js';

                                                        Ext.Loader.injectScriptElement(calendarScriptUrl, function() {
                                                            Ext.Loader.injectScriptElement(dhis2PeriodUrl, createGenerator);
                                                        });
                                                    }
                                                    else {
                                                        Ext.Loader.injectScriptElement(dhis2PeriodUrl, createGenerator);
                                                    }
                                                }());

                                                // i18n
                                                requests.push({
                                                    url: 'i18n/i18n_app.properties',
                                                    success: function(r) {
                                                        NS.i18n = dhis2.util.parseJavaProperties(r.responseText);

                                                        if (keyUiLocale === defaultKeyUiLocale) {
                                                            Ext.get('init').update(NS.i18n.initializing + '..');
                                                            fn();
                                                        }
                                                        else {
                                                            Ext.Ajax.request({
                                                                url: 'i18n/i18n_app_' + keyUiLocale + '.properties',
                                                                success: function(r) {
                                                                    Ext.apply(NS.i18n, dhis2.util.parseJavaProperties(r.responseText));
                                                                },
                                                                failure: function() {
                                                                    console.log('No translations found for system locale (' + keyUiLocale + ')');
                                                                },
                                                                callback: function() {
                                                                    Ext.get('init').update(NS.i18n.initializing + '..');
                                                                    fn();
                                                                }
                                                            });
                                                        }
                                                    },
                                                    failure: function() {
                                                        Ext.Ajax.request({
                                                            url: 'i18n/i18n_app_' + keyUiLocale + '.properties',
                                                            success: function(r) {
                                                                NS.i18n = dhis2.util.parseJavaProperties(r.responseText);
                                                                Ext.get('init').update(NS.i18n.initializing + '..');
                                                            },
                                                            failure: function() {
                                                                alert('No translations found for system locale (' + keyUiLocale + ') or default locale (' + defaultKeyUiLocale + ').');
                                                            },
                                                            callback: fn
                                                        });
                                                    }
                                                });

                                                // authorization
                                                requests.push({
                                                    url: init.contextPath + '/api/me/authorization/F_VIEW_UNAPPROVED_DATA',
                                                    success: function(r) {
                                                        init.user = init.user || {};
                                                        init.user.viewUnapprovedData = (r.responseText === 'true');
                                                        fn();
                                                    }
                                                });

                                                // root nodes
                                                requests.push({
                                                    url: contextPath + '/api/organisationUnits.json?userDataViewFallback=true&paging=false&fields=id,' + namePropertyUrl + ',children[id,' + namePropertyUrl + ']',
                                                    success: function(r) {
                                                        init.rootNodes = Ext.decode(r.responseText).organisationUnits || [];
                                                        fn();
                                                    }
                                                });

                                                // organisation unit levels
                                                requests.push({
                                                    url: contextPath + '/api/organisationUnitLevels.json?fields=id,name,level&paging=false',
                                                    success: function(r) {
                                                        init.organisationUnitLevels = Ext.decode(r.responseText).organisationUnitLevels || [];

                                                        if (!init.organisationUnitLevels.length) {
                                                            alert('No organisation unit levels found');
                                                        }

                                                        fn();
                                                    }
                                                });

                                                // user orgunits and children
                                                requests.push({
                                                    url: contextPath + '/api/organisationUnits.json?userOnly=true&fields=id,' + namePropertyUrl + ',children[id,' + namePropertyUrl + ']&paging=false',
                                                    success: function(r) {
                                                        var organisationUnits = Ext.decode(r.responseText).organisationUnits || [],
                                                            ou = [],
                                                            ouc = [];

                                                        if (organisationUnits.length) {
                                                            for (var i = 0, org; i < organisationUnits.length; i++) {
                                                                org = organisationUnits[i];

                                                                ou.push(org.id);

                                                                if (org.children) {
                                                                    ouc = Ext.Array.clean(ouc.concat(Ext.Array.pluck(org.children, 'id') || []));
                                                                }
                                                            }

                                                            init.user = init.user || {};
                                                            init.user.ou = ou;
                                                            init.user.ouc = ouc;
                                                        }
                                                        else {
                                                            alert('User is not assigned to any organisation units');
                                                        }

                                                        fn();
                                                    }
                                                });

                                                // legend sets
                                                requests.push({
                                                    url: contextPath + '/api/legendSets.json?fields=id,name,legends[id,name,startValue,endValue,color]&paging=false',
                                                    success: function(r) {
                                                        init.legendSets = Ext.decode(r.responseText).legendSets || [];
                                                        fn();
                                                    }
                                                });

                                                // dimensions
                                                //requests.push({
                                                    //url: contextPath + '/api/dimensions.json?fields=id,name&paging=false',
                                                    //success: function(r) {
                                                        //init.dimensions = Ext.decode(r.responseText).dimensions || [];
                                                        //fn();
                                                    //}
                                                //});

                                                // approval levels
                                                requests.push({
                                                    url: contextPath + '/api/dataApprovalLevels.json?fields=id,name&paging=false&order=level:asc',
                                                    success: function(r) {
                                                        init.dataApprovalLevels = Ext.decode(r.responseText).dataApprovalLevels || [];
                                                        fn();
                                                    }
                                                });

                                                for (var i = 0; i < requests.length; i++) {
                                                    ajax(requests[i]);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
	}());
});
