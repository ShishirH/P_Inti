var ReferencePointer = iVoLVER.util.createClass(fabric.Circle, {
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.value = "";
        options.fill = options.fill || '#FED9A6';
        this.callSuper('initialize', options);
        this.initConnectable();
        this.oldRender = this.render;
        this.inConnection = null;
        this.sign = options.sign || "";
        this.previousValue = 0;
        this.drawPointer = options.drawPointer;
        this.background = options.background;
        
        this.render = function (ctx) {
            this.oldRender(ctx);
        };
    },

});
iVoLVER.util.extends(ReferencePointer.prototype, iVoLVER.model.Connectable);

