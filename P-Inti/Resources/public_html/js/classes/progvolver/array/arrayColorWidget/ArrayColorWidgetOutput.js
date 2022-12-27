var ArrayColorWidgetOutput = iVoLVER.util.createClass(fabric.Circle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        options.hasControls = false;
        options.originX = 'center';
        options.originY = 'center';
        options.radius = options.radius || 6;
        options.strokeWidth = options.strokeWidth || 1;
        this.callSuper('initialize', options);
        this.initConnectable();
        this.index = options.index;
        this.value = options.value;

        this.array = options.array;
        this.type = "ArrayColorWidgetOutput";
        this.outputNumberHolders = [];
    },

    processConnectionRequest: function (connection) {
        var source = connection.source;
        this.inConnection = connection;
        console.log("Color widget output");
        console.log(this);
        console.log(connection);
        var connectionAccepted = (source.isCircle && (source.getInConnections().length + source.getOutConnections().length) === 1) || (source.isTriangle && (source.getInConnections().length >= 2));
        var message = '';
        if (!connectionAccepted) {
            if (source.isCircle) {
                message = 'Sorry, I only accept unconnected Circles.';
            } else if (source.isTriangle) {
                message = 'Sorry, I only accept Triangles with at least two incoming connections.';
            } else {
                message = 'Sorry, I don\'t accept connections from Squares.';
            }
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },

    inValueUpdated: function (options) {
        console.log("Value changed here");
        console.log("Value is: " + this.value)

        for (let outConnection in this.outConnections) {
            if (outConnection.target)
                outConnection.target.value = this.value;
        }

        console.log("Updated value to: " + this.value)
    },


});
iVoLVER.util.extends(ArrayColorWidgetOutput.prototype, iVoLVER.model.Connectable);

// class ArrayColorWidgetOutput {
//     constructor(options) {
//         options.radius = 6;
//         options.strokeWidth = options.strokeWidth || 1;
//         options.objectCaching = true;
//
//         options.nonResizable = true;
//         options.hasControls = false;
//         options.hasBorders = false;
//
//         var background = createObjectBackground(fabric.Circle, options, this);
//         background.index = options.index;
//         background.value = options.value;
//
//         background.array = options.array;
//         background.outputNumberHolders = [];
//
//         background.registerListener('mousedown', function (event) {
//             let x = event.e.x;
//             let y = event.e.y;
//             background.down = true;
//
//             background.initialX = x;
//             background.initialY = y;
//
//             background.initialLeft = background.left;
//             background.initialTop = background.top;
//
//             background.lockMovementX = false;
//             background.lockMovementY = false;
//
//             let fill = background.fill;
//             let stroke = darken(background.fill);
//             var square = new NumberHolder({
//                 x: background.left,
//                 y: background.top,
//                 fill: fill,
//                 stroke: stroke,
//                 parent: background,
//                 index: background.index,
//                 value: background.value
//             });
//             background.square = square;
//             background.outputNumberHolders.push(background.square);
//             canvas.add(background.square);
//             background.square.bringToFront();
//         });
//
//         background.registerListener('moving', function (event) {
//             background.left = background.initialLeft;
//             background.top = background.initialTop;
//             background.positionObjects();
//             if (background.down) {
//                 let deltaX = (background.initialX - event.e.x) / 2;
//                 let deltaY = (background.initialY - event.e.y) / 2;
//
//                 background.square.left = background.left - deltaX;
//                 background.square.top = background.top - deltaY;
//                 background.square.setCoords();
//                 background.square.positionObjects();
//             }
//         });
//
//         background.registerListener('added', function () {
//             background.bringToFront();
//             background.positionObjects();
//         });
//
//         this.progvolverType = "ArrayColorWidgetOutput";
//
//         return background;
//     }
// }