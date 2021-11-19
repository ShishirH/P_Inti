var WhenSignal = iVoLVER.util.createClass(fabric.Rect, {
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.width = options.width || 35;
        options.height = options.height || 28;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.fill = "white";
        options.strokeWidth = options.strokeWidth || 2;
        options.stroke = darken(options.fill);
        options.allowInConnections = true;
        options.allowOutConnections = true;
        options.value = "";
        this.callSuper('initialize', options);
        this.initConnectable();

        this.oldRender = this.render;
        this.inConnection = null;
        this.value = options.value;
        this.previousValue = 0;
        this.background = options.background;
        this.render = function (ctx) {
            this.oldRender(ctx);
            ctx.font = 'bold 17px Helvetica';
            ctx.fillStyle = 'rgba(65, 65, 65, ' + 1 + ')';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = this.getPointByOrigin('center', 'center');


            ctx.fillText(this.value, center.x, center.y + 3);
        };
    },

    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = true;
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
        this.inConnection = connection;
        return {
            connectionAccepted: connectionAccepted,
            processedValue: connection.value.number,
            message: message
        };
    },

    acceptConnection: function (connection, processedValue) {
        console.log("Information flow")
        connection.source.showInformationFlow && connection.source.showInformationFlow();

        let inputPort = this;
        setTimeout(function () {
            inputPort.value = (connection.source.background.name) || "";
            inputPort.set('fill', connection.source.fill);
            inputPort.set('stroke', connection.source.stroke);

            var ctx = canvas.getContext();
            ctx.save();

            var renderableValue = inputPort.value;
            let width = ctx.measureText(renderableValue).width;

            if (width > inputPort.get('width')) {
                let backgroundWidth = inputPort.background.get('width') + (width - inputPort.get('width'))
                inputPort.set('width', width);
                inputPort.background.set('width', backgroundWidth);
                inputPort.background.positionObjects();
                inputPort.background.positionHtmlObjects();
            }
        }, 400);
    },

    connectionAccepted: function (connection) {
        console.log("Connection from when was accepted");
    },

    inValueUpdated: function (options) {
        console.log("Value is updated.")
        var inConnection = this.inConnection;

        let updatedValue;
        
        if (inConnection.value.number)
            updatedValue = inConnection.value.number;
        else if (inConnection.value)
            updatedValue = inConnection.value;

        if (updatedValue == this.previousValue) {
            return;
        }
        
        var event = this.background.event;

        if (event == "increases" && updatedValue > this.previousValue) {
            this.background.outputPort.emitSignal();
        } else if (event == "decreases" && updatedValue < this.previousValue) {
            this.background.outputPort.emitSignal();
        } else if (event == "changes" && updatedValue != this.previousValue) {
            this.background.outputPort.emitSignal();
        }

        this.previousValue = updatedValue;
        console.log("Information flow")
        this.inConnection.source.showInformationFlow && this.inConnection.source.showInformationFlow();
    }
});
iVoLVER.util.extends(WhenSignal.prototype, iVoLVER.model.Connectable);

