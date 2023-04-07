var SignalEmitterWidget = iVoLVER.util.createClass(fabric.Triangle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.height = 11;
        options.width = 16;
        options.fill = SIGNAL_EMITTER_FILL;
        options.stroke = darken(SIGNAL_EMITTER_FILL)
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
            if (this.signals && !window.waitSignals) {
                time = window.presentTime;
                console.log("!!Time is: " + time);
                console.log("!!this.signals")
                console.log(this.signals);
                console.log("!!this.values")
                console.log(this.values)
                this.values = this.signals.filter(item => item.time <= time);
                console.log("!!this.values")
                console.log(this.values)
                this.onValuesUpdated && this.onValuesUpdated(this.values.length);
                if (this.values.length) {
                    console.log("!!this.values.length")
                    console.log(this.values.length)
                    //this.onValuesUpdated && this.onValuesUpdated(this.values.length);
                }
            }
        };

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);
        };

        this.onValuesUpdated = function (numberOfSignals) {
            console.log("!!Number of signals passed is: " + numberOfSignals);
            if (this.numberOfSignalsEmitted != numberOfSignals) {
                this.emitSignal(this.numberOfSignalsEmitted);
                this.numberOfSignalsEmitted = numberOfSignals;
            }
        };

        this.emitSignal = function (value) {
            this.outConnections.forEach(function (outConnection) {
                outConnection.target.signalEmitted(value);
            })
        };

    },
    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = false;//(source.isCircle && (source.getInConnections().length + source.getOutConnections().length) === 1) || (source.isTriangle && (source.getInConnections().length >= 2));
        var message = '';
        if (!connectionAccepted) {
            if (source.isCircle) {
                message = 'Cannot connect to a signal emitter';
            } else if (source.isTriangle) {
                message = 'Cannot connect to a signal emitter';
            } else {
                message = 'Cannot connect to a signal emitter';
            }
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },
});
iVoLVER.util.extends(SignalEmitterWidget.prototype, iVoLVER.model.Connectable);