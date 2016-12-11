export var TableCell;

TableCell = function(config) {
    var t = this,
        id = Ext.data.IdGenerator.get('uuid').generate();

    t.id = id;
    t.elementId = id;
    t.name = config.name;
    t.sortId = config.sortId;
    t.cls = config.cls;
    t.style = config.style;
    t.title = config.title;
    t.isEmpty = !!config.isEmpty;

    // auto
    if (t.isEmpty) {
        t.name = '';
        t.sortId = '';
        t.cls = 'empty';
        t.style = '';
    }

    // transient
    t.span;
    t.display;
    t.html;
};

TableCell.prototype.getHtml = function() {
    if (this.html) {
        return this.html;
    }

    var cls = (this.cls ? this.cls : '') + (this.hidden ? ' td-hidden' : '') + (this.span > 1 ? ' td-aligntop' : '');

    this.html = '<td';
    this.html += this.elementId ? (' id="' + this.elementId + '"') : '';
    this.html += cls ? (' class="' + cls + '"') : '';
    this.html += this.style ? (' style="' + this.style + '"') : '';
    this.html += this.span ? (' rowspan="' + this.span + '"') : '';
    this.html += this.title ? (' title="' + this.title + '"') : '';
    this.html += '>' + this.name + '</td>';

    return this.html;
};
