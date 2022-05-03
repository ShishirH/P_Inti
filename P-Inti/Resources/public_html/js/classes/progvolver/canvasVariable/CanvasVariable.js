class CanvasVariable {
    constructor(options) {

        var symbolFont = '20px Helvetica';
        options.height = options.height || 30;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.fill = '#DFE3B3'
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.strokeDashArray = [5];
        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, null);

        background.name = options.name;
        background.dataType = options.type;
        background.value = options.value;
        background.values = options.values;
        background.file = options.file;
        background.fileName = options.fileName;
        background.kind = options.kind;
        background.isColorWidgetOutput = options.isColorWidgetOutput || false;

        background.fontColor = 'rgba(65, 65, 65, 1)';

        background.children = [];
        background.expandedHeight = 30;

        function getValueWidth(newValue, theFont) {
            var ctx = canvas.getContext();
            ctx.save();
            ctx.font = theFont;

            return ctx.measureText(newValue).width;
        }

        background.setValue = function (newValue, withAnimation) {
            background.value = newValue;
            background.textField.text = newValue;
            background.connectionPort.value = newValue;
            console.log("Connection port is: ");
            console.log(background.connectionPort);
            background.connectionPort.setOperandValue(newValue);
            background.set('width', getValueWidth(newValue, symbolFont) + 10 > 40 ? getValueWidth(newValue, symbolFont) + 10 : 40);
            background.expandedWidth = background.width;
        }

        background.setIndex = function (newIndex) {
            background.nameObject.text = "" + newIndex;
        }

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.font = symbolFont;
            ctx.fillStyle = background.fontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            // var renderableValue = background.value;
            // if (!iVoLVER.util.isUndefined(background.value) && iVoLVER.util.isNumber(background.value)) {
            //     renderableValue = background.value.toFixed(2);
            // }
            //
            // ctx.fillText(renderableValue, center.x, center.y + 3);
        };


        this.addProgvolverSymbolName = function () {
            var styles = {
                0: {}
            };

            // for (var i = 0; i < background.dataType.length; i++) {
            //     styles['0']['' + i] = {fill: 'rgb(0,0,255)'};
            // }
            // for (var i = background.dataType.length + 1; i < background.dataType.length + 1 + background.name.length; i++) {
            //     styles['0']['' + i] = {fontWeight: 'bold', fill: 'rgb(0,0,0)'};
            // }

            for (var i = 0; i < background.name.length; i++) {
                styles['0']['' + i] = {fontWeight: 'bold', fill: 'rgb(0,0,0)'};
            }

            // background.dataType + " " + background.name
            var nameObject = new fabric.IText(background.name, {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white',
                styles: styles
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'bottom'};

            let scaleX, scaleY, opacity;

            scaleX = 1;
            scaleY = 1;
            opacity = 1;


            background.addChild(nameObject, {
                whenCompressed: {
                    x: 0, y: -3,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: -3,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            nameObject.on('changed', function () {
                background.positionObject(nameObject);
                background.name = nameObject.text;
            });
//            nameObject.on('editing:entered', function () {
//                nameObject.set('backgroundColor', 'rgba(255,255,255,0.9)');
//            });
//            nameObject.on('editing:exited', function () {
//                nameObject.set('backgroundColor', '');
//            });

            background.children.push(nameObject);
            background.nameObject = nameObject;

            canvas.add(nameObject);

        };

        //if (!background.isColorWidgetOutput)
            this.addProgvolverSymbolName();

        background.addConnectionPort = function () {
            var originParent;
            var originChild;

            var x = 0, y = 0;
            originParent = {originX: 'right', originY: 'center'};
            originChild = {originX: 'left', originY: 'center'};
            x = (background.strokeWidth + 1);


            var thePort = new CanvasVariableConnectionPort({
                fill: background.fill,
                stroke: darken(background.stroke),
                strokeWidth: 1,
                opacity: 0,
                background: background,
                hasBorders: false,
                hasControls: false,
                parent: background
            });

            thePort.registerListener('connectionover', function (options) {
                background.fire('selected');
            });

            thePort.registerListener('connectionout', function (options) {
                background.fire('deselected');
            });

            thePort.registerListener('selected', function (options) {
                background.fire('selected');
            });

            thePort.registerListener('deselected', function (options) {
                background.fire('deselected');
            });

            background.addChild(thePort, {
                whenCompressed: {
                    x: 0, y: y,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: +x, y: y,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            canvas.add(thePort);
            background.connectionPort = thePort;
        }

        background.addTextField = function () {
            let textField = new fabric.IText("Val", {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 20,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white',
            });

            var originParent = {originX: 'center', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};

            let scaleX, scaleY, opacity;

            scaleX = 1;
            scaleY = 1;
            opacity = 1;


            background.addChild(textField, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            console.log("textField is: ");
            console.log(textField);
            textField.on('changed', function () {
                background.positionObject(textField);
                background.setValue(textField.text);
            });

            background.textField = textField;
            background.children.push(background.textField);
        }

        background.addConnectionPort();
        background.addTextField();

        if (!background.value)
            background.setValue("Val");

        background.registerListener('mouseup', function () {
            if (background.isCompressed) {
                background.expand();
            } else {
                background.compress();
            }
        });

        background.registerListener('added', function () {
            canvas.add(background.textField);
            background.textField.bringToFront();

            console.log("Background value is: ");
            console.log(background.value)
            if (background.value) {
                background.setValue(background.value);
            }

            background.positionObjects();
        })
        background.clone = function () {
            return new ProgvolverSymbol({
                value: background.value,
                type: background.dataType,
                name: background.name,
                file: background.file,
                fileName: background.fileName,
                x: 250, y: 250,
                kind: background.kind,
                originalId: background.id,
                doNotAddLabelObject: background.doNotAddLabelObject,
                isPartOfSnapshot: true,
                doNotAddConnectionPorts: true,
                doNotCompressWhenCanvasClicked: true
            })
        }

        this.progvolverType = "CanvasVariable";

        return background;
    }
}

