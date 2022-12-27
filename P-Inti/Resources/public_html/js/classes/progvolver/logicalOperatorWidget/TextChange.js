class TextChange {
    constructor(options) {
        var symbolFont = '12px Helvetica';

        options.height = 40;
        options.width = 120;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.strokeWidth = options.strokeWidth || 2;

        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.children = [];

        background = background;
        background.noScaleCache = false;

        this.value = options.value || '';

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);

            if (!background.isCompressed) {
                ctx.save();
                ctx.font = symbolFont;
                ctx.fillStyle = 'white';
                ctx.textAlign = "left";
                var center = background.getPointByOrigin('left', 'top');

                var renderableValue = "If true: ";
                ctx.fillText(renderableValue, center.x + 8, center.y + 13);
                var renderableValue = "If false: ";
                ctx.fillText(renderableValue, center.x + 8, center.y + 32);
                ctx.restore();
            }
        };


        this.addTextEntries = function () {
            // background.dataType + " " + background.name
            var trueObject = new fabric.IText("True", {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 12,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'right',
                editingBorderColor: 'white',
            });

            var falseObject = new fabric.IText("False", {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 12,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white',
            });

            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};

            background.addChild(trueObject, {
                whenCompressed: {
                    x: 42, y: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 42, y: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            originParent = {originX: 'left', originY: 'center'};
            originChild = {originX: 'left', originY: 'top'};

            background.addChild(falseObject, {
                whenCompressed: {
                    x: 48, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 48, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            trueObject.lockMovementX = true;
            trueObject.lockMovementY = true;

            falseObject.lockMovementX = true;
            falseObject.lockMovementY = true;

            canvas.add(trueObject);
            background.trueObject = trueObject;
            background.children.push(trueObject);

            canvas.add(falseObject);
            background.falseObject = falseObject;
            background.children.push(falseObject);

            trueObject.on('changed', function () {
                background.positionObject(trueObject);
                background.parent.trueText = trueObject.text;
            });

            falseObject.on('changed', function () {
                background.positionObject(falseObject);
                background.parent.falseText = falseObject.text;
            });
        };

        this.addTextEntries();

        background.registerListener('added', function (options) {
            background.bringToFront();
            background.trueObject.bringToFront();
            background.falseObject.bringToFront();
//
//            background.dropdown.dropdowns.forEach(function (option) {
//                option.bringToFront();
//            })
            background.positionObjects();
        });

        background.bringContentsToFront = function () {
            background.bringToFront();
            background.dropdown.bringToFront();

            background.dropdown.dropdowns.forEach(function (option) {
                option.bringToFront();
            })
        }

        this.progvolverType = "TextChange";
        registerProgvolverObject(this);

        return background;
    }
}