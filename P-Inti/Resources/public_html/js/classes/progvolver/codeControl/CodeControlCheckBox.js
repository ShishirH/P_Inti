class CodeControlCheckBox {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.height = options.height || 300;
        options.width = options.width || 270;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = options.fill || "#B3CDE3";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;
        options.nonResizable = false;
        options.lockScalingX = false;

        var background = createObjectBackground(fabric.Rect, options);
        background.visibility = false;
        background.value = options.value;

        background.oldRender = background.render;

        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = '18px Helvetica';
            ctx.fillStyle = 'black';
            var center = background.getPointByOrigin('center', 'center');
            ctx.fillText(background.value, center.x - 6, center.y + 6);

            ctx.restore();
        }

        background.registerListener('mouseup', function () {
            CodeControls.updateSelectedCodeControl(background);
        })
        return background;
    }
}
