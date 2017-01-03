import { UiManager } from 'd2-analysis';

export { UiManager };

UiManager.prototype.getContextMenuXY = function(extElement) {
    var height = extElement.getHeight(),
        width = extElement.getWidth(),
        xy = extElement.getXY();

    xy[0] += width - (width * 0.13);
    xy[1] += height - (height / 2);

    return xy;
};

UiManager.prototype.getElTitleByLegend = function(legend) {
    return legend ? `${legend.name} (${legend.startValue}-${legend.endValue})` : '';
};

UiManager.prototype.hexToRgb = function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : null;
};

UiManager.prototype.calculateColorBrightness = function(rgb) {
    return Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
};

// dep 1

UiManager.prototype.isColorBright = function(rgbColor) {
    return this.calculateColorBrightness(rgbColor) > 125;
};

