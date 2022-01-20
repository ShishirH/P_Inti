class DisappearanceInteractionEvent {
    constructor(options) {
        var symbolFont = '8px Helvetica';

        options.height = 20;
        options.value = "Make disappear";
        options.width = getValueWidth(options.value, symbolFont) + 23;
        options.x = 250;
        options.y = 250;
        options.fill = options.parent.fill;
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 1;

        options.hasControls = false;
        options.hasBorders = false;


        var background = createObjectBackground(fabric.Rect, options, this);

        background.value = options.value;
        background.parent = options.parent;
        background.timeOfDisappearance = -1;
        background.children = [];
        background.isBeingRecorded = false;
        background.noScaleCache = false;
        background.isParentOnCanvas = true;

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


        var addDisappearOperation = function () {
            background.registerListener('mouseup', function() {
                if (!background.isBeingRecorded) {
                    background.value = "Recording";
                    background.isBeingRecorded = true;
                } else {
                    background.value = "Recorded";
                    background.isBeingRecorded = false;
                    background.timeOfDisappearance = background.parent.currentTime;
                }
            });
        };

        addDisappearOperation();

        background.registerListener('added', function (options) {
            background.positionObjects();
        });

        this.progvolverType = "MovementInteractionEvent";
        registerProgvolverObject(this);

        return background;
    }

}