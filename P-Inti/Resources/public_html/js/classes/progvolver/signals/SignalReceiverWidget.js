var SignalReceiverWidget = iVoLVER.util.createClass(fabric.Circle, {
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
        this.background = options.background;
        this.isAffectWidget = options.isAffectWidget;
        
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
        this.value = (connection.source.background && connection.source.background.name) || "";
    },

    connectionAccepted: function (connection) {
        console.log("Connection from when was accepted");
    },

    signalEmitted: function (options) {
        var operation = this.background.operation;

        console.log("Signal received!");
        console.log("Operation is: " + operation);
        if (operation == "increase") {
            this.signalsReceived = 2;
        } else if (operation == "decrease") {
            this.signalsReceived = 1;
        } else if (operation == "reset") {
            this.signalsReceived = 0;
        }
        
        if (this.isAffectWidget) {
            console.log(this.background.outputPort);
            this.background.outputPort.emitSignal(this.signalsReceived);
        }
    }
});
iVoLVER.util.extends(SignalReceiverWidget.prototype, iVoLVER.model.Connectable);

