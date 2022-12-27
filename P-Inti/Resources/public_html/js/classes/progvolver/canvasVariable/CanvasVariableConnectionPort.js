var CanvasVariableConnectionPort = iVoLVER.util.createClass(fabric.Circle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.radius = options.radius || 6;
        this.callSuper('initialize', options);
        this.initConnectable();
        this.value = 0;

        this.parent = options.parent;
    },

    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = true;
        var message = '';

        this.inConnection = source;

        if (source.value) {
            this.parent.setValue(source.value);
        } else {
            this.parent.setValue("" + source.numberOfSignalsEmitted);
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },

    inValueUpdated: function (options) {
        var inConnection = this.inConnection;
        let updatedValue;
        this.parent.setValue(inConnection.value);
    },

    signalEmitted: function (value) {
        this.parent.setValue("" + value);
        this.value += 1;
    },

    showColorDecay: function (color, strokeWidth) {
        let connectionPort = this;
        if (connectionPort.outConnections && connectionPort.outConnections.length > 0) {
            let connector = connectionPort.outConnections[0];

            connector.objectCaching = false;
            connector.setConnectorColor(color);
            //connector.set('strokeWidth', strokeWidth);
            setTimeout(function () {
                connector.objectCaching = false;
            }, 500);
        }
    },

    setOperandValue: function (newValue) {
        let connectionPort = this;

        if (connectionPort.outConnections && connectionPort.outConnections.length > 0) {
            let connector = connectionPort.outConnections[0];
            connector.target.operandValue = parseFloat(newValue);
        }
    }
});
iVoLVER.util.extends(CanvasVariableConnectionPort.prototype, iVoLVER.model.Connectable);