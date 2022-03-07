var VariableInputConnection = iVoLVER.util.createClass(fabric.Circle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.radius = options.radius || 6;
        options.fill = SIGNAL_FILL;
        options.stroke = darken(SIGNAL_FILL);
        options.nonResizable = false;
        options.hasControls = false;
        options.movable = true;

        this.callSuper('initialize', options);
        this.initConnectable();
        this.parent = options.parent;

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);
        };
    },
    processConnectionRequest: function (connection) {
        let source = connection.source;
        this.operandValue = Number(source.value);

        console.log("Operand value is: " + this.operandValue);
        var connectionAccepted = true;
        this.inConnection = connection;
        return {
            connectionAccepted: connectionAccepted,
            processedValue: this.operandValue,
            message: ""
        };
    },

    acceptConnection: function (connection, processedValue) {
        console.log("Calling this");
        this.parent.outputPort && this.parent.outputPort.updateOutput && this.parent.outputPort.updateOutput();
    },

    connectionAccepted: function (connection) {},

    inValueUpdated: function (options) {
        var inConnection = this.inConnection;

        this.operandValue = Number(inConnection.source.value);
    }
});
iVoLVER.util.extends(VariableInputConnection.prototype, iVoLVER.model.Connectable);