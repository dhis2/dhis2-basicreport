export var OrganisationUnitLevel;

OrganisationUnitLevel = function(refs, config) {
    var t = this;

    // constructor
    t.id = config.id;
    t.name = config.name;
    t.level = config.level;

    t.objectName = config.objectName;
    t.cls = config.cls;
    t.index = config.index;

    t.getRefs = function() {
        return refs;
    };
};

OrganisationUnitLevel.prototype.clone = function() {
    return new OrganisationUnitLevel(this);
};
