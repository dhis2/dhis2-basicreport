import {Layout} from 'd2-analysis';

export {Layout};

Layout.prototype.setOrToggleSorting = function(sorting, returnThis) {
    if (!this.sorting || this.sorting.id !== sorting.id) {
        this.sorting = sorting;
    }
    else {
        this.sorting.toggleDirection();
    }

    if (returnThis) {
        return this;
    }
};
