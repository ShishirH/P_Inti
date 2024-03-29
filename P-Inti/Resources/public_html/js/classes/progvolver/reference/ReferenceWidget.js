class ReferenceWidget {
    constructor(options, baseClass) {

        var symbolFont = '20px Helvetica';

        options.height = options.height || 50;
        options.width = options.width || 70;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.fill = 'transparent';//options.fill || 'white';//"#B3CDE3";
        options.stroke = 'transparent';//options.stroke || 'white';//"#B3CDE3";
        options.strokeWidth = options.strokeWidth || 0;
        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;
        options.eventable = false;
        options.selectable = false;
        options.opacity = 0;

        var background = createObjectBackground(fabric.Rect, options, null);
        background.childrenOnTop = [];
        background.object = baseClass;

        background.name = options.name;
        background.type = options.type;
        background.isReference = true;
        background.fileName = options.fileName;
        background.children = [];
        background.isArrayElement = options.isArrayElement || false;
        background.isArray = options.isArray || false;

        // method parameter changes
        background.referencedObjectId = options.referencedObjectId;
        background.referencedObjectDetails = options.referencedObjectDetails;
        background.otherReferencedObjects = []; // other widgets on canvas that have same address as the referenced object here
        background.otherReferencedObjectsArrows = [];
        background.otherReferencedObjectsBlock = [];

        background.expandedHeight = background.height;
        background.expandedWidth = background.width;

        background.onChangeCompressing = function (currentValue) {
            background.set('width', (background.expandedWidth * currentValue) + 50);
            background.set('height', (background.expandedHeight * currentValue) + 50);
        }

        background.afterCompressing = function () {
            background.set('width', 0);
            background.set('height', 0);
        }

        background.onChangeExpanding = function (currentValue) {
            background.set('width', (background.expandedWidth * currentValue));
            background.set('height', (background.expandedHeight * currentValue));
        }

        background.afterExpanding = function (currentValue) {
            background.set('width', (background.expandedWidth));
            background.set('height', (background.expandedHeight));
        }

        function addReferencePointer() {
            var sc = getScreenCoordinates(background.getPointByOrigin('left', 'center'));
            sc.y = sc.y;
            sc.x = sc.x;
            background.points = sc;
            var referencePointer = new ReferencePointer({
                background: background,
                drawPointer: true,
                radius: 6,
                fill: 'black'
            });

            var originParent;
            var originChild;

            var xPosition, yPosition;
            var scaleX = 0, scaleY = 0, opacity = 0;

            if (options.isMember) {
                xPosition = 0;
                yPosition = 1.5;
                originParent = {originX: 'left', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            } else if (options.isArrayMember) {
                xPosition = 0;
                yPosition = 0;
                originParent = {originX: 'center', originY: 'center'};
                originChild = {originX: 'center', originY: 'center'};
                scaleX = 1;
                scaleY = 1;
                opacity = 1;
            } else {
                xPosition = 3;
                yPosition = 1.5;
                originParent = {originX: 'left', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            }

            background.addChild(referencePointer, {
                whenCompressed: {
                    x: xPosition, y: yPosition,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: xPosition, y: yPosition,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            canvas.add(referencePointer);
            background.referencePointer = referencePointer;
            background.children.push(background.referencePointer);
            background.childrenOnTop.push(background.referencePointer);
        }

        var points;

        function addArrowLine() {
            var sc = getScreenCoordinates(background.getPointByOrigin('left', 'center'));
            var rightSc = getScreenCoordinates(background.getPointByOrigin('right', 'center'));

            var originParent, originChild;
            var xPosition, yPosition;

            points = [sc.x, sc.y, rightSc.x - 10, sc.y];
            xPosition = 5;
            yPosition = 0;
            originParent = {originX: 'left', originY: 'center'};
            originChild = {originX: 'left', originY: 'center'};


            var line = new fabric.Line(points, {
                strokeWidth: 3,
                stroke: 'black',
                fill: 'black',
                hasControls: false,
                hasBorders: false,
                hasRotatingPoint: false,
                hoverCursor: 'default',
                selectable: false
            });

            line.triangle = [
                [3, 0],
                [-10, -6],
                [-10, 6]
            ];
            line.oldRender = line.render;
            line.render = function (ctx) {
                line.oldRender(ctx);
                //ctx.save();
                let lineEndCoords = null;
                let lineStartCoords = null;

                if (background.minimizeButton) {
                    lineEndCoords = background.minimizeButton.getPointByOrigin('left', 'center');
                    lineEndCoords.x -= 4;
                } else {
                    lineEndCoords = background.getPointByOrigin('right', 'center');
                }
                lineStartCoords = background.referencePointer.getPointByOrigin('center', 'center');
                lineStartCoords.y -= 1.5;

                background.arrowLine.set('x2', lineEndCoords.x);
                background.arrowLine.set('y2', lineEndCoords.y);
                background.arrowLine.set('x1', lineStartCoords.x);
                background.arrowLine.set('y1', lineStartCoords.y);

                ctx.fillStyle = 'black';
                let theConnector = line;

                var x1 = -theConnector.width / 2 + lineStartCoords.x;
                var y1 = theConnector.height / 2 + lineStartCoords.y;
                var x2 = theConnector.width / 2 + lineStartCoords.x;
                var y2 = -theConnector.height / 2 + lineStartCoords.y;

                if (line.y1 < line.y2) {
                    y1 = -theConnector.height / 2;
                    y2 = theConnector.height / 2;
                }

                if (line.x1 > line.x2) {
                    x1 = theConnector.width / 2;
                    x2 = -theConnector.width / 2;
                }

                var deltaX = x2 - x1;
                var deltaY = y2 - y1;

                var angle = Math.atan(deltaY / deltaX);
                if (line.x1 > line.x2) {
                    angle += fabric.util.degreesToRadians(180);
                }

                var p1 = {x: x1, y: y1};
                var p2 = {x: x2, y: y2};
                var l = {p1: p1, p2: p2};
                var length = computeLength(l);

                var point = getPointAlongLine(l, length - 20);
                var x = point.x;
                var y = point.y;

                //ctx.restore();
                // background.isMember || background.minimizeButton.sign === '-')??
                if (!background.isCompressed) {
                    drawFilledPolygon(translateShape(rotateShape(theConnector.triangle, angle), line.x2 + (line.strokeWidth / 2), line.y2 + (line.strokeWidth / 2)), ctx);
                }
            };

            background.addChild(line, {
                whenCompressed: {
                    x: xPosition, y: yPosition,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: xPosition, y: yPosition,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            canvas.add(line);
            background.arrowLine = line;
            background.children.push(line);
            background.childrenOnTop.push(line);
        }

        function addName() {
            var typeStyle = {
                0: {}
            };

            var nameStyle = {
                0: {}
            };

            for (var i = 0; i < background.type.length; i++) {
                typeStyle['0']['' + i] = {fill: 'rgb(0,0,255)'};
            }

            for (var i = 0; i < background.name.length; i++) {
                nameStyle['0']['' + i] = {fontWeight: 'bold', fill: 'rgb(0,0,0)'};
            }
//            for (var i = background.type.length + 1; i < background.type.length + 1 + background.name; i++) {
//                styles['0']['' + i] = {fontWeight: 'bold', fill: 'rgb(0,0,0)'};
//            }

            var typeObject = new fabric.Text(background.type, {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'right',
                editingBorderColor: 'white',
                selectable: false,
                eventable: false,
                styles: typeStyle
            });

            var nameObject = new fabric.Text(background.name, {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'right',
                editingBorderColor: 'white',
                selectable: false,
                eventable: false,
                styles: nameStyle
            });

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};

            let xPosition;

            if (background.isMember) {
                xPosition = -11;
            } else {
                xPosition = 0;
            }
            background.addChild(typeObject, {
                whenCompressed: {
                    x: xPosition, y: -10,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: xPosition, y: -10,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.addChild(nameObject, {
                whenCompressed: {
                    x: xPosition, y: +5,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: xPosition, y: +5,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.typeObject = typeObject;
            background.nameObject = nameObject;

            background.childrenOnTop.push(typeObject);
            background.childrenOnTop.push(nameObject);

            canvas.add(typeObject);
            canvas.add(nameObject);
            background.nameObject = nameObject;
            background.typeObject = typeObject;
            background.children.push(background.nameObject);
            background.children.push(background.typeObject);
        }

        function addMinimizeButton() {
            var minimizeButton = new MinimizeButton({
                sign: "+",
                radius: 12,
                parent: background,
                hasControls: false,
                hasBorders: false
            });

            var xPosition, yPosition;
            var originParent, originChild;
            var scaleX = 0, scaleY = 0, opacity = 0;

            if (options.isMember) {
                xPosition = 44;
                yPosition = 0;
                originParent = {originX: 'left', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            } else {
                xPosition = 12;
                yPosition = 0;
                originParent = {originX: 'right', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            }

            background.minimizeButtonOriginalXPos = xPosition;
            background.minimizeButtonOriginalYPos = yPosition;

            background.addChild(minimizeButton, {
                whenCompressed: {
                    x: xPosition, y: yPosition,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: xPosition, y: yPosition,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            // WHY WAS THIS HERE?
            // var sc = background.getPointByOrigin('right', 'center');
            // minimizeButton.x = sc.x + 12;
            // minimizeButton.y = sc.y;
            // minimizeButton.left = sc.x + 12;
            // minimizeButton.top = sc.y;

            minimizeButton.state = "minimize";

            if (background.object) {
                background.object.referenceWidget = background;
                minimizeButton.registerListener('mouseup', background.minimizeButtonMouseup);
            }

            canvas.add(minimizeButton);
            background.minimizeButton = minimizeButton;
            background.children.push(background.minimizeButton);
            background.childrenOnTop.push(background.minimizeButton);
        }

        background.minimizeButtonMouseup = function() {
            console.log("I am being clicked");
            if (!background.object) {
                return;
            }

            let minimizeButton = background.minimizeButton;
            let screenCoords = background.minimizeButton.getPointByOrigin('right', 'center');
            let xPosition = screenCoords.x + (background.object.expandedWidth / 2) + 2;
            let yPosition = screenCoords.y;


            let minimizeButtonXPos;
            let minimizeButtonYPos;
            if (background.isMember) {
                xPosition = screenCoords.x + (background.object.expandedWidth) + 20;
                yPosition = yPosition + 3;
                minimizeButtonXPos = screenCoords.x + (background.object.expandedWidth) + 20;
            } else {
                minimizeButtonXPos = background.minimizeButtonOriginalXPos;
            }

            background.object.x = xPosition;
            background.object.left = xPosition;

            if (background.isMember) {
                background.object.x = xPosition - 20;
                background.object.left = xPosition - 20;
            }

            background.object.y = yPosition;
            background.object.top = yPosition;

            // display class that it is reference of, and hide the button
            if (minimizeButton.state == "minimize") {
                console.log("I am in here");
                console.log(background);
                if (background.object.addAll)
                    background.object.addAll();
                else
                    canvas.add(background.object);

                minimizeButton.state = "maximize"
                minimizeButton.sign = "–";


                if (background.isMember) {
                    var position = (background.object.getPointByOrigin('left', 'center'));

                    let yPosition = parseFloat(position.y) - 3
                    let xPosition = parseFloat(position.x) - 67;
                    background.minimizeButton.x = xPosition;
                    background.minimizeButton.y = yPosition;
                    background.minimizeButton.left = xPosition;
                    background.minimizeButton.top = yPosition;
                }
            } else {
                if (background.isMember) {
                    background.compressedOptions[background.minimizeButton.id].x = background.minimizeButtonOriginalXPos;
                    background.expandedOptions[background.minimizeButton.id].x = background.minimizeButtonOriginalXPos;
                }

                if (background.object.removeAll)
                    background.object.removeAll();
                else
                    canvas.remove(background.object);

                minimizeButton.state = "minimize"
                minimizeButton.sign = "+";
                background.positionObjects();
            }
        }

        function addReferencedObject() {
            console.log("Adding reference object");
            console.log(background.object);

            if (background.object === undefined) {
                background.minimizeButton.sign = "?";
                return;
            } else if (background.minimizeButton.sign == "?" || background.minimizeButton.sign == "X" || background.minimizeButton.sign === '/') {
                background.minimizeButton.sign = "+";
                background.object.referenceWidget = background;
                background.minimizeButton.registerListener('mouseup', background.minimizeButtonMouseup);
            }

            var rightSc = getScreenCoordinates(background.getPointByOrigin('right', 'center'));

            background.object.left = rightSc.x + 25;
            background.object.top = rightSc.y - 35;

            background.object.parent = background;
            canvas.add(background.object);
            background.children.push(background.object);

            background.object.registerListener('moving', function () {
                adjustReferenceObjectPosition(background);
            });
        }

        addReferencePointer();
        addArrowLine();

        addName();

        addMinimizeButton();

        addReferencedObject();

        background.removeAll = function () {
            background.children.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        canvas.remove(content);
                    })
                }
                canvas.remove(child);
            });
            canvas.remove(background)
        }


        background.setMemoryAddressFromJson = function (memoryAddress) {
            background.object.memoryAddress = memoryAddress;
        }

        background.setMemoryAddress = function () {
            if (background.object) {
                let memoryAddress;
                let filteredLog = window.logData.filter(item => item.widgetsID === background.object.id);

                for (let logLine of filteredLog) {
                    if (logLine.memoryAddress) {
                        memoryAddress = logLine.memoryAddress;
                        break;
                    }
                }
                console.log("Memory address object is: ");
                console.log(background.object);
                console.log("Memory address is: ");
                console.log(memoryAddress);
                background.object.memoryAddress = memoryAddress;
            }
        }

        background.drawTransluscentBlockToObjectAtSameMemory = function () {
            console.log("drawTransluscentBlockToObjectAtSameMemory")   ;

            for (let sameMemoryObject of background.otherReferencedObjects) {
                console.log("Same memory object: ");
                console.log(sameMemoryObject);
                var sc = getScreenCoordinates(background.getPointByOrigin('left', 'center'));
                var rightSc = getScreenCoordinates(background.getPointByOrigin('right', 'center'));

                var originParent, originChild;
                var xPosition, yPosition;

                points = [sc.x, sc.y, rightSc.x - 10, sc.y];
                xPosition = 5;
                yPosition = 0;
                originParent = {originX: 'left', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};


                var line = new fabric.Line(points, {
                    strokeWidth: 3,
                    stroke: 'black',
                    fill: 'black',
                    hasControls: false,
                    hasBorders: false,
                    hasRotatingPoint: false,
                    hoverCursor: 'default',
                    selectable: false
                });

                line.triangle = [
                    [3, 0],
                    [-10, -6],
                    [-10, 6]
                ];
                line.oldRender = line.render;
                line.render = function (ctx) {
                    line.oldRender(ctx);
                    //ctx.save();
                    let lineEndCoords = null;
                    let lineStartCoords = null;

                    if (background.minimizeButton) {
                        lineEndCoords = sameMemoryObject.referenceWidget.minimizeButton.getPointByOrigin('left', 'center');
                        lineEndCoords.x -= 4;
                    } else {
                        lineEndCoords = sameMemoryObject.referenceWidget.getPointByOrigin('right', 'center');
                    }
                    lineStartCoords = background.referencePointer.getPointByOrigin('center', 'center');
                    lineStartCoords.y -= 1.5;

                    line.set('x2', lineEndCoords.x);
                    line.set('y2', lineEndCoords.y);
                    line.set('x1', lineStartCoords.x);
                    line.set('y1', lineStartCoords.y);

                    ctx.fillStyle = 'black';
                    let theConnector = line;

                    var x1 = -theConnector.width / 2 + lineStartCoords.x;
                    var y1 = theConnector.height / 2 + lineStartCoords.y;
                    var x2 = theConnector.width / 2 + lineStartCoords.x;
                    var y2 = -theConnector.height / 2 + lineStartCoords.y;

                    if (line.y1 < line.y2) {
                        y1 = -theConnector.height / 2;
                        y2 = theConnector.height / 2;
                    }

                    if (line.x1 > line.x2) {
                        x1 = theConnector.width / 2;
                        x2 = -theConnector.width / 2;
                    }

                    var deltaX = x2 - x1;
                    var deltaY = y2 - y1;

                    var angle = Math.atan(deltaY / deltaX);
                    if (line.x1 > line.x2) {
                        angle += fabric.util.degreesToRadians(180);
                    }

                    var p1 = {x: x1, y: y1};
                    var p2 = {x: x2, y: y2};
                    var l = {p1: p1, p2: p2};
                    var length = computeLength(l);

                    var point = getPointAlongLine(l, length - 20);
                    var x = point.x;
                    var y = point.y;

                    //ctx.restore();
                    if (!background.isCompressed)
                        drawFilledPolygon(translateShape(rotateShape(theConnector.triangle, angle), line.x2 + (line.strokeWidth / 2), line.y2 + (line.strokeWidth / 2)), ctx);
                };

                background.addChild(line, {
                    whenCompressed: {
                        x: xPosition, y: yPosition,
                        originParent: originParent,
                        originChild: originChild
                    },
                    whenExpanded: {
                        x: xPosition, y: yPosition,
                        originParent: originParent,
                        originChild: originChild
                    },
                    movable: false
                });

                canvas.add(line);

                background.otherReferencedObjectsArrows.push(line);
                //background.children.push(line);
                //background.childrenOnTop.push(line);
            }

        }

        background.drawArrowToObjectsAtSameMemory = function () {
            console.log("drawArrowToObjectsAtSameMemory");

            // Remove existing lines
            for (let line of background.otherReferencedObjectsArrows) {
                canvas.remove(line);
            }

            for (let sameMemoryObject of background.otherReferencedObjects) {
                console.log("Same memory object: ");
                console.log(sameMemoryObject);
                var sc = getScreenCoordinates(background.minimizeButton.getPointByOrigin('center', 'center'));
                var rightSc = getScreenCoordinates(sameMemoryObject.referenceWidget.minimizeButton.getPointByOrigin('center', 'center'));

                var originParent, originChild;
                var xPosition, yPosition;

                points = [sc.x, sc.y, rightSc.x - 10, sc.y];
                xPosition = 5;
                yPosition = 0;
                originParent = {originX: 'left', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};


                var line = new fabric.Line(points, {
                    strokeWidth: 1,
                    strokeDashArray: [3, 3],
                    stroke: 'black',
                    fill: 'black',
                    hasControls: false,
                    hasBorders: false,
                    hasRotatingPoint: false,
                    hoverCursor: 'default',
                    selectable: false
                });

                line.triangle = [
                    [3, 0],
                    [-10, -6],
                    [-10, 6]
                ];
                line.oldRender = line.render;
                line.render = function (ctx) {
                    line.oldRender(ctx);
                    //ctx.save();
                    let lineEndCoords = null;
                    let lineStartCoords = null;

                    if (background.minimizeButton) {
                        lineEndCoords = sameMemoryObject.referenceWidget.minimizeButton.getPointByOrigin('center', 'center');
                        lineEndCoords.x -= 4;
                    } else {
                        lineEndCoords = sameMemoryObject.referenceWidget.getPointByOrigin('right', 'center');
                    }
                    lineStartCoords = background.minimizeButton.getPointByOrigin('center', 'center');
                    lineStartCoords.y -= 1.5;

                    line.set('x2', lineEndCoords.x);
                    line.set('y2', lineEndCoords.y);
                    line.set('x1', lineStartCoords.x);
                    line.set('y1', lineStartCoords.y);

                    ctx.fillStyle = 'black';
                    let theConnector = line;

                    var x1 = -theConnector.width / 2 + lineStartCoords.x;
                    var y1 = theConnector.height / 2 + lineStartCoords.y;
                    var x2 = theConnector.width / 2 + lineStartCoords.x;
                    var y2 = -theConnector.height / 2 + lineStartCoords.y;

                    if (line.y1 < line.y2) {
                        y1 = -theConnector.height / 2;
                        y2 = theConnector.height / 2;
                    }

                    if (line.x1 > line.x2) {
                        x1 = theConnector.width / 2;
                        x2 = -theConnector.width / 2;
                    }

                    var deltaX = x2 - x1;
                    var deltaY = y2 - y1;

                    var angle = Math.atan(deltaY / deltaX);
                    if (line.x1 > line.x2) {
                        angle += fabric.util.degreesToRadians(180);
                    }

                    var p1 = {x: x1, y: y1};
                    var p2 = {x: x2, y: y2};
                    var l = {p1: p1, p2: p2};
                    var length = computeLength(l);

                    var point = getPointAlongLine(l, length - 20);
                    var x = point.x;
                    var y = point.y;
                };

                background.addChild(line, {
                    whenCompressed: {
                        x: xPosition, y: yPosition,
                        originParent: originParent,
                        originChild: originChild
                    },
                    whenExpanded: {
                        x: xPosition, y: yPosition,
                        originParent: originParent,
                        originChild: originChild
                    },
                    movable: false
                });

                canvas.add(line);
                //background.arrowLine = line;
                background.otherReferencedObjectsArrows.push(line);
                //background.childrenOnTop.push(line);
            }

        }

        background.addAll = function () {
            background.children.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        canvas.add(content);
                    })
                }
                canvas.add(child);
            });
            canvas.add(background)
        }

        background.registerListener('added', function () {
            background.bringToFront();
            bringToFront(background);
            background.children.forEach(function (child) {
                if (child != background.object) {
                    child.bringToFront();
                    bringToFront(child)
                }
            });
            bringToFront(background.arrowLine);

            new CreationEvent(background);
        })

        background.organizeChildren = function () {
            background.bringToFront();
            bringToFront(background);
            background.children.forEach(function (child) {
                if (child != background.object) {
                    child.bringToFront();
                    bringToFront(child)
                }
            });
            bringToFront(background.arrowLine);
        }

        background.clone = function () {
            console.log("Insider reference clone")
            var clonedMember = background.object.clone();

            var clonedReference = new ReferenceWidget({
                fill: '#F02466',
                stroke: '#F02466',
                x: 250,
                y: 250,
                type: background.type,
                name: background.name,
                isArray: true
            }, clonedMember);

            console.log(clonedMember);

            return clonedReference;
        }

        background.toJson = function () {
            console.log("Inside toJson of reference widget")
            let json = {};

            json['fill'] = background.fill;
            json['stroke'] = background.stroke;
            json['name'] = background.name;
            json['type'] = background.type;
            json['x'] = background.left;
            json['y'] = background.top;
            json['Kind_String'] = background.kind;
            json['kind'] = "ReferenceWidget";
            json['referencedObject'] = background.object.toJson();
            return JSON.stringify(json);
        }

        background.reInitializeObject = function () {
            background.minimizeButton.registerListener('mouseup', background.minimizeButtonMouseup);
            addReferencedObject();
            background.object.referenceWidget = background;
        }
        background.setValue = function (newValue) {
            console.log("New value is: ");
            console.log(newValue);

            if (newValue === undefined || newValue === "undefined") {
                background.minimizeButtonMouseup();
                background.object = undefined;
                background.minimizeButton.sign = "?";
            } else if (newValue === null || newValue === "null") {
                background.minimizeButtonMouseup();
                background.object = undefined;
                background.minimizeButton.sign = "X";
            } else if (newValue) {
                // A valid value was passed. For example: [3;40;60;100000000;0;0;0;0;0]

                console.log("Currently Background object is: ");
                console.log(background.object);

                // if currently background.object is undefined or null, have to create background.object widget
                if (!background.object) {
                    console.log("NEW AVLUE IS: ")
                    console.log(newValue);
                    var rightSc = getScreenCoordinates(background.getPointByOrigin('right', 'center'));
                    background.object = createObjectMemberWidgetsWithoutResponse(objectInfo[background.type], rightSc, background.fileName, background.name)

                    console.log("Background object is: ");
                    console.log(background.object);
                    addReferencedObject();
                }
                background.object.setValue(newValue);
            }
        }

        background.setProgramTime = function (time) {
            if (!background.oldRender) {
                background.oldRender = background.render;
            }

            if (background.history) {
                background.time = time;
                console.log("Name of ref: " + background.name);
                console.log("Background history is: ");
                console.log(background.history);
                this.values = background.history.filter(item => item.time <= time);
                console.log(this.values);
                if (this.values.length) {
                    //background.onValuesUpdated && background.onValuesUpdated(this.values);

                    for (let i = this.values.length - 1; i >= 0; i--) {
                        if (this.values[i].array && this.values[i].symbols.indexOf(background.name) != -1) {
                            console.log("this.values[i].array")
                            console.log(this.values[i].array)
                            if (background.object) {
                                console.log("Setting value");
                                background.object.setValue(this.values[i].array);
                            }
                            break;
                        }
                    }
                }

                console.log("referenceWidgetsList.length " + referenceWidgetsList.length)
                console.log(referenceWidgetsList)
                background.render = background.oldRender;

                for (let i = 0; i < referenceWidgetsList.length; i++) {

                    if (referenceWidgetsList[i] === background){
                        continue;
                    }

                    if (!background.object || !background.object.memoryAddress) {
                        break;
                    } else if (!referenceWidgetsList[i].object || !referenceWidgetsList[i].object.memoryAddress) {
                        continue;
                    }

                    let currentMemAddress = background.object.memoryAddress;
                    let otherMemAddress = referenceWidgetsList[i].object.memoryAddress;

                    console.log("XXY memoryAddress of object is: " + background.object.memoryAddress)
                    console.log("XXY The objects are: " + background.name + " and " + referenceWidgetsList[i].name)
                    if (otherMemAddress === currentMemAddress) {
                        console.log("XXY Found two same memory addresses: ")
                        if (referenceWidgetsList[i] !== background) {
                            console.log("XXY Both objects are different ");
                            console.log("The objects are: " + background.name + " and " + referenceWidgetsList[i].name)

                            if (!referenceWidgetsSameMemoryLines.has(otherMemAddress + currentMemAddress)
                            && !referenceWidgetsSameMemoryLines.has(currentMemAddress + otherMemAddress)) {
                                console.log("Line no found, drawing the line")
                                console.log("drawing line from: " + background.name + " to " + referenceWidgetsList[i].name)
                                console.log(background);
                                background.render = function (ctx) {
                                    background.oldRender(ctx);
                                    let lineEndCoords;
                                    let lineStartCoords;

                                    if (referenceWidgetsList[i].minimizeButton) {
                                        lineEndCoords = referenceWidgetsList[i].minimizeButton.getPointByOrigin('center', 'center');
                                        lineEndCoords.x -= 4;
                                    } else {
                                        lineEndCoords = referenceWidgetsList[i].getPointByOrigin('right', 'center');
                                    }
                                    lineStartCoords = background.minimizeButton.getPointByOrigin('center', 'center');
                                    lineStartCoords.y -= 1.5;

                                    ctx.beginPath();
                                    ctx.moveTo(lineStartCoords.x, lineStartCoords.y);
                                    ctx.lineTo(lineEndCoords.x, lineEndCoords.y);

                                    if ((referenceWidgetsList[i].minimizeButton && referenceWidgetsList[i].minimizeButton.sign === "+")
                                        || (background.minimizeButton && background.minimizeButton.sign === "+")) {
                                        ctx.setLineDash([10, 10]);
                                    } else {
                                        ctx.setLineDash([]);
                                    }
                                    ctx.stroke();
                                    // background.isMember || background.minimizeButton.sign === '-')??
                                };
                                referenceWidgetsSameMemoryLines.add(currentMemAddress + otherMemAddress);
                            } else {
                                console.log("Line found. Not drawing the line");
                                console.log("not drawing line from: " + background.name + " to " + referenceWidgetsList[i].name)
                                console.log(background);
                            }
                        }
                    }
                }
            }
        }

        background.setHistory = function () {
            background.history = window.logData.filter(item => item.widgetsID.indexOf(background.id) != -1);

            background.object.setHistory && background.object.setHistory();
        }

        this.progvolverType = "ReferenceWidget";

        //if (!background.isMember)
            registerProgvolverObject(background);

        console.log("Adding to persistent entry")
        PERSISTENT_CANVAS_ENTRIES.push(background);
        referenceWidgetsList.push(background);

        return background;
    }

    static fromJson(json) {
        let isArray = false;
        let referencedObjJson = json['referencedObject'];
        let referencedObj = null;

        console.log("The referencedObjJson is: ");
        console.log(referencedObjJson);
        if (referencedObjJson['kind'] === "ArraySymbol") {
            referencedObj = ArraySymbol.fromJson(referencedObjJson);
            isArray = true;
        }
        // } else if (referencedObjJson['kind'] === "ObjectWidget") {
        //     referencedObj = ObjectWidget.fromJson(referencedObjJson)
        // }

        console.log("Json is: ");
        console.log(json);

        let obj = new ReferenceWidget({
            type: json['type'],
            name: json['name'],
            file: json['file'],
            kind: json['Kind_String'],
            fileName: json['fileName'],
            x: json['x'], y: json['y'],
            left: json['x'], top: json['y'],
            fill: json['fill'],
            stroke: json['stroke'],
            isArray: isArray
        }, referencedObj);

        canvas.add(obj);
        obj.expand();
    }
}