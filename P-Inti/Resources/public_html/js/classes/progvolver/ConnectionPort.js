var ConnectionPort = iVoLVER.util.createClass(fabric.Circle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.radius = options.radius || 6;
        this.callSuper('initialize', options);
        this.initConnectable();
    },

    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = (source.isCircle && (source.getInConnections().length + source.getOutConnections().length) === 1) || (source.isTriangle && (source.getInConnections().length >= 2));
        var message = '';
        if (!connectionAccepted) {
            if (source.isCircle) {
                message = 'Sorry, I only accept unconnected Circles.';
            } else if (source.isTriangle) {
                message = 'Sorry, I only accept Triangles with at least two incoming connections.';
            } else {
                message = 'Sorry, I don\'t accept connections from Squares.';
            }
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
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
    }
});
iVoLVER.util.extends(ConnectionPort.prototype, iVoLVER.model.Connectable);