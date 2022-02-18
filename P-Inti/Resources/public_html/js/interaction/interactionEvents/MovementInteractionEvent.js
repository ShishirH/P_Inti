class MovementInteractionEvent {
    constructor(options) {
        var symbolFont = '8px Helvetica';

        options.height = 20;
        options.value = "Record movement";
        options.width = getValueWidth(options.value, symbolFont) + 14;
        options.x = 250;
        options.y = 250;
        options.fill = options.parent.fill;
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 1;

        options.hasControls = false;
        options.hasBorders = false;


        var background = createObjectBackground(fabric.Rect, options, this);

        background.value = "Record movement";
        background.parent = options.parent;
        background.timeOfMovement = -1;
        background.children = [];
        background.isBeingRecorded = false;
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

            ctx.fillText(background.value, center.x + 3, center.y + 1);
            ctx.restore();
        };


        var addRecordOperation = function () {
            background.registerListener('mouseup', function() {
                if (!background.isBeingRecorded) {
                    background.value = "Recording";
                    background.oldXPosition = background.parent.left;
                    background.oldYPosition = background.parent.top;
                    background.isBeingRecorded = true;
                } else {
                    background.value = "Recorded";
                    background.newXPosition = background.parent.left;
                    background.newYPosition = background.parent.top;
                    background.isBeingRecorded = false;
                    background.timeOfMovement = background.parent.currentTime;
                }
            });
        };

        addRecordOperation();

        background.registerListener('added', function (options) {
            background.positionObjects();
        });

        this.progvolverType = "MovementInteractionEvent";
        registerProgvolverObject(this);

        return background;
    }

}