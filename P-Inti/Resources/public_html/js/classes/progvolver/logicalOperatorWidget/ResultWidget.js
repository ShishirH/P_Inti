class ResultWidget {
    constructor(options) {
        var symbolFont = '20px Helvetica';

        options.height = 30;
        options.width = 40;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.fill = '#DFE3B3'
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.strokeDashArray = [5];

        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.children = [];

        this.background = background;
        background.noScaleCache = false;
        background.trueText = "true";
        background.falseText = "false";
        background.name = "name";
        background.dataType = "";
        background.value = "";
        background.values = options.values;
        background.file = options.file;
        background.fileName = options.fileName;
        background.kind = options.kind;
        background.isColorWidgetOutput = options.isColorWidgetOutput || false;


        this.value = options.value || '';
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
            background.set('width', getValueWidth(newValue, symbolFont) + 10 > 40 ? getValueWidth(newValue, symbolFont) + 10 : 40);
            background.expandedWidth = background.width;

            background.positionObjects();
            background.positionHtmlObjects();
        }

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = symbolFont;
            ctx.fillStyle = background.fontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            if (background.value) {
                var renderableValue = background.value;
                ctx.fillText(renderableValue, center.x, center.y);
            }
            ctx.restore();
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

        this.addProgvolverSymbolName();

        var addInputPort = function () {
            var inputPort = new LogicalOutputConnection({
                parent: background,
            });

            var dummyRightPort = new LogicalOutputConnection({
                parent: background
            })

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};


            background.addChild(inputPort, {
                whenCompressed: {
                    x: 0, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -(background.strokeWidth + 1), y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            originParent = {originX: 'right', originY: 'center'};
            originChild = {originX: 'left', originY: 'center'};

            background.addChild(dummyRightPort, {
                whenCompressed: {
                    x: 0, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: (background.strokeWidth + 1), y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.inputPort = inputPort;
            background.dummyRightPort = dummyRightPort;
            background.children.push(inputPort);
        }

        var addTextChange = function () {
            var textChange = new TextChange({
                parent: background,
                fill: background.fill,
                stroke: background.stroke
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'center'};


            background.addChild(textChange, {
                whenCompressed: {
                    x: 5, y: -3,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 5, y: -3,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            background.textChange = textChange;
            background.textChange.lockMovementX = true;
            background.textChange.lockMovementY = true;
        }

        //addTextChange();

        background.convertUnits = function(value) {
            background.value = value * background.numberFormatter.unitMultiplier;
        }

        background.registerListener('mouseup', function () {
            if (background.isCompressed) {
                background.expand();
                //background.textChange && background.textChange.expand();
            } else {
                background.compress();
                //background.textChange && background.textChange.compress();
            }
        });

        addInputPort();
        //addEvents();

        background.registerListener('added', function (options) {
            canvas.add(background.inputPort);
            canvas.add(background.dummyRightPort);
            //canvas.add(background.textChange);
            background.compress();
            //background.textChange && background.textChange.compress();
            background.positionObjects();
        });

        background.setUpdatedValue = function (value) {
            console.log("Updating value to : ");
            console.log(value);

            if (value) {
                this.value = background.trueText;
                this.set('width', getValueWidth(value, symbolFont) + 10 > 40 ? getValueWidth(value, symbolFont) + 10 : 40);
            } else {
                this.value = background.falseText;
                this.set('width', getValueWidth(value, symbolFont) + 10 > 40 ? getValueWidth(value, symbolFont) + 10 : 40);
            }

            background.positionObjects();
        }
        this.progvolverType = "ResultWidget";
        registerProgvolverObject(background);

        return this.background;
    }
}