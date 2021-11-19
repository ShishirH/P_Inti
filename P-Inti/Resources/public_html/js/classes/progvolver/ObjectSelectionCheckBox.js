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

        var background = createObjectBackground(fabric.Rect, options);
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
