class MinimizeButton {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.originX = 'center';
        options.radius = 6;
        options.originY = 'center';
        options.value = "";
        options.fill = options.fill || "#FED9A6";
        options.stroke = options.stroke || darken(options.fill);
        options.objectCaching = true;
        options.nonResizable = false;
        options.lockScalingX = false;

        var background = createObjectBackground(fabric.Circle, options);
        background.parent = options.parent;

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            if (!background.parent.isCompressed) {
                ctx.font = 'bold 10px Helvetica';

                if (background.sign === '?' || background.sign === 'X') {
                    ctx.font = 'bold 13px Helvetica';
                }

                ctx.fillStyle = darken(darken(background.fill));
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                var center = background.getPointByOrigin('center', 'center');
                
                if (background.sign == '+') {
                    center.y += 1;
                }
                ctx.fillText(background.sign, center.x, center.y);
            }
            ctx.restore();
        }

        registerProgvolverObject(this);
        return background;
    }
}
