var ArthimeticOperators = iVoLVER.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});
        options.width = options.width || 20;
        options.height = options.height || 35;
        this.callSuper('initialize', options);
        this.value = options.value;
        this.parent = options.parent;
        this.unitMultiplier = options.unitMultiplier;

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);

            if (!this.parent.isCompressed) {
                ctx.font = '8px Helvetica';
                ctx.fillStyle = 'white';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                var center = this.getPointByOrigin('center', 'center');
                ctx.fillText(this.value, center.x, center.y);
            }
        };

    }
});