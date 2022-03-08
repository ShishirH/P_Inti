class ResultWidget {
    constructor(options) {
        var symbolFont = '17px Helvetica';

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

        this.value = options.value || '';


        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = symbolFont;
            ctx.fillStyle = 'rgba(65, 65, 65, ' + background.opacity + ')';
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('left', 'center');

            if (background.value) {
                var renderableValue = background.value;
                ctx.fillText(renderableValue, center.x + 22, center.y);
            }
            ctx.restore();
        };

        var addInputPort = function () {
            var inputPort = new LogicalInputConnection({
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

        addInputPort();
        //addEvents();

        background.registerListener('added', function (options) {
            canvas.add(background.inputPort);
            background.positionObjects();
        });

        background.setUpdatedValue = function (value) {
            console.log("Updating value to : ");
            console.log(value);

            if (value) {
                this.value = "True";
                this.set('fill', 'LimeGreen')
            } else {
                this.value = "False";
                this.set('fill', 'Tomato');
            }
        }
        this.progvolverType = "ResultWidget";
        registerProgvolverObject(background);

        return this.background;
    }
}