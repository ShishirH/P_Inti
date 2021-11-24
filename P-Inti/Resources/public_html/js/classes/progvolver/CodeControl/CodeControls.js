class CodeControls {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.height = options.height || 200;
        options.width = options.width || 200;
        options.left = options.x || 250;
        options.top = options.y || 250;
        options.fill = OBJECT_WIDGET_FILL;
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.childrenOnTop = [];

        background.addName = function () {
            let labelObject = new fabric.IText("CONTROL_NAME", {
                fontFamily: 'Arial',
                fill: '#0366d6',
                fontSize: 14,
                hasControls: false,
                hasBorders: false,
                textAlign: 'center',
                fontWeight: '100',
                hoverCursor: "pointer"
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'top'};

            background.addChild(labelObject, {
                whenCompressed: {
                    x: 0, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.childrenOnTop.push(labelObject);
        }

        background.addControlAddition = new function () {
            let controlAddition = new ControlAddition({
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'right', originY: 'top'};

            background.addChild(controlAddition, {
                whenCompressed: {
                    x: -5, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -5, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.childrenOnTop.push(controlAddition);

        }

        background.registerListener('added', function() {
            addChildrenToCanvas(background);
        });

        background.addName();
        background.noScaleCache = false;

        this.progvolverType = "Code Controls";
        registerProgvolverObject(this);
        return background;
    }
}