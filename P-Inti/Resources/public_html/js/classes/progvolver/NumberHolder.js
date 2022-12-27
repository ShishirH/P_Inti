class NumberHolder{
    constructor(options) {
        options.height = 30;
        options.width = 40;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.strokeWidth = options.strokeWidth || 1;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.value = options.value;
        background.originalValue = options.value;
        background.index = options.index;

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.font = "20px Helvetica";
            ctx.fillStyle = 'white';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            let center = background.getPointByOrigin('center', 'center');

            var renderableValue = background.value;
            if (!iVoLVER.util.isUndefined(background.value) && iVoLVER.util.isNumber(background.value)) {
                renderableValue = background.value.toFixed(2);
            }

            if (background.value) {
                ctx.fillText(background.value, center.x, center.y);
            }

            if (background.index !== undefined) {
                ctx.fillStyle = 'rgba(65, 65, 65, ' + 1 + ')';
                let topCenter = background.getPointByOrigin('center', 'top');
                ctx.font = "16px Helvetica";

                ctx.fillText(background.index, topCenter.x, topCenter.y - 8);
            }
        }

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

        background.addConnectionPort();
        var addNumberFormatter = function () {
            var numberFormatter = new NumberFormatter({
                parent: background,
                fill: background.fill,
                stroke: background.stroke
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'center'};


            background.addChild(numberFormatter, {
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
            background.numberFormatter = numberFormatter;
            background.numberFormatter.lockMovementX = true;
            background.numberFormatter.lockMovementY = true;
        }

        //addNumberFormatter();
        
        background.convertUnits = function(value) {
            background.value = value * background.numberFormatter.unitMultiplier;
        }

        background.registerListener('mouseup', function () {
            if (background.isCompressed) {
                background.expand();
                background.numberFormatter && background.numberFormatter.expand();
            } else {
                background.compress();
                background.numberFormatter && background.numberFormatter.compress();
            }
        });

        background.registerListener('added', function () {
            background.bringToFront();

            background.numberFormatter && canvas.add(background.numberFormatter);
            background.numberFormatter && background.numberFormatter.bringToFront();
            background.numberFormatter && background.numberFormatter.bringContentsToFront();
            background.positionObjects();
            background.compress();
        });

        background.registerListener('moving', function () {
            background.positionObjects();
        });

        this.progvolverType = "NumberHolder";
        registerProgvolverObject(this);

        return background;
    }
}