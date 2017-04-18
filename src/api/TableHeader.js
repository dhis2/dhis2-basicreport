import isNumeric from 'd2-utilizr/lib/isNumeric';

export var TableHeader;

TableHeader = function(refs, config) {
    var t = this;

    t.id = config.id;
    t.elementId = Ext.data.IdGenerator.get('uuid').generate();
    t.name = config.name;
    t.objectName = config.objectName;
    t.index = config.index;
    t.hidden = config.hidden || false;

    if (isNumeric(config.level)) {
        t.level = parseInt(config.level);
    }

    t.cls = 'pivot-dim td-sortable pointer';

    // transient
    t.reduceIndex;
    t.html = '';

    t.getRefs = function() {
        return refs;
    };
};

TableHeader.prototype.getHtml = function() {
    if (!this.hidden) {
        this.html = '<td';
        this.html += this.elementId ? (' id="' + this.elementId + '"') : '';
        this.html += this.cls ? (' class="' + this.cls + '"') : '';
        this.html += this.style ? (' style="' + this.style + '"') : '';
        this.html += '>' + this.name + '</td>';
    }

    return this.html;
};
