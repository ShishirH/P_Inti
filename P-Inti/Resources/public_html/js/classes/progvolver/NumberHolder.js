class NumberHolder {
    constructor(options) {
        options.radius = 12;
        options.strokeWidth = options.strokeWidth || 1;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Circle, options, this);
        background.value = options.value;
        background.originalValue = options.value;
        background.index = options.index;

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.font = "10px Helvetica";
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

            if (background.index) {
                ctx.fillStyle = 'rgba(65, 65, 65, ' + 1 + ')';
                let topCenter = background.getPointByOrigin('center', 'top');
                ctx.font = "6px Helvetica";

                ctx.fillText(background.index, topCenter.x, topCenter.y - 3);
            }
        }

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

        addNumberFormatter();
        
        background.convertUnits = function(value) {
            background.value = value * background.numberFormatter.unitMultiplier;
        }

        background.registerListener('mouseup', function () {
            if (background.isCompressed) {
                background.expand();
                background.numberFormatter.expand();
            } else {
                background.compress();
                background.numberFormatter.compress();
            }
        });

        background.registerListener('added', function () {
            background.bringToFront();

            canvas.add(background.numberFormatter);
            background.numberFormatter.bringToFront();
            background.numberFormatter.bringContentsToFront();
            background.positionObjects();
            background.compress();
        });

        background.registerListener('moving', function () {
            background.positionObjects();
        });

        this.progvolverType = "ArrayColorWidgetOutput";
        registerProgvolverObject(this);

        return background;
    }
}