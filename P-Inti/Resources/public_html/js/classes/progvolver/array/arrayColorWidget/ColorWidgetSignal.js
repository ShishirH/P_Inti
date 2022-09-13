var ColorWidgetSignal = iVoLVER.util.createClass(fabric.Circle, {
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.radius = options.radius || 6;
        options.allowInConnections = true;
        options.allowOutConnections = true;
        this.callSuper('initialize', options);
        this.initConnectable();
        this.oldRender = this.render;
        this.inConnection = null;
        this.widgetName = "ColorWidgetSignal";
        this.background = options.background;
        this.parent = options.parent;
        this.array = options.array;
        this.verticalSignal = options.verticalSignal;
        this.oldIndex = -1;
        this.colorSet = false;
        this.position = options.position;
        this.connectedVariableName = null;
    },
    processConnectionRequest: function (connection) {
        var connectionAccepted = true;

        var message = '';
        this.inConnection = connection;
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },
    acceptConnection: function (connection) {
        console.log("Connection is: ");
        console.log(connection);
        this.oldIndex = parseInt(connection.value);
        this.connectedVariableName = connection.source.background.name;
        console.log("Old index is now: " + this.oldIndex)
        console.log("Connected variable is now: " + this.connectedVariableName)
        // Perform validation checks (2D, negative values, accept only int)

        let selectedElement = this.array.arrayElementsArray[this.oldIndex][0];

        this.parent.colorWidgetOutput.index = this.oldIndex;
        this.parent.colorWidgetOutput.value = selectedElement.value;

        console.log(this);
        console.log("color widget output");
        console.log(this.parent.colorWidgetOutput);
        this.parent.colorWidgetOutput.connectedVariableName = this.array.name + "[" + this.connectedVariableName + "]";

        this.parent.colorWidgetOutput.setIndex && this.parent.colorWidgetOutput.setIndex(this.oldIndex);
        this.parent.colorWidgetOutput.setValue && this.parent.colorWidgetOutput.setValue(selectedElement.value);
        this.updateFill();
    },

    inValueUpdated: function (options) {
        var inConnection = this.inConnection;
        this.resetFill();
        this.oldIndex = parseInt(inConnection.value);
        this.updateFill();
    },

    updateFill: function () {
        this.colorSet = true;
        // 2D array
        if (this.array.columns > 1) {
            // vertical signal
            if (this.verticalSignal) {
                if (this.oldIndex >= 0 && this.oldIndex < this.array.rows) {
                    let columnSignal = this.array.arrayColorWidget.colorWidgets[this.position].signalReceiver;

                    // Check if corresponding column signal already has a connection
                    if (columnSignal.colorSet && columnSignal.oldIndex != -1) {
                        for (let i = 0; i < this.array.columns; i++) {
                            let selectedElement = this.array.arrayElementsArray[i][columnSignal.oldIndex];
                            this.resetSelectedElement(selectedElement);
                        }
                        let selectedElement = this.array.arrayElementsArray[this.oldIndex][columnSignal.oldIndex];
                        this.updateSelectedElement(selectedElement);
                        this.updateOutputValues(selectedElement);
                    } else { // column has no connection; color all rows
                        for (let i = 0; i < this.array.columns; i++) {
                            let selectedElement = this.array.arrayElementsArray[this.oldIndex][i];
                            this.updateSelectedElement(selectedElement);
                        }
                    }
                }
            } else { // horizontal signal
                if (this.oldIndex >= 0 && this.oldIndex < this.array.columns) {
                    let rowSignal = this.array.arrayColorWidget.colorWidgetsVertical[this.position].signalReceiver;

                    // Check if corresponding row signal already has a connection
                    if (rowSignal.colorSet && rowSignal.oldIndex != -1) {
                        for (let i = 0; i < this.array.columns; i++) {
                            let selectedElement = this.array.arrayElementsArray[rowSignal.oldIndex][i];
                            this.resetSelectedElement(selectedElement);
                        }
                        let selectedElement = this.array.arrayElementsArray[rowSignal.oldIndex][this.oldIndex]
                        this.updateSelectedElement(selectedElement);
                        this.updateOutputValues(selectedElement);
                    } else { // rowSignal has no connection; color all columns
                        for (let i = 0; i < this.array.columns; i++) {
                            let selectedElement = this.array.arrayElementsArray[i][this.oldIndex];
                            this.updateSelectedElement(selectedElement);
                        }
                    }
                }
            }
        } else if (this.oldIndex >= 0 && this.oldIndex < this.array.arrayElementsArray.length) {
            let selectedElement = this.array.arrayElementsArray[this.oldIndex][0];
            this.updateSelectedElement(selectedElement);
            this.updateOutputValues(selectedElement);
        }
    },

    resetFill: function () {
        this.colorSet = false;
        if (this.oldIndex >= 0 && this.oldIndex < this.array.arrayElementsArray.length) {
            let selectedElement = this.array.arrayElementsArray[this.oldIndex][0];
            selectedElement.set('objectCaching', false);
            selectedElement.set('indexed', false);
            selectedElement.indexedColor.pop();
            selectedElement.set('objectCaching', true);
        }
    },

    updateOutputValues: function (selectedElement) {
        let index = selectedElement.index;
        let value = selectedElement.element;

        this.parent.colorWidgetOutput.index = index;
        this.parent.colorWidgetOutput.value = value;

        this.parent.colorWidgetOutput.outputNumberHolders.forEach(function (outputNumberHolder) {
            outputNumberHolder.index = index;
            outputNumberHolder.originalValue = value;
            outputNumberHolder.value = value;
            outputNumberHolder.connectedVariableName = this.connectedVariableName;

            outputNumberHolder.setIndex && outputNumberHolder.setIndex(index);
            outputNumberHolder.setValue && outputNumberHolder.setValue(value);
        });
    },

    updateSelectedElement: function (selectedElement) {
        selectedElement.set('objectCaching', false);
        selectedElement.set('indexed', true);
        selectedElement.indexedColor.push(this.fill);
        selectedElement.set('objectCaching', true);

        console.log("Indexed color is: ");
        console.log(selectedElement.indexedColor);
    },

    resetSelectedElement: function (selectedElement) {
        selectedElement.set('objectCaching', false);
        selectedElement.set('indexed', false);
        selectedElement.indexedColor.pop();
        selectedElement.set('objectCaching', true);
    }

});
iVoLVER.util.extends(ColorWidgetSignal.prototype, iVoLVER.model.Connectable);

