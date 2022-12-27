var LogicalInputConnection = iVoLVER.util.createClass(fabric.Rect, {
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
        options.nonResizable = false;
        options.allowInConnections = true;
        options.allowOutConnections = true;
        options.value = "";
        options.movable = true;

        this.callSuper('initialize', options);
        this.initConnectable();
        this.parent = options.parent;
        this.result = undefined;
        this.isLogicalInputConnection = true;
        this.connectionOutputPort = undefined;
        this.isOutputPort = options.isOutputPort;
        this.isLeft = options.isLeft;

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

        this.set('fill', connection.source.fill);
        this.set('stroke', connection.source.stroke);

        this.operandValue = source.result;

        let connectionAccepted = true;

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
iVoLVER.util.extends(LogicalInputConnection.prototype, iVoLVER.model.Connectable);