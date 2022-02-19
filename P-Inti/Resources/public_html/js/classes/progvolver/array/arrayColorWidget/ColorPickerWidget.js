class ColorPickerWidget {
    constructor(options) {
        options.height = (14 * colorsArray.length);
        options.width = 20;
        options.rx = options.rx || 10;
        options.ry = options.ry || 10;
        options.fill = "#DFE3B3";
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.colors = [];
        background.parent = options.parent;

        var addColors = function () {
            let originParent = {originX: 'center', originY: 'top'};
            let originChild = {originX: 'center', originY: 'top'};

            for (var i = 0; i < colorsArray.length; i++) {
                var x = 0, y = (12.7 * i) + 5;

                var color = new fabric.Circle({
                    fill: colorsArray[i],
                    radius: 6,
                    stroke: darken(colorsArray[i]),
                    strokeWidth: 1,
                    background: background,
                    hasBorders: false,
                    hasControls: false
                });

                background.addChild(color, {
                    whenCompressed: {
                        x: 0, y: 0,
                        originParent: originParent,
                        originChild: originChild
                    },
                    whenExpanded: {
                        x: x, y: y,
                        originParent: originParent,
                        originChild: originChild
                    },
                    movable: false
                });

                background.colors.push(color);

                background.colors[i].on('mouseup', function () {
                    if (background.parent) {
                        let fill = this.fill;
                        let stroke = this.stroke;

                        background.parent.signalReceiver.set('fill', fill);
                        background.parent.signalReceiver.set('stroke', stroke);

                        if (background.parent.colorPickerVertical) {
                            background.parent.colorPickerVertical.signalReceiver.set('fill', fill);
                            background.parent.colorPickerVertical.signalReceiver.set('stroke', stroke);
                            //background.parent.colorPickerVertical.signalReceiver.updateFill();
                        }
                        
                        background.parent.signalReceiver.updateFill();
                    }
                })
            }
        };

        addColors();

        background.bringContentsToFront = function () {
            background.bringToFront();

            background.colors.forEach(function (color) {
                canvas.add(color);
                color.bringToFront();
            })

            background.positionObjects();
        }

        this.progvolverType = "ColorPickerWidget";

        return background;
    }
}