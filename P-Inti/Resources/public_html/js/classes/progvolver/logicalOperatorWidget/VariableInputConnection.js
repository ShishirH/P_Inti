var VariableInputConnection = iVoLVER.util.createClass(fabric.Rect, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.width = options.width || 35;
        options.height = options.height || 28;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.fill = "white";
        options.strokeWidth = options.strokeWidth || 2;
        options.stroke = darken(options.fill);
        options.allowInConnections = true;
        options.allowOutConnections = true;
        options.nonResizable = false;
        options.movable = true;

        this.callSuper('initialize', options);
        this.initConnectable();
        this.parent = options.parent;
        this.isVariableInputConnection = true;
        this.connectionOutputPort = undefined;
        this.isOutputPort = options.isOutputPort;
        this.isLeft = options.isLeft;
        this.value = "";
        this.font = "bold 17px Helvetica";

        this.oldRender = this.render;
        this.render = function (ctx) {
            this.oldRender(ctx);
            ctx.font = 'bold 17px Helvetica';
            ctx.fillStyle = 'rgba(65, 65, 65, ' + 1 + ')';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = this.getPointByOrigin('center', 'center');
            ctx.fillText(this.value, center.x, center.y + 3);
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
        console.log("Connection is: ");
        console.log(connection);
        let source = connection.source;
        this.operandValue = Number(source.value);

        if (connection.value) {
            this.value = connection.value;
        } else {
            this.value = connection.source.value;
        }
        // if (connection.source.parent.parent.connectedVariableName) {
        //     this.value = (connection.source.parent.parent.connectedVariableName)
        // } else if (connection.source.background && connection.source.background.name) {
        //     this.value = connection.source.background.name;
        // }

        this.set('width', Math.max(getValueWidth(this.font, this), 35));
        this.parent.modifyWidth(this.width - 35); // 35 is default width

        this.set('fill', connection.source.fill);
        this.set('stroke', connection.source.stroke);

        console.log("Operand value is: " + this.operandValue);
        var connectionAccepted = false;

        if (connection.source.isVariableInputConnection && connection.source.isOutputPort) {
            console.log("Updating connection output port");
            connectionAccepted = true;
            connection.source.connectionOutputPort = this;
        } else {
            connectionAccepted = true;
        }
        console.log(typeof this.operandValue);
        if (isNaN(this.operandValue)){
            showErrorMessage("This connection only accepts numbers", 1000);
            connectionAccepted = false;
        }
        return {
            connectionAccepted: connectionAccepted,
            processedValue: this.operandValue,
            message: ""
        };
    },

    acceptConnection: function (connection, processedValue) {
        console.log("Calling this");
        console.log(this.inConnection);
        this.parent.outputPort && this.parent.outputPort.updateOutput && this.parent.outputPort.updateOutput();
    },

    connectionAccepted: function (connection) {},

    inValueUpdated: function (options) {
        var inConnection = this.inConnection;

        console.log("Value has been updated");
        console.log("Inconnection is: ");
        console.log(inConnection);
        this.operandValue = Number(inConnection.source.value);
        this.value = Number(inConnection.source.value);
    }
});
iVoLVER.util.extends(VariableInputConnection.prototype, iVoLVER.model.Connectable);