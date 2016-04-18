import './extjs/resources/css/ext-all-gray.css';
import './src/css/style.css';

import isString from 'd2-utilizr/lib/isString';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import {api, manager, config, ui, init} from 'd2-analysis';

import {DataObject} from './src/api/DataObject';
import {OrganisationUnit} from './src/api/OrganisationUnit';
import {Period} from './src/api/Period';
import {Response} from './src/api/Response';
import {Table} from './src/api/Table';
import {TableCell} from './src/api/TableCell';
import {OrganisationUnitTableCell} from './src/api/TableCell.OrganisationUnit';
import {PeriodTableCell} from './src/api/TableCell.Period';
import {TableHeader} from './src/api/TableHeader';
import {TableRow} from './src/api/TableRow';

import {InstanceManager} from './src/manager/InstanceManager';
import {TableManager} from './src/manager/TableManager';

import {OptionsWindow} from './src/ui/OptionsWindow';
import {Viewport} from './src/ui/Viewport';

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

// references
var refs = {
    api: api
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
refs.instanceManager = instanceManager;

// dependencies

    // instance manager
uiManager.setInstanceManager(instanceManager);

    // i18n manager
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

// apply to
appManager.applyTo(arrayTo(api));
instanceManager.applyTo(arrayTo(api));
calendarManager.applyTo(arrayTo(api));
tableManager.applyTo(arrayTo(api));
uiManager.applyTo(arrayTo(api));
optionConfig.applyTo(arrayTo(api));

// requests
var manifestReq = $.getJSON('manifest.webapp');
var systemInfoUrl = '/api/system/info.json';
var systemSettingsUrl = '/api/systemSettings.json?key=keyCalendar&key=keyDateFormat&key=keyAnalysisRelativePeriod&key=keyHideUnapprovedDataInAnalytics';
var userAccountUrl = '/api/me/user-account.json';

var systemInfoReq;
var systemSettingsReq;
var userAccountReq;

manifestReq.done(function(manifest) {
    appManager.manifest = manifest;
    appManager.env = process.env.NODE_ENV;
    appManager.setAuth();
    systemInfoReq = $.getJSON(appManager.getPath() + systemInfoUrl);

systemInfoReq.done(function(systemInfo) {
    appManager.systemInfo = systemInfo;
    appManager.path = systemInfo.contextPath;
    systemSettingsReq = $.getJSON(appManager.getPath() + systemSettingsUrl);

systemSettingsReq.done(function(systemSettings) {
    appManager.systemSettings = systemSettings;
    userAccountReq = $.getJSON(appManager.getPath() + userAccountUrl);

userAccountReq.done(function(userAccount) {
    appManager.userAccount = userAccount;
    calendarManager.setBaseUrl(appManager.getPath());
    calendarManager.setDateFormat(appManager.getDateFormat());
    calendarManager.init(appManager.systemSettings.keyCalendar);

requestManager.add(new api.Request(init.i18nInit(refs)));
requestManager.add(new api.Request(init.rootNodesInit(refs)));
requestManager.add(new api.Request(init.organisationUnitLevelsInit(refs)));
requestManager.add(new api.Request(init.legendSetsInit(refs)));

global.refs = refs;

requestManager.set(initialize);
requestManager.run();

});});});});

function initialize() {

    // app manager
    appManager.appName = 'Basic Report';
    appManager.sessionName = 'basicreport';

    // instance manager
    instanceManager.apiResource = 'reportTables';

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

    // instance manager
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

    // windows
    uiManager.reg(OptionsWindow(refs), 'optionsWindow').hide();

    // viewport
    uiManager.reg(Viewport(refs), 'viewport');
}
