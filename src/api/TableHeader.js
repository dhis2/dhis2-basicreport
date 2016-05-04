import isNumeric from 'd2-utilizr/lib/isNumeric';

export var TableHeader;

TableHeader = function(config) {
    var t = this;

    t.id = config.id;
    t.elementId = Ext.data.IdGenerator.get('uuid').generate();
    t.name = config.name;
    t.objectName = config.objectName;
    t.index = config.index;

    if (isNumeric(config.level)) {
        t.level = parseInt(config.level);
    }

    t.cls = 'pivot-dim td-sortable pointer';

    // transient
    t.reduceIndex;
    t.html;
};

TableHeader.prototype.getHtml = function() {
    this.html = '<td';
    this.html += this.elementId ? (' id="' + this.elementId + '"') : '';
    this.html += this.cls ? (' class="' + this.cls + '"') : '';
    this.html += this.style ? (' style="' + this.style + '"') : '';
    this.html += '>' + this.name + '</td>';

    return this.html;
};
