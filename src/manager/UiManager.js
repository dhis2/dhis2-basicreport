import {UiManager} from 'd2-analysis';

export {UiManager};

UiManager.prototype.getContextMenuXY = function(extElement) {
    var height = extElement.getHeight(),
        width = extElement.getWidth(),
        xy = extElement.getXY();

    xy[0] += width - (width * 0.13);
    xy[1] += height - (height / 2);

    return xy;
};
