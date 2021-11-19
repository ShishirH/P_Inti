var Background = iVoLVER.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});
        options.noScaleCache = false; // to guarantee that the object gets updated during scaling
        this.callSuper('initialize', options);
        this.initExpandable();
    },
    _render: function (ctx) {
        this.callSuper('_render', ctx);
        ctx.fillStyle = lighten(ctx.fillStyle, 15);
        ctx.fillRect(-this.width / 2 + this.headerMargin / this.scaleX, -this.height / 2 + this.headerMargin / this.scaleY, this.width - 2 * this.headerMargin / this.scaleX, this.headerHeight / this.scaleY);
        ctx.fillStyle = this.fill;
        if (this.drawIconSpace) {
            ctx.fillRect(this.width / 2 - this.headerMargin / this.scaleX - this.iconWidth / this.scaleX - 2, -this.height / 2 + this.headerMargin / this.scaleY, this.headerMargin / this.scaleX, this.headerHeight / this.scaleY);
        }
    }
});
iVoLVER.util.extends(Background.prototype, iVoLVER.model.Expandable);