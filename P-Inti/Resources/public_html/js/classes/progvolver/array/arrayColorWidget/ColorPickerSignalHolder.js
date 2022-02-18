class ColorPickerSignalHolder {
    constructor(options) {
        options.radius = 6;
        options.strokeWidth = options.strokeWidth || 1;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Circle, options, this);
        background.fill = options.fill;
        background.stroke = options.stroke;
        background.array = options.array;
        background.colorWidgetOutput = options.colorWidgetOutput;
        background.isVerticalSignal = options.isVerticalSignal;
        background.doNotAddColorPicker = options.doNotAddColorPicker;
        background.position = options.position;

        var addSignal = function () {
            var signalReceiver = new ColorWidgetSignal({
                parent: background,
                array: background.array,
                fill: background.fill,
                stroke: background.stroke,
                verticalSignal : background.isVerticalSignal,
                position: background.position
            });

            var originParent = {originX: 'center', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};


            background.addChild(signalReceiver, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            background.signalReceiver = signalReceiver;

            background.signalReceiver.registerListener('mouseup', function () {
                if (background.colorPicker) {
                    if (background.colorPicker.isCompressed) {
                        background.expand();
                        background.colorPicker.expand();
                    } else {
                        background.compress();
                        background.colorPicker.compress();
                    }
                }
            });
        };

        addSignal();

        var addColorPicker = function () {
            var colorPicker = new ColorPickerWidget({
                parent: background
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'bottom'};


            background.addChild(colorPicker, {
                whenCompressed: {
                    x: 0, y: -3,
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
            background.colorPicker = colorPicker;
            background.colorPicker.lockMovementX = true;
            background.colorPicker.lockMovementY = true;
        }

        if (!background.doNotAddColorPicker)
            addColorPicker();


        background.registerListener('added', function () {
            background.bringToFront();
            canvas.add(background.signalReceiver);
            background.colorPicker && canvas.add(background.colorPicker);
            background.colorPicker && background.colorPicker.bringContentsToFront();
            background.signalReceiver.bringToFront();
            background.positionObjects();
        });

        this.progvolverType = "ColorPickerSignalHolder";
        registerProgvolverObject(this);

        return background;
    }
}