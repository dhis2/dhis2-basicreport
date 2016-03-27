import {InstanceManager} from 'd2-analysis';

export InstanceManager;

InstanceManager.prototype.getReport = function(layout) {
    var t = this;

    if (!layout) {
        layout = t.getLayout();

        if (!layout) {
            return;
        }
    }
    
    t.tableManager.getHtml(layout, function(table) {
        t.fn(table);
    });
};
    
