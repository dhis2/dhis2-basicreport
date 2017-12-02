import { ConfirmButton } from 'd2-analysis/lib/ui/ConfirmButton';

export var DataConfirmWindow;

DataConfirmWindow = function(refs, title, msg, btnText, fn, applyConfig) {
    applyConfig = applyConfig || {};

    var i18n = refs.i18nManager.get();

    var confirmButtonText = btnText || 'OK';
    var cancelButtonText = i18n.close || 'Close';

    var defaults = {
        bodyStyle: 'background:#fff; border:0 none'
    };

    var closeFn = function() {
        window.destroy();
    };

    var confirmButton = new ConfirmButton(refs, { text: confirmButtonText, fn });

    //var cancelButton = new ConfirmButton(refs, { type: 'close', text: cancelButtonText, closeFn });

    var msgCmp = Ext.create('Ext.panel.Panel', {
		html: msg,
		bodyStyle: 'padding:0; border:0 none; font-size:13px',
		style: 'margin-bottom:16px',
		scroll: true
	});

    var window = Ext.create('Ext.window.Window', Object.assign({
        bodyStyle: 'background:#fff; padding:30px 60px 26px 42px',
        defaults: defaults,
        modal: true,
        title: 'Raw data values',
        resizable: false,
        closeable: false,
        updateMsg: function(msg) {
			msgCmp.update(msg);
		},
		removeConfirmButton: function() {
			confirmButton.destroy();
		},
        items: [
            {
                html: title,
                bodyStyle: 'padding:0; border:0 none; font-size:16px',
                style: 'margin-bottom:20px'
            },
            msgCmp,
            confirmButton
        ],
        listeners: {
            afterrender: function() {
				var t = this;
				
                this.setPosition(this.getPosition()[0], this.getPosition()[1] / 2);
            },
            show: function() {
                confirmButton.focus(false, 50);
            }
        }
    }, applyConfig));

    return window;
};
