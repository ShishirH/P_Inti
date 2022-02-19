class ArrayColorWidgetOutput {
    constructor(options) {
        options.radius = 6;
        options.strokeWidth = options.strokeWidth || 1;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Circle, options, this);
        background.index = options.index;
        background.value = options.value;
        
        background.array = options.array;
        background.outputNumberHolders = [];
        
        background.registerListener('mousedown', function (event) {
            let x = event.e.x;
            let y = event.e.y;
            background.down = true;

            background.initialX = x;
            background.initialY = y;

            background.initialLeft = background.left;
            background.initialTop = background.top;

            background.lockMovementX = false;
            background.lockMovementY = false;

            let fill = background.fill;
            let stroke = darken(background.fill);
            var square = new NumberHolder({
                x: background.left,
                y: background.top,
                fill: fill,
                stroke: stroke,
                parent: background,
                index: background.index,
                value: background.value
            });
            background.square = square;
            background.outputNumberHolders.push(background.square);
            canvas.add(background.square);
            background.square.bringToFront();

        });

        background.registerListener('moving', function (event) {
            background.left = background.initialLeft;
            background.top = background.initialTop;
            background.positionObjects();
            if (background.down) {
                let deltaX = (background.initialX - event.e.x) / 2;
                let deltaY = (background.initialY - event.e.y) / 2;

                background.square.left = background.left - deltaX;
                background.square.top = background.top - deltaY;
                background.square.setCoords();
                background.square.positionObjects();
            }
        });

        background.registerListener('added', function () {
            background.bringToFront();
            background.positionObjects();
        });

        this.progvolverType = "ArrayColorWidgetOutput";

        return background;
    }
}