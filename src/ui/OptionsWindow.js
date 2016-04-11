import {isString, isNumber, isBoolean, isObject} from 'd2-utilizr';

export var OptionsWindow;

OptionsWindow = function(c) {
    var t = this,

        appManager = c.appManager,
        uiManager = c.uiManager,
        instanceManager = c.instanceManager,
        i18n = c.i18nManager.get(),
        optionConfig = c.optionConfig,

        showDataDescription,
        hideEmptyRows,
        showHierarchy,
        displayDensity,
        fontSize,
        digitGroupSeparator,
        legendSet,

        data,
        organisationUnits,
        style,

        comboboxWidth = 262,
        comboBottomMargin = 1,
        checkboxBottomMargin = 2,
        separatorTopMargin = 6,
        window;

        showDataDescription = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: i18n.show_descriptions,
            style: 'margin-bottom:' + checkboxBottomMargin + 'px'
        });

        hideEmptyRows = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: i18n.hide_empty_rows,
            style: 'margin-bottom:' + checkboxBottomMargin + 'px'
        });

        showHierarchy = Ext.create('Ext.form.field.Checkbox', {
            boxLabel: i18n.show_hierarchy,
            style: 'margin-bottom:' + checkboxBottomMargin + 'px',
            checked: true
        });

        displayDensity = Ext.create('Ext.form.field.ComboBox', {
            cls: 'ns-combo',
            style: 'margin-bottom:' + comboBottomMargin + 'px',
            width: comboboxWidth,
            labelWidth: 130,
            fieldLabel: i18n.display_density,
            labelStyle: 'color:#333',
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            editable: false,
            value: optionConfig.getDisplayDensity('normal').id,
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'name', 'index'],
                data: optionConfig.getDisplayDensityRecords()
            })
        });

        fontSize = Ext.create('Ext.form.field.ComboBox', {
            cls: 'ns-combo',
            style: 'margin-bottom:' + comboBottomMargin + 'px',
            width: comboboxWidth,
            labelWidth: 130,
            fieldLabel: i18n.font_size,
            labelStyle: 'color:#333',
            queryMode: 'local',
            valueField: 'id',
            displayField: 'name',
            editable: false,
            value: optionConfig.getFontSize('normal').id,
            store: Ext.create('Ext.data.Store', {
                fields: ['id', 'name', 'index'],
                data: optionConfig.getFontSizeRecords()
            })
        });

        data = {
            bodyStyle: 'border:0 none',
            style: 'margin-left:14px',
            items: [
                showDataDescription,
                hideEmptyRows
            ]
        };

        organisationUnits = {
            bodyStyle: 'border:0 none',
            style: 'margin-left:14px',
            items: [
                showHierarchy
            ]
        };

        style = {
            bodyStyle: 'border:0 none',
            style: 'margin-left:14px',
            items: [
                displayDensity,
                fontSize
            ]
        };

        window = Ext.create('Ext.window.Window', {
            title: i18n.table_options,
            bodyStyle: 'background-color:#fff; padding:2px 2px 1px',
            closeAction: 'hide',
            autoShow: true,
            modal: true,
            resizable: false,
            hideOnBlur: true,
            getOptions: function() {
                return {
                    showDataDescription: showDataDescription.getValue(),
                    hideEmptyRows: hideEmptyRows.getValue(),
                    showHierarchy: showHierarchy.getValue(),
                    displayDensity: displayDensity.getValue(),
                    fontSize: fontSize.getValue()
                };
            },
            setOptions: function(layout) {
                showDataDescription.setValue(Ext.isBoolean(layout.showDataDescription) ? layout.showDataDescription : false);
                hideEmptyRows.setValue(Ext.isBoolean(layout.hideEmptyRows) ? layout.hideEmptyRows : false);
                showHierarchy.setValue(Ext.isBoolean(layout.showHierarchy) ? layout.showHierarchy : false);
                displayDensity.setValue(isString(layout.displayDensity) ? layout.displayDensity : optionConfig.getDisplayDensity('normal').id);
                fontSize.setValue(isString(layout.fontSize) ? layout.fontSize : optionConfig.getFontSize('normal').id);
            },
            items: [
                {
                    bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                    style: 'margin-top:4px; margin-bottom:6px; margin-left:5px',
                    html: i18n.data
                },
                data,
                {
                    bodyStyle: 'border:0 none; padding:7px'
                },
                {
                    bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                    style: 'margin-top:4px; margin-bottom:6px; margin-left:5px',
                    html: i18n.organisation_units
                },
                organisationUnits,
                {
                    bodyStyle: 'border:0 none; padding:7px'
                },
                {
                    bodyStyle: 'border:0 none; color:#222; font-size:12px; font-weight:bold',
                    style: 'margin-bottom:6px; margin-left:5px',
                    html: i18n.style
                },
                style
            ],
            bbar: [
                '->',
                {
                    text: i18n.hide,
                    handler: function() {
                        window.hide();
                    }
                },
                {
                    text: '<b>' + i18n.update + '</b>',
                    handler: function() {
                        instanceManager.getReport();

                        window.hide();
                    }
                }
            ],
            listeners: {
                show: function(w) {
                    var optionsButton = uiManager.get('optionsButton') || {};

                    if (optionsButton.rendered) {
                        uiManager.setAnchorPosition(w, optionsButton);

                        if (!w.hasHideOnBlurHandler) {
                            uiManager.addHideOnBlurHandler(w);
                        }
                    }

                    // cmp
                    w.showDataDescription = showDataDescription;
                    w.hideEmptyRows = hideEmptyRows;
                    w.showHierarchy = showHierarchy;
                    w.displayDensity = displayDensity;
                    w.fontSize = fontSize;
                }
            }
        });

    return window;
};
