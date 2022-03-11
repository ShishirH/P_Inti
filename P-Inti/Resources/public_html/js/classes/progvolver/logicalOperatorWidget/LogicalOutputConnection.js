var LogicalOutputConnection = iVoLVER.util.createClass(fabric.Circle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.radius = options.radius || 6;
        options.fill = "#DFE3B3";
        options.stroke = darken(options.fill);
        options.nonResizable = false;
        options.hasControls = false;
        options.movable = true;

        this.callSuper('initialize', options);
        this.initConnectable();
        this.parent = options.parent;
        this.result = undefined;
        this.isLogicalInputConnection = true;
        this.connectionOutputPort = undefined;
        this.isOutputPort = options.isOutputPort;
        this.isLeft = options.isLeft;

        this.setUpdatedValue = function (value) {
            console.log("Value is now: ");
            console.log(value);
            console.log("Parent is: ");
            console.log(this.parent);

            this.parent.setUpdatedValue(value);
        }
        this.updateOutput = function () {
            console.log("I am being called");
            console.log("isLeft is: " + this.isLeft);

            let operandA = this.parent.inputPortLeft.operandValue;
            let operandB = this.parent.inputPortRight.operandValue;

            console.log("A is: " + operandA);
            console.log("B is: " + operandB);

            if (this.parent.inputPortLeft && this.parent.inputPortLeft.operandValue !== undefined) {
                if (this.parent.inputPortRight && this.parent.inputPortRight.operandValue !== undefined) {
                    let operandA = this.parent.inputPortLeft.operandValue;
                    let operandB = this.parent.inputPortRight.operandValue;

                    console.log("A is: " + operandA);
                    console.log("B is: " + operandB);
                    let operator = this.parent.currentOperator;
                    console.log("Operator is: " + operator);
                    let result;

                    switch(operator) {
                        case ">":
                            result = operandA > operandB;
                            break;
                        case "<":
                            result = operandA < operandB;
                            break;
                        case ">=":
                            result = operandA >= operandB;
                            break;
                        case "<=":
                            result = operandA <= operandB;
                            break;
                        case "==":
                            result = operandA == operandB;
                            break;
                        case "&&":
                            result = operandA && operandB;
                            break;
                        case "||":
                            result = operandA || operandB;
                            break;
                        case "!":
                            result = operandA || operandB;
                            break;
                    }

                    console.log("Result is: " + result);
                    this.result = result;
                    this.value = result;

                    console.log("ConnectionOutputPort: ");
                    console.log(this.connectionOutputPort);
                    console.log("This is output port: " + this.isOutputPort);

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
        console.log("Connection is: ");
        console.log(connection);
        console.log("Source is: ");
        console.log(connection.source);

        this.operandValue = source.result;
        let connectionAccepted;

        if (connection.source.isOutputPort) {
            console.log("Updating connection output port");
            connectionAccepted = true;
            connection.source.connectionOutputPort = this;
        } else {
            connectionAccepted = true;
        }

        let message = '';
        if (!connectionAccepted) {
            message = "Could not make a connection."
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },
    inValueUpdated: function (options) {
        var inConnection = this.inConnection;
        this.operandValue = Number(inConnection.source.value);
    }
});
iVoLVER.util.extends(LogicalOutputConnection.prototype, iVoLVER.model.Connectable);