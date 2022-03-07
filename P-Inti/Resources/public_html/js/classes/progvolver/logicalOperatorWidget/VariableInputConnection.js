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
        this.isVariableInputConnection = true;
        this.connectionOutputPort = undefined;
        this.isOutputPort = options.isOutputPort;
        this.isLeft = options.isLeft;

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);
        };

        this.setUpdatedValue = function (value) {
            this.operandValue = value;
            this.parent.setUpdatedValue(value, this.isLeft);
        }
        this.updateOutput = function () {
            let operandA = this.parent.inputPortLeft.operandValue;
            let operandB = this.parent.inputPortRight.operandValue;

            console.log("A is: " + operandA);
            console.log("B is: " + operandB);

            if (this.parent.inputPortLeft && this.parent.inputPortLeft.operandValue !== undefined) {
                if (this.parent.inputPortRight && this.parent.inputPortRight.operandValue !== undefined) {
                    let operandA = this.parent.inputPortLeft.operandValue;
                    let operandB = this.parent.inputPortRight.operandValue;

                    let operator = this.parent.currentOperator;
                    console.log("Operator is: " + operator);
                    let result;

                    switch(operator) {
                        case "+":
                            result = operandA + operandB;
                            break;
                        case "-":
                            result = operandA - operandB;
                            break;
                        case "*":
                            result = operandA * operandB;
                            break;
                        case "/":
                            result = operandA / operandB;
                            break;
                        case "%":
                            result = operandA % operandB;
                            break;
                    }

                    console.log("Result is: " + result);
                    this.result = result;
                    this.value = result;
                    if (this.connectionOutputPort && this.isOutputPort) {
                        console.log("I am here!");
                        console.log("isLeft is: " + this.isLeft);
                        this.connectionOutputPort.setUpdatedValue(result, this.isLeft);
                    }
                }
            }
        }
    },
    processConnectionRequest: function (connection) {
        this.inConnection = connection;
        let source = connection.source;
        this.operandValue = Number(source.value);

        console.log("Operand value is: " + this.operandValue);
        var connectionAccepted = false;

        if (connection.source.isVariableInputConnection && connection.source.isOutputPort) {
            console.log("Updating connection output port");
            connectionAccepted = true;
            connection.source.connectionOutputPort = this;
        } else {
            connectionAccepted = true;
        }
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