import '../extjs/resources/css/ext-all-gray.css';
import './css/style.css';

import isString from 'd2-utilizr/lib/isString';
import arrayFrom from 'd2-utilizr/lib/arrayFrom';
import arrayTo from 'd2-utilizr/lib/arrayTo';

import {api, manager, config, ui, init} from 'd2-analysis';

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

import {OptionsWindow} from './ui/OptionsWindow';
import {Viewport} from './ui/Viewport';

// manager instances
var appManager = new manager.AppManager();
var calendarManager = new manager.CalendarManager();
var requestManager = new manager.RequestManager();
var responseManager = new manager.ResponseManager();
var i18nManager = new manager.I18nManager();
var sessionStorageManager = new manager.SessionStorageManager();
var uiManager;
var instanceManager;
var tableManager;

// config instances
var dimensionConfig = new config.DimensionConfig();
var optionConfig = new config.OptionConfig();
var periodConfig = new config.PeriodConfig();
var uiConfig = new config.UiConfig();

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
var ref = {
    appManager: appManager,
    calendarManager: calendarManager,
    requestManager: requestManager,
    responseManager: responseManager,
    i18nManager: i18nManager,
    sessionStorageManager: sessionStorageManager,
    dimensionConfig: dimensionConfig,
    optionConfig: optionConfig,
    periodConfig: periodConfig,
    uiConfig: uiConfig,
    api: api
};

// managers
uiManager = new manager.UiManager(ref);
ref.uiManager = uiManager;

tableManager = new manager.TableManager(ref);
ref.tableManager = tableManager;

instanceManager = new manager.InstanceManager(ref);
instanceManager.setApiResource('reportTables');
ref.instanceManager = instanceManager;

uiManager.setInstanceManager(instanceManager);

// set i18n
dimensionConfig.setI18nManager(i18nManager);
optionConfig.setI18nManager(i18nManager);
periodConfig.setI18nManager(i18nManager);
uiManager.setI18nManager(i18nManager);

// apply to
appManager.applyTo(arrayTo(api));
instanceManager.applyTo(arrayTo(api));
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
    calendarManager.generate(appManager.systemSettings.keyCalendar);

requestManager.add(new api.Request(init.i18nInit(ref)));
requestManager.add(new api.Request(init.rootNodesInit(ref)));
requestManager.add(new api.Request(init.organisationUnitLevelsInit(ref)));
requestManager.add(new api.Request(init.legendSetsInit(ref)));

requestManager.set(createUi);
requestManager.run();

});});});});

function createUi() {

    // app manager
    appManager.appName = 'Basic Report';

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


                //web.mask.show(ns.app.centerRegion);

                //web.report.getHtml(layout, function(table) {
                    //table.update = function(isSorting) {
                        //ns.app.centerRegion.removeAll(true);

                        //ns.app.dateRender = new Date();
                        //ns.app.centerRegion.update(table.generateHtml());
                        //ns.app.dateTotal = new Date();

                        //table.addHeaderClickListeners();
                        //table.addOuClickListeners(layout, web.report.createReport);
                        //table.addPeClickListeners(layout, web.report.createReport);
                    //};

                    //table.update();

                    //// after render
                    //if (isUpdateOuGui) {
                        //ns.app.viewport.setGui(layout);
                    //}

                    //ns.app.layout = layout;

                    //if (NS.isDebug) {
                        //console.log("RENDER", (ns.app.dateTotal - ns.app.dateRender) / 1000);
                        //console.log("layout", ns.app.layout);
                        //console.log("table", table);
                    //}

                    //web.mask.hide(ns.app.centerRegion);    

    // instance manager
    instanceManager.setFn(function(table) {
        console.log("table", table);
    });

    // windows
    var optionsWindow = uiManager.reg(OptionsWindow(ref), 'optionsWindow');
    optionsWindow.hide();

    // viewport
    Viewport(ref);
}
