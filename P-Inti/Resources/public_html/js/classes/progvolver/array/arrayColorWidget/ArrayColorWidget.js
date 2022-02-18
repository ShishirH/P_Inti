class ArrayColorWidget {
    constructor(options) {
        options.height = 20;
        options.width = 15;
        options.fill = "transparent";
        options.stroke = "white";
        options.strokeWidth = options.strokeWidth || 0;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.colorWidgets = [];
        background.colorWidgetsVertical = [];

        background.array = options.array;

        background.index = 0;
        var addColorWidgetButton = function () {
            var colorWidgetAddition = new ArrayColorWidgetAddition({
                parent: background,
                array: background.array,
                radius: 6
            });

            var originParent = {originX: 'left', originY: 'bottom'};
            var originChild = {originX: 'left', originY: 'bottom'};


            background.addChild(colorWidgetAddition, {
                whenCompressed: {
                    x: 0, y: 1,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            background.colorWidgetAddition = colorWidgetAddition;
            canvas.add(background.colorWidgetAddition);
            background.colorWidgetAddition.bringToFront();

            background.colorWidgetAddition.registerListener('mouseup', function () {
                let colorWidgetOutput = background.array.addColorWidgetOutput(background.index);
                background.addColorWidgetInput(colorWidgetOutput);
                background.positionObjects();
                background.index++;
            });
        };

        addColorWidgetButton();

        background.addColorWidgetInput = function (colorWidgetOutput) {
            let colorIndex = (background.index % colorsArray.length);
            let colorPickerVertical = null;

            // 2D array
            if (background.array.columns > 1) {
                colorPickerVertical = addColorPickerFor2DArray(colorIndex, colorWidgetOutput);
            }

            var colorPickerSignalHolder = new ColorPickerSignalHolder({
                parent: background,
                array: background.array,
                fill: colorsArray[colorIndex],
                stroke: darken((colorsArray[colorIndex])),
                colorWidgetOutput: colorWidgetOutput,
                isVerticalSignal: false,
                position: background.colorWidgets.length
            });

            let parentOrigin = {originX: 'right', originY: 'bottom'};
            let childOrigin = {originX: 'left', originY: 'bottom'};

            let x = (background.colorWidgets.length * 14) + 3;

            background.addChild(colorPickerSignalHolder, {
                whenCompressed: {
                    x: x, y: 1,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: parentOrigin,
                    originChild: childOrigin
                },
                whenExpanded: {
                    x: x, y: 1,
                    originParent: parentOrigin,
                    originChild: childOrigin
                },
                movable: false
            });

            canvas.add(colorPickerSignalHolder);
            background.colorWidgets.push(colorPickerSignalHolder);
        }

        var addColorPickerFor2DArray = function (colorIndex, colorWidgetOutput) {
            var colorPickerSignal = new ColorPickerSignalHolder({
                parent: background,
                array: background.array,
                fill: colorsArray[colorIndex],
                stroke: darken((colorsArray[colorIndex])),
                colorWidgetOutput: colorWidgetOutput,
                isVerticalSignal: true,
                position: background.colorWidgetsVertical.length,
                doNotAddColorPicker: true
            });

            let parentOrigin = {originX: 'left', originY: 'bottom'};
            let childOrigin = {originX: 'right', originY: 'top'};

            let y = (background.colorWidgets.length * 14) + 12;

            background.addChild(colorPickerSignal, {
                whenCompressed: {
                    x: -4, y: y,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: parentOrigin,
                    originChild: childOrigin
                },
                whenExpanded: {
                    x: -4, y: y,
                    originParent: parentOrigin,
                    originChild: childOrigin
                },
                movable: false
            });

            canvas.add(colorPickerSignal);
            background.colorWidgetsVertical.push(colorPickerSignal);

            return colorPickerSignal;
        }

        background.registerListener('added', function () {
            background.positionObjects();
        });

        this.progvolverType = "ArrayColorWidget";
        registerProgvolverObject(this);

        return background;
    }
}