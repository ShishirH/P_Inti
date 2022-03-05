var LogicalInputConnection = iVoLVER.util.createClass(fabric.Circle, {
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
        this.id = options.id;
        this.numberOfSignalsEmitted = 0;
        registerProgvolverObject(this);

        this.setSignalData = function () {
            this.signals = window.signalData.filter(item => item.widgetsID == this.id);

            this.afterSettingSignalData && this.afterSettingSignalData();
        };

        this.afterSettingSignalData = function () {
        };

        this.setProgramTime = function (time) {
            if (this.signals) {
                this.values = this.signals.filter(item => item.time <= time);
                if (this.values.length) {
                    this.onValuesUpdated && this.onValuesUpdated(this.values.length);
                }
            }
        };

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);
        };

        this.onValuesUpdated = function (numberOfSignals) {
            if (this.numberOfSignalsEmitted < numberOfSignals) {
                this.emitSignal();
                this.numberOfSignalsEmitted += 1;
            }
        };

        this.emitSignal = function () {
            this.outConnections.forEach(function (outConnection) {
                outConnection.target.signalEmitted();
            })
        };

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
});
iVoLVER.util.extends(LogicalInputConnection.prototype, iVoLVER.model.Connectable);