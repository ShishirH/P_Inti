class ArrayColorWidgetAddition {
    constructor(options) {
        options.radius = options.radius || 10;
        options.fill = "white";
        options.strokeWidth = options.strokeWidth || 0;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Circle, options, this);
        background.parent = options.parent;
        background.array = options.array;

        background.oldRender = background.render;
        background.render = function (ctx) {
            if (!background.array.isCompressed) {
                ctx.save();
                ctx.font = "12px Helvetica";
                background.oldRender(ctx);
                var center = background.getPointByOrigin('center', 'center');
                ctx.fillText("+", center.x, center.y + 1);

                ctx.restore();
            }
        };

        this.progvolverType = "ArrayColorWidgetAddition";

        return background;
    }
}