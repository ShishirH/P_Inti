class MinimizeButton {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.originX = 'center';
        options.originY = 'center';
        options.value = "";
        options.fill = options.fill || "#FED9A6";
        options.stroke = options.stroke || darken(options.fill);
        options.objectCaching = true;
        options.nonResizable = false;
        options.lockScalingX = false;

        function createBackground(baseClass, options) {
            var theWidget = this;
            var BackgroundClass = iVoLVER.util.createClass(baseClass, {
                initialize: function (options) {
                    options || (options = {});
                    options.noScaleCache = false; // to guarantee that the object gets updated during scaling
                    this.callSuper('initialize', options);
                    this.initExpandable();
                }
            });
            iVoLVER.util.extends(BackgroundClass.prototype, iVoLVER.model.Expandable);
            var fill = options.fill || iVoLVER.util.getRandomColor();
            options.fill = fill;
            options.originX = options.originX || 'center';
            options.originY = options.originY || 'center';
            options.top = options.y;
            options.left = options.x;
            options.stroke = options.stroke || darken(fill);
            options.strokeWidth = options.strokeWidth || 1;
            options.strokeUniform = options.strokeUniform || true;
            options.transparentCorners = options.transparentCorners || false;
            options.cornerColor = options.cornerColor || lighten(fill, 15);
            options.borderColor = options.borderColor || lighten(fill, 10);
            options.borderDashArray = options.borderDashArray || [7, 7];
            options.cornerStrokeColor = options.cornerStrokeColor || darken(fill);
            options.compressed = options.compressed || true;
            options.scaleX = options.scaleX || options.addWithAnimation ? 0 : 1;
            options.scaleY = options.scaleY || options.addWithAnimation ? 0 : 1;
            options.opacity = options.opacity || options.addWithAnimation ? 0 : 1;
            var theBackground = new BackgroundClass(options);
            if (!options.nonResizable) {
                theBackground.setControlsVisibility({
                    mt: false,
                    mb: false,
                    mr: false,
                    ml: false,
                    mtr: false
                });
            }
            theBackground.widget = theWidget;
            return theBackground;
        }

        var background = createBackground(fabric.Circle, options);
        background.parent = options.parent;

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            if (!background.parent.isCompressed) {
                ctx.font = 'bold 20px Helvetica';
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
