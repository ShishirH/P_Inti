//var ObjectSelectionCheckBox = fabric.util.createClass(fabric.Rect, {
//    initialize: function (options) {
//        options || (options = {});
//        options.hasControls = false;
//        options.hasBorders = false;
//        options.originX = 'center';
//        options.originY = 'center';
//        //options.objectCaching = true;
//        options.width = options.width || 20;
//        options.height = options.height || 35;
//        options.fill = 'white';
//        options.strokeWidth = '1';
//        this.callSuper('initialize', options);
//        this.initExpandable();
//        //this.value = options.value;
//        this.visibility = false;
//
////        this.oldRender = this.render;
////        this.render = function (ctx) {
////            this.oldRender(ctx);
////            ctx.save();
////            if (this.visibility && this.value && this.value != "") {
////                ctx.font = '18px Helvetica';
////                ctx.fillStyle = 'black';
////                var center = this.getPointByOrigin('center', 'center');
////                ctx.fillText(this.value, center.x, center.y);
////            }
////            ctx.restore();
////        };
//
//        this.setVisibility = function (visibility) {
//            this.visibility = visibility;
//        }
//    }
//});
//iVoLVER.util.extends(ObjectSelectionCheckBox.prototype, iVoLVER.model.Expandable);
//
class ObjectSelectionCheckBox {
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

        var background = createBackground(fabric.Rect, options);
        background.visibility = false;
        background.value = options.value;
        
        background.oldRender = background.render;
        
        background.render = function(ctx) {
            background.oldRender(ctx);
            ctx.save();
            if (background.visibility && background.value && background.value != "") {
                ctx.font = '18px Helvetica';
                ctx.fillStyle = 'black';
                var center = background.getPointByOrigin('center', 'center');
                ctx.fillText(background.value, center.x, center.y);
            }
            ctx.restore();
        }
        registerProgvolverObject(this);
        return background;
    }
}
