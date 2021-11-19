var SignalReceiverSnapshot = iVoLVER.util.createClass(fabric.Circle, {
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.radius = options.radius || 6;
        options.fill = SIGNAL_FILL;
        options.stroke = darken(SIGNAL_FILL);
        options.allowInConnections = true;
        options.allowOutConnections = true;
        this.callSuper('initialize', options);
        this.initConnectable();

        this.oldRender = this.render;
        this.inConnection = null;
        this.widgetName = "Signal receiver";
        this.signalsReceived = 0;
        this.signalId = null;
        this.background = options.background;
        this.render = function (ctx) {
            this.oldRender(ctx);
            ctx.font = "20px Helvetica";
            ctx.fillStyle = 'rgba(65, 65, 65, ' + 1 + ')';
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
        };
    },

    processConnectionRequest: function (connection) {
        var connectionAccepted = false;

        if (connection.source.emitSignal) {
            connectionAccepted = true;
        }

        var message = 'Can only receive from Signals';
        this.inConnection = connection;
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },

    acceptConnection: function (connection) {
        console.log("Connection has been accepted!");
        this.signalId = connection.source.id;
    },

    signalEmitted: function (options) {
    }
});
iVoLVER.util.extends(SignalReceiverSnapshot.prototype, iVoLVER.model.Connectable);

