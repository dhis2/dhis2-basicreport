import isNumber from 'd2-utilizr/lib/isNumber';
import arrayClean from 'd2-utilizr/lib/arrayClean';

export var OrganisationUnit;

OrganisationUnit = function(config) {
    var t = this;

    t.klass = OrganisationUnit;

    // constructor
    t.id = config.id;
    t.name = config.name;
    t.level = config.level;
    t.metaData = config.metaData;

    // transient
    t.parentGraph = t.metaData.ouHierarchy[t.id];

    // uninitialized
    t.parentIdArray;

    t.parentNameArray;

    // support
    t.getValidLevel = function(level) {
        return (isNumber(level) && level > 0) ? level : 1;
    };
};

// base

OrganisationUnit.prototype.getParentIdArray = function() {
    if (this.parentIdArray) {
        return this.parentIdArray;
    }

    return this.parentIdArray = arrayClean(this.parentGraph.split('/'));
};

OrganisationUnit.prototype.getParentNameArray = function() {
    if (this.parentNameArray) {
        return this.parentNameArray;
    }

    return this.parentNameArray = arrayClean((this.metaData.ouNameHierarchy[this.name] || '').split('/'));
};

OrganisationUnit.prototype.getParentGraphById = function(id) {
    return this.parentGraph.split(id)[0];
};

// dep 1

OrganisationUnit.prototype.getParentIdByLevel = function(level) {
    var parentIdArray = this.getParentIdArray(),
        i = this.getValidLevel(level) - 1;

    return parentIdArray[i];
};

OrganisationUnit.prototype.getParentIdArrayByLevels = function(startLevel, endLevel) {
    var parentIdArray = this.getParentIdArray(),
        i = this.getValidLevel(startLevel) - 1;

    return parentIdArray.slice(i, endLevel || parentIdArray.length);
};

OrganisationUnit.prototype.getParentNameByLevel = function(level) {
    var parentNameArray = this.getParentNameArray(),
        i = this.getValidLevel(level) - 1;

    return parentNameArray[i];
};

OrganisationUnit.prototype.getParentNameArrayByLevels = function(startLevel, endLevel) {
    var parentNameArray = this.getParentNameArray(),
        i = this.getValidLevel(startLevel) - 1;

    return parentNameArray.slice(i, endLevel || parentNameArray.length);
};

OrganisationUnit.prototype.getParentGraphMapById = function(id) {
    var map = {};
    map[id] = this.getParentGraphById(id);

    return map;
};

// dep 2

OrganisationUnit.prototype.getSortIdByLevel = function(level) {
    return this.getParentNameArrayByLevels(level).join('');
};

// dep 3

OrganisationUnit.prototype.getContextMenuItemsConfig = function(level) {
    var t = this;

    var appManager = t.klass.appManager;

    var items = [],
        levels = appManager.organisationUnitLevels,
        ouId = this.getParentIdByLevel(level) || this.id,
        ouName = this.getParentNameByLevel(level) || this.name,
        levelName = levels[level - 1].name,
        pOuId,
        pOuName,
        gpOuId,
        gpOuName,
        pLevelName,
        cLevelName;

    if (level > 1) {
        pOuId = this.getParentIdByLevel(level - 1) || this.id;
        pOuName = this.getParentNameByLevel(level - 1) || this.name;
        pLevelName = levels[level - 2].name;

        // up
        items.push({
            isSubtitle: true,
            text: 'Drill up to ' + pLevelName + ' level'
        });

        if (level === 2) {

            // show root
            items.push({
                id: pOuId,
                text: 'Show <span class="name">' + pOuName + '</span>',
                iconCls: 'ns-menu-item-float'
            });
        }
        else {

            // show parent only
            items.push({
                id: pOuId,
                text: 'Show <span class="name">' + pOuName + '</span> only',
                iconCls: 'ns-menu-item-float',
                parentGraphMap: this.getParentGraphMapById(pOuId)
            });

            if (level > 3) {
                gpOuId = this.getParentIdByLevel(level - 2) || this.id;
                gpOuName = this.getParentNameByLevel(level - 2) || this.name;

                items.push({
                    id: gpOuId + ';LEVEL-' + (level - 1),
                    text: 'Show <span class="name">' + pLevelName + '</span> units in <span class="name">' + gpOuName + '</span>',
                    iconCls: 'ns-menu-item-float',
                    parentGraphMap: this.getParentGraphMapById(gpOuId)
                });
            }

            items.push({
                id: 'LEVEL-' + (level - 1),
                text: 'Show all <span class="name">' + pLevelName + '</span> units',
                iconCls: 'ns-menu-item-float'
            });
        }

        // expand
        items.push({
            isSubtitle: true,
            text: levelName + ' level'
        });

        items.push({
            id: ouId,
            text: 'Show <span class="name">' + ouName + '</span> only',
            iconCls: 'ns-menu-item-expand',
            parentGraphMap: this.getParentGraphMapById(ouId)
        });

        if (level > 2) {
            items.push({
                id: pOuId + ';LEVEL-' + level,
                text: 'Show <span class="name">' + levelName + '</span> units in <span class="name">' + pOuName + '</span>',
                iconCls: 'ns-menu-item-expand',
                parentGraphMap: this.getParentGraphMapById(pOuId)
            });
        }

        items.push({
            id: 'LEVEL-' + level,
            text: 'Show all <span class="name">' + levelName + '</span> units',
            iconCls: 'ns-menu-item-expand'
        });
    }

    if (level < levels.length) {
        cLevelName = levels[level].name;

        // down
        items.push({
            isSubtitle: true,
            text: 'Drill down to <span class="name">' + cLevelName + '</span> level'
        });

        items.push({
            id: ouId + ';LEVEL-' + (level + 1),
            text: 'Show <span class="name">' + cLevelName + '</span> units in <span class="name">' + ouName + '</span>',
            iconCls: 'ns-menu-item-drill',
            parentGraphMap: this.getParentGraphMapById(ouId)
        });

        if (level > 1) {
            items.push({
                id: 'LEVEL-' + (level + 1),
                text: 'Show all <span class="name">' + cLevelName + '</span> units',
                iconCls: 'ns-menu-item-drill'
            });
        }
    }

    return items;
};
