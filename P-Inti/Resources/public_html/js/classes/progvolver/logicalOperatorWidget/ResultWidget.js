class ResultWidget {
    constructor(options) {
        var symbolFont = 'bold 17px Helvetica';

        options.height = 44;
        options.width = 110;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = WHEN_WIDGET_FILL;
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;

        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.children = [];

        this.background = background;
        background.noScaleCache = false;
        background.trueText = "True";
        background.falseText = "False";

        this.value = options.value || '';


        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = symbolFont;
            ctx.fillStyle = 'rgba(65, 65, 65, ' + background.opacity + ')';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            if (background.value) {
                var renderableValue = background.value;
                ctx.fillText(renderableValue, center.x, center.y);
            }
            ctx.restore();
        };

        var addInputPort = function () {
            var inputPort = new LogicalOutputConnection({
                parent: background,
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'bottom'};


            background.addChild(inputPort, {
                whenCompressed: {
                    x: 0, y: -5,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: -5,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.inputPort = inputPort;
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

        addTextChange();

        background.convertUnits = function(value) {
            background.value = value * background.numberFormatter.unitMultiplier;
        }

        background.registerListener('mouseup', function () {
            if (background.isCompressed) {
                background.expand();
                background.textChange && background.textChange.expand();
            } else {
                background.compress();
                background.textChange && background.textChange.compress();
            }
        });

        addInputPort();
        //addEvents();

        background.registerListener('added', function (options) {
            canvas.add(background.inputPort);
            canvas.add(background.textChange);
            background.compress();
            background.textChange && background.textChange.compress();
            background.positionObjects();
        });

        background.setUpdatedValue = function (value) {
            console.log("Updating value to : ");
            console.log(value);

            if (value) {
                this.value = background.trueText;
                this.set('width', getValueWidth(background.trueText, symbolFont));
                this.set('fill', '#32CD32')
                this.set('stroke', darken(background.fill));
            } else {
                this.value = background.falseText;
                this.set('width', getValueWidth(background.falseText, symbolFont));
                this.set('fill', '#FF6347');
                this.set('stroke', darken(background.fill));
            }
        }
        this.progvolverType = "ResultWidget";
        registerProgvolverObject(background);

        return this.background;
    }
}