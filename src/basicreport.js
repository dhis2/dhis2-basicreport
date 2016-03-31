import './css/style.css';

import isArray from 'd2-utilizr/lib/isArray';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import {api, manager, config, init} from 'd2-analysis';

import {DataObject} from './api/DataObject';
import {OrganisationUnit} from './api/OrganisationUnit';
import {Period} from './api/Period';
import {Response} from './api/Response';
import {Table} from './api/Table';
import {TableCell} from './api/TableCell';
import {OrganisationUnitTableCell} from './api/TableCell.OrganisationUnit';
import {PeriodTableCell} from './api/TableCell.Period';
import {TableHeader} from './api/TableHeader';
import {TableRow} from './api/TableRow';

import {InstanceManager} from './manager/InstanceManager';
import {TableManager} from './manager/TableManager';

// extends
api.DataObject = DataObject;
api.OrganisationUnit = OrganisationUnit;
api.Period = Period;
api.Response = Response;
api.Table = Table;
api.TableCell = TableCell;
api.OrganisationUnitTableCell = OrganisationUnitTableCell;
api.PeriodTableCell = PeriodTableCell;
api.TableHeader = TableHeader;
api.TableRow = TableRow;

manager.InstanceManager = InstanceManager;
manager.TableManager = TableManager;

// plugin
var plugin = {
    url: null,
    username: null,
    password: null,
    load: function(...layouts) {
        if (!layouts.length) {
            return;
        }

        layouts = isArray(layouts[0]) ? layouts[0] : layouts;

        _load(layouts);
    }
};

global.basicReportPlugin = plugin;

var refs = {};

// dimension config
var dimensionConfig = new config.DimensionConfig();
refs.dimensionConfig = dimensionConfig;

// option config
var optionConfig = new config.OptionConfig();
refs.optionConfig = optionConfig;

// period config
var periodConfig = new config.PeriodConfig();
refs.periodConfig = periodConfig;

// app manager
var appManager = new manager.AppManager();
refs.appManager = appManager;

// calendar manager
var calendarManager = new manager.CalendarManager();
refs.calendarManager = calendarManager;

// request manager
var requestManager = new manager.RequestManager();
refs.requestManager = requestManager;

// i18n manager
var i18nManager = new manager.I18nManager();
refs.i18nManager = i18nManager;

// sessionstorage manager
var sessionStorageManager = new manager.SessionStorageManager();
refs.sessionStorageManager = sessionStorageManager;

dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);

appManager.applyTo(arrayTo(api));
dimensionConfig.applyTo(arrayTo(pivot));
optionConfig.applyTo([].concat(arrayTo(api), arrayTo(pivot)));

function _load(layouts) {
    if (!layouts.length) {
        return;
    }

    appManager.path = plugin.url;
    appManager.setAuth(plugin.username && plugin.password ? plugin.username + ':' + plugin.password : null);

    // user account
    $.getJSON(appManager.path + '/api/me/user-account.json').done(function(userAccount) {
        appManager.userAccount = userAccount;

        requestManager.add(new api.Request(init.legendSetsInit(refs)));
        requestManager.add(new api.Request(init.dimensionsInit(refs)));

        requestManager.set(_initialize, layouts);
        requestManager.run();
    });

    function _initialize(layouts) {
        layouts.forEach(function(layout) {

            layout = new api.Layout(layout);

            if (plugin.spinner) {
                $('#' + layout.el).append('<div class="spinner"></div>');
            }

            var instanceRefs = {
                dimensionConfig: dimensionConfig,
                optionConfig: optionConfig,
                periodConfig: periodConfig,
                api: api,
                appManager: appManager,
                calendarManager: calendarManager,
                requestManager: requestManager,
                sessionStorageManager: sessionStorageManager
            };

            var uiManager = new manager.UiManager();
            instanceRefs.uiManager = uiManager;
            uiManager.applyTo(arrayTo(api));

            var instanceManager = new manager.InstanceManager(instanceRefs);
            instanceRefs.instanceManager = instanceManager;
            instanceManager.apiResource = 'reportTables';
            instanceManager.applyTo(arrayTo(api));

            var tableManager = new manager.TableManager(instanceRefs);
            instanceRefs.tableManager = tableManager;

            instanceManager.setFn(function(table) {
				table.update = function(isSorting) {
					uiManager.update(table.generateHtml());
					table.addHeaderClickListeners();
					table.addOuClickListeners();
					table.addPeClickListeners();
				};

				table.update();
				
				uiManager.unmask();
			});

            if (layout.id) {
                instanceManager.getById(layout.id, function(_layout) {
                    _layout.el = layout.el;
                    instanceManager.getReport(_layout);
                });
            }
            else {
                instanceManager.getReport(layout);
            }
        });
    }
}


