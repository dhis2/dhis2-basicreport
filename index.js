import './extjs/resources/css/ext-all-gray.css';
import './src/css/style.css';

import isString from 'd2-utilizr/lib/isString';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import { api, manager, config, ui, init } from 'd2-analysis';

import { DataObject } from './src/api/DataObject';
import { OrganisationUnit } from './src/api/OrganisationUnit';
import { Period } from './src/api/Period';
import { Response } from './src/api/Response';
import { Table } from './src/api/Table';
import { TableCell } from './src/api/TableCell';
import { OrganisationUnitTableCell } from './src/api/TableCell.OrganisationUnit';
import { PeriodTableCell } from './src/api/TableCell.Period';
import { TableHeader } from './src/api/TableHeader';
import { TableRow } from './src/api/TableRow';

import { Layout } from './src/api/Layout';

import { InstanceManager } from './src/manager/InstanceManager';
import { TableManager } from './src/manager/TableManager';
import { UiManager } from './src/manager/UiManager';

import { DataConfirmWindow } from './src/ui/DataConfirmWindow';
import { OptionsWindow } from './src/ui/OptionsWindow';
import { Viewport } from './src/ui/Viewport';

// extend
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

ui.DataConfirmWindow = DataConfirmWindow;

// override
api.Layout = Layout;

manager.InstanceManager = InstanceManager;
manager.TableManager = TableManager;
manager.UiManager = UiManager;

// references
var refs = {
    api,
	ui
};

    // dimension config
var dimensionConfig = new config.DimensionConfig();
refs.dimensionConfig = dimensionConfig;

    // option config
var optionConfig = new config.OptionConfig();
refs.optionConfig = optionConfig;

    // period config
var periodConfig = new config.PeriodConfig();
refs.periodConfig = periodConfig;

    // ui config
var uiConfig = new config.UiConfig();
refs.uiConfig = uiConfig;

    // app manager
var appManager = new manager.AppManager();
appManager.sessionName = 'basicreport';
appManager.apiVersion = 27;
refs.appManager = appManager;

    // calendar manager
var calendarManager = new manager.CalendarManager(refs);
refs.calendarManager = calendarManager;

    // request manager
var requestManager = new manager.RequestManager(refs);
refs.requestManager = requestManager;

    // i18n manager
var i18nManager = new manager.I18nManager(refs);
refs.i18nManager = i18nManager;

    // sessionstorage manager
var sessionStorageManager = new manager.SessionStorageManager(refs);
refs.sessionStorageManager = sessionStorageManager;

    // ui manager
var uiManager = new manager.UiManager(refs);
refs.uiManager = uiManager;

    // table manager
var tableManager = new manager.TableManager(refs);
refs.tableManager = tableManager;

    // instance manager
var instanceManager = new manager.InstanceManager(refs);
instanceManager.apiResource = 'reportTables';
instanceManager.dataStatisticsEventType = 'DATA_TABLE_VIEW';
refs.instanceManager = instanceManager;

// dependencies
uiManager.setInstanceManager(instanceManager);
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

appManager.applyTo(arrayTo(api));
instanceManager.applyTo(arrayTo(api));
calendarManager.applyTo(arrayTo(api));
tableManager.applyTo(arrayTo(api));
uiManager.applyTo(arrayTo(api));
optionConfig.applyTo(arrayTo(api));

// requests
var manifestReq = $.ajax({
    url: 'manifest.webapp',
    dataType: 'text',
    headers: {
        'Accept': 'text/plain; charset=utf-8'
    }
});

var systemInfoUrl = '/api/system/info.json';
var systemSettingsUrl = '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyAnalysisRelativePeriod&key=keyHideUnapprovedDataInAnalytics';
var userAccountUrl = '/api/me/user-account.json';

manifestReq.done(function(text) {
    appManager.manifest = JSON.parse(text);;
    appManager.env = process.env.NODE_ENV;
    appManager.setAuth();

    var systemInfoReq = $.getJSON(appManager.getPath() + systemInfoUrl);

systemInfoReq.done(function(systemInfo) {
    appManager.systemInfo = systemInfo;
    appManager.path = systemInfo.contextPath;

    var systemSettingsReq = $.getJSON(appManager.getPath() + systemSettingsUrl);

systemSettingsReq.done(function(systemSettings) {
    appManager.systemSettings = systemSettings;

    var userAccountReq = $.getJSON(appManager.getPath() + userAccountUrl);

userAccountReq.done(function(userAccount) {
    appManager.userAccount = userAccount;
    calendarManager.setBaseUrl(appManager.getPath());
    calendarManager.setDateFormat(appManager.getDateFormat());
    calendarManager.init(appManager.systemSettings.keyCalendar);

requestManager.add(new api.Request(refs, init.i18nInit(refs)));
requestManager.add(new api.Request(refs, init.rootNodesInit(refs)));
requestManager.add(new api.Request(refs, init.organisationUnitLevelsInit(refs)));
requestManager.add(new api.Request(refs, init.legendSetsInit(refs)));

requestManager.set(initialize);
requestManager.run();

});});});});

function initialize() {

    // i18n init
    var i18n = i18nManager.get();

    optionConfig.init();
    dimensionConfig.init();
    periodConfig.init();

    // ui config
    uiConfig.checkout('aggregate');

    // app manager
    appManager.appName = 'Basic Report';

    // instance manager
    instanceManager.setFn(function(table) {
        table.update = function(isSorting) {
            uiManager.update(table.getHtml());
            table.addHeaderClickListeners();
            table.addOuClickListeners();
            table.addPeClickListeners();
            table.addValueClickListeners();
        };

        table.update();

        tableManager.unmask();
    });

    // ui manager
    uiManager.disableRightClick();

    uiManager.enableConfirmUnload();

    uiManager.setIntroHtml(function() {
        return '<div class="ns-viewport-text" style="padding:20px">' +
            '<h3>' + i18nManager.get('example1') + '</h3>' +
            '<div>- ' + i18nManager.get('example2') + '</div>' +
            '<div>- ' + i18nManager.get('example3') + '</div>' +
            '<div>- ' + i18nManager.get('example4') + '</div>' +
            '<div>- ' + i18nManager.get('example5') + '</div>' +
            '</div>';
    }());

    // windows
    uiManager.reg(OptionsWindow(refs), 'optionsWindow').hide();

    // viewport
    uiManager.reg(Viewport(refs), 'viewport');
}

global.refs = refs;
