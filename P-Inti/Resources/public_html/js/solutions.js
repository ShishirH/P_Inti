/***********************************************/
/********    CREATING NEW DATA TYPES    ********/
/***********************************************/

//////////////////////////////////////////
// 1. Registering the Point datatype
iVoLVER.data.registerType({
    name: 'Point',
    iconPath: pointDataTypeIcon,
    fillColor: '#00BDFF',
    iconClass: 'workshop-point',
    getDisplayableString: function () {
        return '(' + this.x + ',' + this.y + ')';
    },
    defaults: {x: 0, y: 0},
    onEditing: {
        x: {type: 'number', divStyle: 'float: left; margin-top: 3px;'},
        y: {type: 'number'}
    }
});

///////////////////////////////////////////////////////
// 2. Creating two points with random coordinates
var p1 = createPointValue(); // Default coordinates are used: (0,0)

var p2 = createPointValue({
    x: iVoLVER.util.getRandomInt(0, 100),
    y: iVoLVER.util.getRandomInt(0, 100)
});

//////////////////////////////////////////
// 3. Registering the Boolean datatype
iVoLVER.data.registerType({
    name: 'Boolean',
    iconPath: booleanDataTypeIcon,
    fillColor: '#00BDFF',
    iconClass: 'workshop-boolean',
    defaults: {truthValue: false},
    nSamples: 1000,
    getDisplayableString: function () {
        return ('' + this.truthValue);
    },
    onEditing: {
        truthValue: {type: 'radio', label: 'Truth value', options: [{text: 'True', value: true}, {text: 'False', value: false}]},
    }
});

////////////////////////////////////////////////////
// 4. Thruth value chose from a drop-down list
iVoLVER.data.registerType({
    name: 'Boolean',
    iconPath: booleanDataTypeIcon,
    fillColor: '#00BDFF',
    iconClass: 'workshop-boolean',
    defaults: {truthValue: false},
    nSamples: 1000,
    getDisplayableString: function () {
        return ('' + this.truthValue);
    },
    onEditing: {
        truthValue: {type: 'select', label: 'Truth value', options: [{text: 'True', value: true}, {text: 'False', value: false}]},
    }
});

///////////////////////////
// 5. Vector data type
iVoLVER.data.registerType({
    name: 'Vector',
    iconPath: vectorDataTypeIcon,
    fillColor: 'rgb(78,184,192)',
    iconClass: 'workshop-vector',
    nSamples: 100,
    defaults: {x: 0, y: 0, angle: 0, magnitude: 0},
    init: function (parameters) {
        var x = parameters.x;
        var y = parameters.y;
        var angle = parameters.angle;
        var magnitude = Math.sqrt(x * x + y * y);
        return new iVoLVER.model.Value({
            x: x, y: y, angle: angle, magnitude: magnitude
        });
    },
    getDisplayableString: function () {
        return '(' + this.x.toFixed(2) + ',' + this.y.toFixed(2) + ') ; |' + this.magnitude.toFixed(2) + '| ; ' + this.angle.toFixed(2) + 'º';
    },
    onEditing: {
        x: {type: 'number', label: 'Custom label for X coordinate', affectsTo: ['angle', 'magnitude'], computeAs: function (value) {
                return value.magnitude * Math.cos(fabric.util.degreesToRadians(value.angle));
            }
        },
        y: {type: 'number', affectsTo: ['angle', 'magnitude'], computeAs: function (value) {
                return value.magnitude * Math.sin(fabric.util.degreesToRadians(value.angle));
            }
        },
        magnitude: {type: 'number', affectsTo: ['x', 'y'], computeAs: function (value) {
                return (Math.sqrt(Math.pow(value.x, 2) + Math.pow(value.y, 2)));
            }
        },
        angle: {type: 'number', affectsTo: ['x', 'y'], computeAs: function (value) {
                var rad = Math.atan2(value.y, value.x);
                return rad * (180 / Math.PI);
            }
        }
    }
});

/**************************************************/
/********    BUTTONS IN THE TOP TOOLBAR    ********/
/**************************************************/

////////////////////////
// 1.
iVoLVER.data.registerType({
    name: 'Point',
    iconPath: pointDataTypeIcon,
    fillColor: '#00BDFF',
    iconClass: 'workshop-point',
    getDisplayableString: function () {
        return '(' + this.x + ',' + this.y + ')';
    },
    defaults: {x: 0, y: 0},
    onEditing: {
        x: {type: 'number', divStyle: 'float: left; margin-top: 3px;'},
        y: {type: 'number'}
    }
});
iVoLVER.gui.add.button({
    sectionID: iVoLVER.gui.toolbar, // variable storing the id of the top toolbar
    tooltip: 'Add point',
    iconClass: 'fa-rocket',
    onClick: function () {
        var point = createPointValue({
            x: iVoLVER.util.getRandomInt(0, 600),
            y: iVoLVER.util.getRandomInt(0, 600)
        });
        var holder = new iVoLVER.model.ValueHolder({
            value: point,
            top: point.y,
            left: point.x
        });
        canvas.add(holder);
    }
});

////////////////////////
// 2.
iVoLVER.data.registerType({
    name: 'Point',
    iconPath: pointDataTypeIcon,
    fillColor: '#00BDFF',
    iconClass: 'workshop-point',
    getDisplayableString: function () {
        return '(' + this.x + ',' + this.y + ')';
    },
    defaults: {x: 0, y: 0},
    onEditing: {
        x: {type: 'number', divStyle: 'float: left; margin-top: 3px;'},
        y: {type: 'number'}
    }
});
iVoLVER.gui.add.modeButton({
    name: 'Click point',
    iconClass: 'fa-bullseye',
    persistent: true,
    onMouseUp: function (x, y, workspace) {
        var point = createPointValue({
            x: x,
            y: y
        });
        var holder = new iVoLVER.model.ValueHolder({
            value: point,
            top: point.y,
            left: point.x
        });
        canvas.add(holder);
    }
});

////////////////////////
// 3.
iVoLVER.gui.add.modeButton({
    name: 'DrawLine',
    iconClass: 'workshop-line',
    persistent: true,
    onMouseDown: function (x, y, workspace) {
        workspace.down = true;
        var line = new fabric.Line([x, y, x, y], {// creating a Fabric.js line
            strokeWidth: 3,
            stroke: '#172557',
        });
        workspace.line = line;
        canvas.add(workspace.line); // storing the created line in the workspace
    },
    onMouseMove: function (x, y, workspace) {
        if (workspace.down) {
            // updating the line's ending coordinates
            workspace.line.set({x2: x, y2: y});
        }
    }
});
iVoLVER.gui.add.modeButton({
    name: 'DrawSquare',
    iconClass: 'workshop-square',
    persistent: true,
    onMouseDown: function (x, y, workspace) {
        workspace.down = true;
        workspace.initalX = x;
        workspace.initalY = y;
        var square = new fabric.Rect({
            left: x, top: y,
            width: 0, height: 0,
            strokeWidth: 3,
            stroke: 'black',
            fill: '#BB5E7D',
        });
        workspace.square = square;
        canvas.add(workspace.square);
    },
    onMouseMove: function (x, y, workspace) {
        if (workspace.down) {
            // updating the line's ending coordinates
            var width = Math.abs(workspace.initalX - x);
            var height = Math.abs(workspace.initalY - y);
            workspace.square.set({width: width, height: height});
        }
    }
});
iVoLVER.gui.add.modeButton({
    name: 'DrawCircle',
    iconClass: 'workshop-circle',
    persistent: true,
    onMouseDown: function (x, y, workspace) {
        workspace.down = true;
        workspace.initalX = x;
        var circle = new fabric.Circle({
            left: x, top: y,
            radius: 0,
            strokeWidth: 3,
            stroke: 'black',
            fill: '#A1D890',
        });
        workspace.circle = circle;
        canvas.add(workspace.circle);
    },
    onMouseMove: function (x, y, workspace) {
        if (workspace.down) {
            var radius = Math.abs(workspace.initalX - x) / 2;
            workspace.circle.set({radius: radius});
        }
    }
});

/********************************************/
/********    CONNECTABLE ELEMENTS    ********/
/********************************************/

////////////////////////
// 1. 
var ConnectableSquare = iVoLVER.util.createClass(fabric.Rect, {
    isSquare: true,
    initialize: function (options) {
        options || (options = {});
        options.width = options.side;
        options.height = options.side;
        this.callSuper('initialize', options);
        this.initConnectable();
    },
    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = source.isCircle || source.isSquare || (source.isTriangle && source.countConnectedCircles() === 2);
        var message = '';
        if (!connectionAccepted) {
            message = 'Sorry, this Triangle should be connected to two circles to be accepted.';
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },
    connectionAccepted: function (connection, target) {
        this.fill = iVoLVER.util.getRandomColor();
    }
});
iVoLVER.util.extends(ConnectableSquare.prototype, iVoLVER.model.Connectable);

var ConnectableCircle = iVoLVER.util.createClass(fabric.Circle, {
    isCircle: true,
    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.initConnectable();
    },
    processConnectionRequest: function (connection) {
        var source = connection.source;
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
    }
});
iVoLVER.util.extends(ConnectableCircle.prototype, iVoLVER.model.Connectable);

var ConnectableTriangle = iVoLVER.util.createClass(fabric.Polygon, {
    isTriangle: true,
    initialize: function (options) {
        options || (options = {});
        var points = iVoLVER.util.buildPolygon(0, 0, options.radius, 3);
        console.log(sides);
        this.callSuper('initialize', points, options);
        this.initConnectable();
    },
    processConnectionRequest: function (connection) {
        var source = connection.source;
        var connectionAccepted = true;
        var message = '';
        if (!source.isTriangle) {
            connectionAccepted = false;
            message = 'Sorry, I only accept connections from Triangles.';
        }
        return {
            connectionAccepted: connectionAccepted,
            message: message
        };
    },
    acceptConnection: function (connection) {
        this.fill = iVoLVER.util.getRandomColor();
    },
    countConnectedCircles: function () {
        var count = 0;
        this.inConnections.forEach(function (connection) {
            if (connection.source && connection.source.isCircle) {
                count++;
            }
        });
        this.outConnections.forEach(function (connection) {
            if (connection.destination && connection.destination.isCircle) {
                count++;
            }
        });
        return count;
    }
});
iVoLVER.util.extends(ConnectableTriangle.prototype, iVoLVER.model.Connectable);

////////////////////////
// 2.
var shapesSection = iVoLVER.gui.add.iconGroup({
    title: 'Shapes'
});
// Adding triangle draggable icon
iVoLVER.gui.add.draggableIcon({
    sectionID: shapesSection,
    iconClass: 'workshop-triangle',
    onMouseUp: function (x, y) {
        var triangle = new ConnectableTriangle({
            radius: 50,
            fill: 'purple',
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            top: y,
            left: x
        });
        canvas.add(triangle);
    }
});
// Adding SQUARE draggable icon
iVoLVER.gui.add.draggableIcon({
    sectionID: shapesSection,
    iconClass: 'workshop-square',
    onMouseUp: function (x, y) {
        var square = new ConnectableSquare({
            side: 80,
            fill: 'red',
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            top: y,
            left: x
        });
        canvas.add(square);
    }
});
// Adding CIRCLE draggable icon
iVoLVER.gui.add.draggableIcon({
    sectionID: shapesSection,
    iconClass: 'workshop-circle',
    onMouseUp: function (x, y) {
        var circle = new ConnectableCircle({
            radius: 40,
            fill: 'blue',
            stroke: 'black',
            originX: 'center',
            originY: 'center',
            top: y,
            left: x
        });
        canvas.add(circle);
    }
});

/*************************************/
/********    VALUE HOLDERS    ********/
/*************************************/

////////////////////////
// 1.
var value1 = createStringValue({string: 'Peace'});
var value2 = createNumberValue({unscaledValue: 785});
////////////////////////
// 2
var vh1 = new iVoLVER.model.ValueHolder({
    top: 100,
    left: 200,
    value: value1,
});
var vh2 = new iVoLVER.model.ValueHolder({
    top: 100,
    left: 300,
    value: value2,
});
canvas.add(vh1);
canvas.add(vh2);
////////////////////////
// 3.
var vh3 = new iVoLVER.model.ValueHolder({
    top: 100,
    left: 420,
    value: value1,
    fill: '#f93385',
    stroke: '#cb0557',
    path: customSVGPath1,
    noBackgroundCircle: true
});
var vh4 = new iVoLVER.model.ValueHolder({
    top: 100,
    left: 600,
    value: value2,
    fill: '#e0e0e0',
    stroke: '#424242',
    path: customSVGPath2,
    noBackgroundCircle: true
});
////////////////////////
// 4.
canvas.add(vh3);
canvas.add(vh4);

/******************************************************/
/********    CONFIGURING EXPANDABLE OBJECTS    ********/
/******************************************************/

////////////////////////
// 1. 
var LabeledRect = iVoLVER.util.createClass(fabric.Rect, {// extending from Rect
    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.initExpandable();
    },
});
iVoLVER.util.extends(LabeledRect.prototype, iVoLVER.model.Expandable);
var parent = new LabeledRect({
    fill: '#F9D333', originX: 'center', originY: 'center',
    width: 200, height: 80, top: 300, left: 300
});
for (var i = 0; i < 8; i++) {
    var child = new fabric.Circle({radius: 25, fill: '#034EA2'});
    var compressedOriginParent = null;
    var compressedOriginChild = null;
    var expandedOriginParent = null;
    var expandedOriginChild = null;
    var compressedX = null;
    if (i < 4) {// children to the left
        // compressed
        compressedOriginParent = {originX: 'right', originY: 'top'};
        compressedOriginChild = {originX: 'left', originY: 'top'};
        compressedX = 5;
        // expanded
        expandedOriginParent = {originX: 'right', originY: 'center'};
        expandedOriginChild = {originX: 'left', originY: 'center'};
        expandedX = (i % 4) * 55 + 30;
    } else {// children to the right
        // compressed
        compressedOriginParent = {originX: 'left', originY: 'top'};
        compressedOriginChild = {originX: 'right', originY: 'top'};
        compressedX = -5;
        // expanded
        expandedOriginParent = {originX: 'left', originY: 'center'};
        expandedOriginChild = {originX: 'right', originY: 'center'};
        expandedX = -(i % 4) * 55 - 30;
    }
    var compressedY = (i % 4) * 22;
    var expandedY = 0;
    parent.addChild(child, {
        whenCompressed: {
            x: compressedX, y: compressedY,
            scaleX: 0.25, scaleY: 0.25, opacity: 0.25,
            originParent: compressedOriginParent, originChild: compressedOriginChild
        },
        whenExpanded: {
            x: expandedX, y: expandedY,
            originParent: expandedOriginParent, originChild: expandedOriginChild
        },
        movable: true
    });
    canvas.add(child);
}
canvas.add(parent);
////////////////////////
// 2.
var LabeledRect = iVoLVER.util.createClass(fabric.Rect, {// extending from Rect
    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.initExpandable();
    },
});
iVoLVER.util.extends(LabeledRect.prototype, iVoLVER.model.Expandable);
var parent = new LabeledRect({
    fill: '#F9D333', originX: 'center', originY: 'center',
    width: 200, height: 80, top: 300, left: 300
});
for (var i = 0; i < 8; i++) {
    var child = new fabric.Circle({radius: 25, fill: '#034EA2'});
    var compressedOriginParent = null;
    var compressedOriginChild = null;
    var expandedOriginParent = null;
    var expandedOriginChild = null;
    var compressedX = null;
    var compressedScaleX = null;
    var compressedScaleY = null;
    var compressedOpacity = null;
    var expandedScaleX = null;
    var expandedScaleY = null;
    var expandedOpacity = null;
    if (i < 4) {// children to the left
        // compressed
        compressedOriginParent = {originX: 'left', originY: 'center'};
        compressedOriginChild = {originX: 'right', originY: 'center'};
        compressedX = -(i % 4) * 55 - 30;
        compressedY = 0;
        compressedScaleX = 1;
        compressedScaleY = 1;
        compressedOpacity = 1;
        // expanded
        expandedOriginParent = {originX: 'left', originY: 'top'};
        expandedOriginChild = {originX: 'right', originY: 'top'};
        expandedX = -5;
        expandedY = (i % 4) * 22;
        expandedScaleX = 0.25;
        expandedScaleY = 0.25;
        expandedOpacity = 0.5;
    } else {// children to the right
        // compressed
        compressedOriginParent = {originX: 'right', originY: 'top'};
        compressedOriginChild = {originX: 'left', originY: 'top'};
        compressedX = 5;
        compressedY = (i % 4) * 22;
        compressedScaleX = 0.25;
        compressedScaleY = 0.25;
        compressedOpacity = 0.5;
        // expanded
        expandedOriginParent = {originX: 'right', originY: 'center'};
        expandedOriginChild = {originX: 'left', originY: 'center'};
        expandedX = (i % 4) * 55 + 30;
        expandedY = 0;
        expandedScaleX = 1;
        expandedScaleY = 1;
        expandedOpacity = 1;
    }
    parent.addChild(child, {
        whenCompressed: {
            x: compressedX, y: compressedY,
            scaleX: compressedScaleX, scaleY: compressedScaleY, opacity: compressedOpacity,
            originParent: compressedOriginParent, originChild: compressedOriginChild
        },
        whenExpanded: {
            x: expandedX, y: expandedY,
            scaleX: expandedScaleX, scaleY: expandedScaleY, opacity: expandedOpacity,
            originParent: expandedOriginParent, originChild: expandedOriginChild
        }
    });
    canvas.add(child);
}
canvas.add(parent);
////////////////////////
// 3.
var LabeledRect = iVoLVER.util.createClass(fabric.Rect, {// extending from Rect
    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.initExpandable();
    },
});
iVoLVER.util.extends(LabeledRect.prototype, iVoLVER.model.Expandable);
var parent = new LabeledRect({
    fill: '#F9D333', originX: 'center', originY: 'center',
    width: 200, height: 80, top: 300, left: 300
});
var leftChild = new LabeledRect({
    fill: '#034EA2', originX: 'center', originY: 'center',
    width: 150, height: 60, top: 300, left: 300
});
var rightChild = new LabeledRect({
    fill: '#034EA2', originX: 'center', originY: 'center',
    width: 150, height: 60, top: 300, left: 300
});
parent.addChild(leftChild, {
    whenCompressed: {
        x: 0, y: 0
    },
    whenExpanded: {
        x: -10, y: 0,
        originParent: {originX: 'left', originY: 'center'},
        originChild: {originX: 'right', originY: 'center'},
    }
});
// adding children of left child
for (var i = 0; i < 4; i++) {
    var child = new fabric.Circle({radius: 25, fill: '#ED1C24'});
    leftChild.addChild(child, {
        whenCompressed: {
            x: 0, y: 0
        },
        whenExpanded: {
            x: 0, y: -(10 + i * 60),
            originParent: {originX: 'center', originY: 'top'},
            originChild: {originX: 'center', originY: 'bottom'},
        }
    });
    canvas.add(child);
}
// adding right child
parent.addChild(rightChild, {
    whenCompressed: {
        x: 0, y: 0
    },
    whenExpanded: {
        x: 10, y: 0,
        originParent: {originX: 'right', originY: 'center'},
        originChild: {originX: 'left', originY: 'center'},
    }
});
// adding children of left child
for (var i = 0; i < 4; i++) {
    var child = new fabric.Circle({radius: 25, fill: '#ED1C24'});
    rightChild.addChild(child, {
        whenCompressed: {
            x: 0, y: 0
        },
        whenExpanded: {
            x: 0, y: 10 + i * 60,
            originParent: {originX: 'center', originY: 'bottom'},
            originChild: {originX: 'center', originY: 'top'},
        }
    });
    canvas.add(child);
}
canvas.add(parent);
canvas.add(leftChild);
canvas.add(rightChild);
var oldCompression = parent.compress;
parent.compress = function () {
    leftChild.compress();
    rightChild.compress();
    setTimeout(function () {
        parent.oldCompression = oldCompression;
        parent.oldCompression();
    }, 600);
}
parent.beforeExpanding = function () {
    leftChild.expand();
    rightChild.expand();
};
parent.beforeCompressing = function () {
    leftChild.compress();
    rightChild.compress();
};
///////////////////
// 4.
var LabeledRect = iVoLVER.util.createClass(fabric.Rect, {// extending from Rect
    initialize: function (options) {
        options || (options = {});
        this.callSuper('initialize', options);
        this.initExpandable();
    },
});
iVoLVER.util.extends(LabeledRect.prototype, iVoLVER.model.Expandable);
var parent = new LabeledRect({
    fill: '#F9D333', originX: 'center', originY: 'center',
    width: 200, height: 80, top: 300, left: 300
});
var topChild = new LabeledRect({
    fill: '#034EA2', originX: 'center', originY: 'center',
    width: 60, height: 150
});
var bottomChild = new LabeledRect({
    fill: '#034EA2', originX: 'center', originY: 'center',
    width: 60, height: 150
});
parent.addChild(topChild, {
    whenExpanded: {
        x: 0, y: -10,
        originParent: {originX: 'center', originY: 'top'},
        originChild: {originX: 'center', originY: 'bottom'},
    }
});
// adding children of left child
for (var i = 0; i < 4; i++) {
    var child = new fabric.Circle({radius: 25, fill: '#ED1C24'});
    topChild.addChild(child, {
        whenExpanded: {
            x: (10 + i * 60), y: 0,
            scaleX: 1 - (i + 1) * 0.2, scaleY: 1 - (i + 1) * 0.2,
            originParent: {originX: 'right', originY: 'center'},
            originChild: {originX: 'left', originY: 'center'},
        }
    });
    canvas.add(child);
}
// adding right child
parent.addChild(bottomChild, {
    whenExpanded: {
        x: 0, y: 10,
        originParent: {originX: 'center', originY: 'bottom'},
        originChild: {originX: 'center', originY: 'top'},
    }
});
// adding children of left child
for (var i = 0; i < 4; i++) {
    var child = new fabric.Circle({radius: 25, fill: '#ED1C24'});
    bottomChild.addChild(child, {
        whenExpanded: {
            x: -(10 + i * 60), y: 0,
            scaleX: 1 - (i + 1) * 0.2, scaleY: 1 - (i + 1) * 0.2,
            originParent: {originX: 'left', originY: 'center'},
            originChild: {originX: 'right', originY: 'center'},
        }
    });
    canvas.add(child);
}
canvas.add(parent);
canvas.add(topChild);
canvas.add(bottomChild);
parent.beforeExpanding = function () {
    topChild.expand();
    bottomChild.expand();
};
parent.beforeCompressing = function () {
    topChild.compress();
    bottomChild.compress();
};

/**************************************************/
/********    THE DINOSAUR AND ITS APPLE    ********/
/**************************************************/

///////////////////
// 1. 
var ExpandablePath = iVoLVER.util.createClass(fabric.Path, {// extending from Rect
    initialize: function (path, options) {
        options || (options = {});
        this.callSuper('initialize', path, options);
        this.initExpandable();
    },
});
iVoLVER.util.extends(ExpandablePath.prototype, iVoLVER.model.Expandable);

///////////////////
// 2.
function assembleDinosaur() {
    var dinosaur = new ExpandablePath(dinosaurPath, {top: 300, left: 300, strokeWidth: 2, stroke: 'black', fill: '#7f7f7f'});
    canvas.add(dinosaur);
    var apple = new fabric.Path(applePath, {top: 300, left: 400, strokeWidth: 2, stroke: '#6c2c2d', fill: '#ba585a'});
    canvas.add(apple);
    dinosaur.addChild(apple, {
        whenCompressed: {
            x: 0, y: 0,
            scaleX: 1, scaleY: 1, opacity: 1,
            originParent: {originX: 'right', originY: 'center'},
            originChild: {originX: 'left', originY: 'center'}
        },
        whenExpanded: {
            x: 200, y: 100,
            scaleX: 0.5, scaleY: 0.5, opacity: 0.5,
            originParent: {originX: 'right', originY: 'top'},
            originChild: {originX: 'left', originY: 'top'}
        }
    });
}

///////////////////
// 3.
iVoLVER.gui.add.button({
    sectionID: iVoLVER.gui.toolbar, // variable storing the id of the top toolbar
    tooltip: 'Add dinosaur',
    iconClass: 'workshop-dinosaur',
    onClick: function () {
        assembleDinosaur();
    }
});

///////////////////
// 4.
dinosaur.afterCompressing = function () {
    var options = dinosaur.getStateProperties(apple, true);
    var w = dinosaur.getWidth();
    var h = dinosaur.getHeight();
    options.x = iVoLVER.util.getRandomInt(-300 - w / 2, 300 + h / 2);
    options.y = iVoLVER.util.getRandomInt(-300 - w / 2, 300 + h / 2);
    options.originParent = {originX: 'center', originY: 'center'};
    options.originChild = {originX: 'center', originY: 'center'};
};

/******************************************/
/********    MAGNETS AND SCREWS    ********/
/******************************************/
var Magnet = iVoLVER.util.createClass(fabric.Group, {
    isMagnet: true,
    initialize: function (objects, options) {
        options || (options = {});
        this.callSuper('initialize', objects, options);
        this.initExpandable();
        var theMagnet = this;
        this.registerListener('moving', function () {
            canvas.forEachObject(function (obj) {
                if (obj !== theMagnet && !theMagnet.hasChild(obj)) {
                    if (!obj.isMagnet && theMagnet.intersectsWithObject(obj)) {
                        if (obj.expandable) {
                            obj.expandable.removeChild(obj);
                        }
                        theMagnet.addChild(obj);
                    }
                }
            });
        });
    }
});
iVoLVER.util.extends(Magnet.prototype, iVoLVER.model.Expandable);
function loadMagnet(file, x, y) {
    fabric.loadSVGFromURL(file, function (objects, options) {
        var magnet = new Magnet(objects, options);
        magnet.left = x;
        magnet.top = y;
        canvas.add(magnet);
    });
}
function loadMagnets() {
    loadMagnet('svgs/magnet1.svg', 100, 100);
    loadMagnet('svgs/magnet2.svg', 900, 100);
}
var Screw = iVoLVER.util.createClass(fabric.Path, {
    initialize: function (path, options) {
        options || (options = {});
        this.callSuper('initialize', path, options);
    }
});
function createScrews(n) {
    for (var i = 0; i < n; i++) {
        var screw = new Screw(screwPath, {
            top: iVoLVER.util.getRandomInt(100, 200),
            left: iVoLVER.util.getRandomInt(300, 800),
        });
        canvas.add(screw);
    }
}
loadMagnets();
createScrews(10);


/**************************************/
/********    THE RACE TRACK    ********/
/**************************************/
iVoLVER.gui.add.button({
    sectionID: iVoLVER.gui.toolbar, // variable storing the id of the top toolbar
    tooltip: 'Race track!',
    iconClass: 'workshop-raceTrack',
    onClick: function () {
        loadRaceTrackObjects();
    }
});
function assembleRaceTrack(start, track1, track2, car1, car2, speedBump) {
    start.addChild(track1, {
        whenExpanded: {
            x: 5, y: 0,
            originParent: {originX: 'right', originY: 'top'},
            originChild: {originX: 'left', originY: 'top'}
        }
    });
    start.addChild(track2, {
        whenExpanded: {
            x: 5, y: 0,
            originParent: {originX: 'right', originY: 'bottom'},
            originChild: {originX: 'left', originY: 'bottom'}
        }
    });
    start.addChild(car1, {
        whenExpanded: {
            x: 25, y: 20,
            originParent: {originX: 'right', originY: 'top'},
            originChild: {originX: 'left', originY: 'top'}
        },
        movable: {
            x: {
                min: {
                    distance: 0, origin: 'left',
                    reference: {object: start, origin: 'right'}
                },
                max: {
                    distance: 0, origin: 'right',
                    reference: {object: speedBump, origin: 'left'}
                }
            }
        }
    });
    start.addChild(car2, {
        whenExpanded: {
            x: 50, y: -20,
            originParent: {originX: 'right', originY: 'bottom'},
            originChild: {originX: 'left', originY: 'bottom'}
        },
        movable: {
            x: {
                min: {
                    distance: 0, origin: 'left',
                    reference: {object: start, origin: 'right'}
                },
                max: {
                    distance: 0, origin: 'right',
                    reference: {object: track2, origin: 'right'}
                },
            }
        }
    });
    start.addChild(speedBump, {
        whenExpanded: {
            x: 200, y: 3.75,
            originParent: {originX: 'right', originY: 'top'},
            originChild: {originX: 'left', originY: 'top'}
        },
        movable: {
            x: {
                min: {
                    distance: 0, origin: 'left',
                    reference: {object: track2, origin: 'left'}
                },
                max: {
                    distance: 0, origin: 'right',
                    reference: {object: track2, origin: 'right'}
                },
            }
        }
    });
    canvas.add(track1);
    canvas.add(track2);
    canvas.add(car1);
    canvas.add(car2);
    canvas.add(speedBump);
    canvas.add(start);
}

/************************************/
/********    TYPE COUNTER    ********/
/************************************/

var TypeCounter = iVoLVER.util.createClass(fabric.Rect, {
    isTypeCounter: true,
    initialize: function (options) {
        options || (options = {});
        options.compressedProperties = {
            width: 100,
            height: 100
        };
        options.expandedProperties = {
            width: 400,
            height: 400
        };
        options.width = options.expandedProperties.width;
        options.height = options.expandedProperties.height;
        options.originX = 'center';
        options.originY = 'center';
        options.fill = 'rgba(71,104,193,0.5)';
        options.stroke = '#2b4281';
        options.strokeWidth = 3;
        this.callSuper('initialize', options);
        this.initExpandable();
        this.initCounters();
    },
    initCounters: function () {
        this.numbers = 0;
        this.strings = 0;
        this.colors = 0;
    },
    printCounts: function () {
        var theCounter = this;
        console.log("theCounter.numbers: " + theCounter.numbers);
        console.log("theCounter.strings: " + theCounter.strings);
        console.log("theCounter.colors: " + theCounter.colors);
    },
    updateCounters: function () {
        var theCounter = this;
        theCounter.numbers = 0;
        theCounter.strings = 0;
        theCounter.colors = 0;
        var children = this.getChildren();
        children.forEach(function (child) {
            if (child.value.isNumberValue) {
                theCounter.numbers++;
            } else if (child.value.isStringValue) {
                theCounter.strings++;
            } else if (child.value.isColorValue) {
                theCounter.colors++;
            }
        });
        theCounter.printCounts();
    },
    _render: function (ctx) {
        var theCounter = this;
        theCounter.callSuper('_render', ctx);
        ctx.font = '20px Helvetica';
        ctx.fillStyle = "rgba(0,0,0," + (1 - theCounter.getExpansionCoefficient()) + ")";
        ctx.textAlign = "center";
        var counters = theCounter.numbers + ' numbers, ' + theCounter.strings + ' strings, ' + theCounter.colors + ' and colors';
        ctx.fillText(counters, 0, theCounter.width / 2 + 25);
    }
});
iVoLVER.util.extends(TypeCounter.prototype, iVoLVER.model.Expandable);
var counter1 = new TypeCounter({
    top: 100,
    left: 200,
});
canvas.add(counter1);
var counter2 = new TypeCounter({
    top: 100,
    left: 500,
});
canvas.add(counter2);
var valueHolders = createValueHolders(5, 5, 5);
valueHolders.forEach(function (valueHolder) {
    valueHolder.registerListener('mouseup', function (options) {
        var canvasCoords = getCanvasCoordinates(options.e);
        var typeCounter = findPotentialDestination(canvasCoords, ['isTypeCounter']);
        if (typeCounter) {
            // removing from one and adding it to another counter
            if (valueHolder.getParent()) {
                var oldParent = valueHolder.getParent();
                oldParent.removeChild(valueHolder);
                oldParent.updateCounters(); // updating the count of the old parent
            }
            typeCounter.addChild(valueHolder, {movable: true});
            typeCounter.updateCounters();
        }
    });
    canvas.add(valueHolder);
});

/***************************************/
/********    POLYGONAL MARKS    ********/
/***************************************/
iVoLVER.data.registerType({
    name: 'Point',
    iconPath: pointDataTypeIcon,
    fillColor: '#00BDFF',
    iconClass: 'workshop-point',
    getDisplayableString: function () {
        return '(' + this.x + ',' + this.y + ')';
    },
    defaults: {x: 0, y: 0},
    onEditing: {
        x: {type: 'number', divStyle: 'float: left; margin-top: 2px;'},
        y: {type: 'number'}
    }
});
function getPolygonName(nSides) {
    var labels = [
        'Triangle',
        'Square',
        'Pentagon',
        'Hexagon',
        'Heptagon',
        'Octagon',
        'Nonagon',
        'Decagon'
    ];
    console.log("nSides: " + nSides);
    console.log("jdhjdhdhddh: " + labels[nSides - 3]);
    return labels[nSides - 3];
}
function initProperties() {
    var theMark = this;
    var pointValues = [];
    // using the points of the polygon to set the value of the points visual property
    theMark.points.forEach(function (point) {
        var pt = createPointValue({x: point.x, y: point.y});
        pointValues.push(pt);
    });
    // setting the value of the points property
    var pointsProperty = theMark.visualProperties.points;
    pointsProperty.setValue(pointValues);
    // setting the value of the radius property
    var radiusProperty = theMark.visualProperties.radius;
    radiusProperty.setValue(createNumberValue({unscaledValue: theMark.radius}));
    // setting the value of the sides property
    var sides = theMark.points.length;
    var sidesProperty = theMark.visualProperties.sides;
    sidesProperty.setValue(createNumberValue({unscaledValue: sides}));
    // setting the value of the label property
    var labelProperty = theMark.visualProperties.label;
    labelProperty.setValue(createStringValue({string: getPolygonName(sides)}));
}
function changeSidesOfPolygon(polygon, value, withAnimation) {
    var radiusProperty = polygon.visualProperties.radius.getValue();
    if (!iVoLVER.util.isUndefined(radiusProperty) && !iVoLVER.util.isNull(radiusProperty)) {
        var anchorPoint = polygon.getPointByOrigin(polygon.anchorX, polygon.anchorY);
        var radius = radiusProperty.number;
        var sides = value.number;
        var points = iVoLVER.util.buildPolygon(radius, sides);
        polygon.points = points;
        console.log("polygon.anchorX:" + polygon.anchorX);
        polygon.setPositionByOrigin(anchorPoint, polygon.anchorX, polygon.anchorY);
        polygon.positionObjects();
    }
}
function changeRadiusOfPolygon(polygon, value, withAnimation) {
    var sidesProperty = polygon.visualProperties.sides.getValue();
    if (!iVoLVER.util.isUndefined(sidesProperty) && !iVoLVER.util.isNull(sidesProperty)) {
        var anchorPoint = polygon.getPointByOrigin(polygon.anchorX, polygon.anchorY);
        var sides = sidesProperty.number;
        var radius = value.number;
        var points = iVoLVER.util.buildPolygon(radius, sides);
        polygon.points = points;
        console.log("polygon.anchorX:" + polygon.anchorX);
        polygon._calcDimensions();
        polygon.setPositionByOrigin(anchorPoint, polygon.anchorX, polygon.anchorY);
        polygon.positionObjects();
    }
}
var onPropertyChanged = {
    sides: function (value, withAnimation) {
        changeSidesOfPolygon(this, value, withAnimation);
    },
    radius: function (value, withAnimation) {
        changeRadiusOfPolygon(this, value, withAnimation);
    }
};
var properties = [
    {name: 'label'},
    {name: 'color', value: createColorValue({r: 87, g: 117, b: 198})},
    {name: 'radius'},
    {name: 'sides'},
    {name: 'points', readOnly: true},
];
var PolygonalMark = iVoLVER.obj.Mark.createClass(fabric.Polygon, {
    properties: properties,
    onPropertyChanged: onPropertyChanged,
    afterInit: initProperties
});
var radius = 60;
var pentagon = new PolygonalMark({
    radius: radius,
    points: iVoLVER.util.buildPolygon(radius, 5),
    top: 100, left: 100
});
var decagon = new PolygonalMark({
    radius: radius,
    points: iVoLVER.util.buildPolygon(radius, 10),
    top: 100, left: 300
});
canvas.add(pentagon);
canvas.add(decagon);