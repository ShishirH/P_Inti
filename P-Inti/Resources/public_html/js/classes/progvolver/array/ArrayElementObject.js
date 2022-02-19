class ArrayElementObject {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.width = options.width || 20;
        options.height = options.height || 35;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;
        options.opacity = 1;
        options.nonResizable = false;
        options.hasControls = true;
        options.hasBorders = true;
        options.lockScalingX = false;

        var background = createObjectBackground(fabric.Rect, options);

        background.childrenOnTop = [];
        background.visibile = false;
        this.background = background;
        background.referencedObject = options.referencedObject;
        background.noScaleCache = false;
        this.value = options.value || '';
        background.setVisible = function (visibility) {
            console.log("Entered visible");
            console.log("Visibility is: " + visibility);
            if (background.visible != visibility) {
                background.visible = visibility;
                if (!background.visible) {
                    background.childrenOnTop.forEach(function (child) {
                        console.log("Child is: ");
                        console.log(child);
                        child.compress && child.compress();

                        let grandChildren = child.childrenOnTop || child.children;
                        grandChildren && grandChildren.forEach(function (contents) {
                            contents.compress && contents.compress();
                        });
                    });
                } else {
                    background.childrenOnTop.forEach(function (child) {
                        child.expand && child.expand();

                        let grandChildren = child.childrenOnTop || child.children;
                        grandChildren && grandChildren.forEach(function (contents) {
                            contents.expand();
                        });
                    });
                }
            }
        }

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);

            if (!background.isCompressed) {
                ctx.font = '20px Helvetica';
                ctx.fillStyle = 'rgba(65, 65, 65, ' + this.opacity + ')';
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                var center = this.getPointByOrigin('center', 'center');
                if (background.visible) {
                    ctx.font = '10px Helvetica';
                    ctx.fillStyle = '#666';
                    ctx.fillText(this.index, center.x, center.y - 26);
                }
            }
        };

        background.onChangeCompressing = function (currentValue) {
        }

        background.afterCompressing = function () {
        }

        background.onChangeExpanding = function (currentValue) {
        }

        background.afterExpanding = function (currentValue) {
        }

        var addReferencedObject = function () {
//            var progvolverString = new ProgvolverSymbol({
//                dataType: "double",
//                y: 500,
//                x: 500,
//                fill: '#B3CDE3',
//                type: "string",
//                value: "This is a referenced string"
//            });

            var objectWidget = new ObjectWidget({
                fill: '#B3CDE3',
                stroke: '#F02466',
                y: 250,
                name: "var",
                x: 250,
                objectMembers: background.objectMembers});

            background.referencedObject = objectWidget;

            var referenceWidget = new ReferenceWidget({
                fill: '#B3CDE3',
                stroke: '#B3CDE3',
                y: 250,
                name: "name",
                type: "type",
                opacity: 0,
                width: 20,
                height: 35,
                isArrayElement: true,
                x: 250}, background.referencedObject);

            var originParent = {originX: 'center', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};
            background.addChild(referenceWidget, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            canvas.add(referenceWidget);
            background.referenceWidget = referenceWidget;
            background.children.push(background.referenceWidget);
        }

        function addReferencePointer() {
            var referencePointer = new ReferencePointer({radius: 6, fill: 'black'});

            var originParent;
            var originChild;

            var xPosition, yPosition;
            var scaleX = 0, scaleY = 0, opacity = 0;

            xPosition = 0;
            yPosition = 0;
            originParent = {originX: 'center', originY: 'center'};
            originChild = {originX: 'center', originY: 'center'};

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
            background.childrenOnTop.push(background.referencePointer);
        }

        var points;
        function addArrowLine() {
            var sc = getScreenCoordinates(background.referencePointer.getPointByOrigin('center', 'center'));

            var originParent, originChild;
            var xPosition, yPosition;

            points = [sc.x, sc.y, sc.x, sc.y + 40];
            xPosition = 0;
            yPosition = 0;
            originParent = {originX: 'center', originY: 'center'};
            originChild = {originX: 'center', originY: 'top'};

            var line = new fabric.Line(points, {
                strokeWidth: 2,
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
                    lineEndCoords = background.minimizeButton.getPointByOrigin('center', 'center');
                } else {
                    lineEndCoords = background.getPointByOrigin('center', 'center');
                    lineEndCoords.x += 4;
                }
                lineStartCoords = background.referencePointer.getPointByOrigin('center', 'center');

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
            background.arrowLine = line;
            background.childrenOnTop.push(line);
        }

        function addMinimizeButton() {
            var sc = getScreenCoordinates(background.getPointByOrigin('left', 'center'));
            var minimizeButton = new MinimizeButton({
                sign: "+",
                radius: 12,
                parent: background,
                hasControls: false,
                hasBorders: false
            });

            var xPosition, yPosition;
            var originParent, originChild;

            xPosition = 0;
            yPosition = 0;
            originParent = {originX: 'center', originY: 'center'};
            originChild = {originX: 'center', originY: 'center'};

            background.addChild(minimizeButton, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            minimizeButton.state = "minimize";

            if (background.referencedObject) {
                minimizeButton.registerListener('mouseup', function () {
                    let screenCoords = background.minimizeButton.getPointByOrigin('center', 'bottom');
                    let xPosition = screenCoords.x;
                    let yPosition = screenCoords.y + (background.height) + 45;
                    // display class that it is reference of, and hide the button
                    if (minimizeButton.state == "minimize") {
                        background.referencedObject.x = xPosition;
                        background.referencedObject.left = xPosition;

                        let minimizeButtonYPosition = background.expandedOptions[minimizeButton.id].y;
                        if (minimizeButtonYPosition == 0) {
                            background.expandedOptions[minimizeButton.id].y = 100;
                            background.positionObject(minimizeButton);
                            yPosition += 100;
                        }

                        background.referencedObject.y = yPosition;
                        background.referencedObject.top = yPosition;

                        if (background.referencedObject.addAll)
                            background.referencedObject.addAll();
                        else
                            canvas.add(background.referencedObject);

                        minimizeButton.state = "maximize"
                        minimizeButton.sign = "–";
                    } else {

                        if (background.referencedObject.removeAll)
                            background.referencedObject.removeAll();
                        else
                            canvas.remove(background.referencedObject);

                        minimizeButton.state = "minimize"
                        minimizeButton.sign = "+";

                        background.referencedObject.x = xPosition;
                        background.referencedObject.left = xPosition;

                        background.referencedObject.y = yPosition;
                        background.referencedObject.top = yPosition;
                    }
                });
            }
            canvas.add(minimizeButton);
            background.minimizeButton = minimizeButton;
            background.childrenOnTop.push(background.minimizeButton);
        }

        background.addReferencedObject = function () {
            let originParent = {originX: 'center', originY: 'top'};
            let originChild = {originX: 'center', originY: 'top'};

//            background.addChild(background.referencedObject, {
//                whenCompressed: {
//                    x: 0, y: 0,
//                    originParent: originParent,
//                    originChild: originChild
//                },
//                whenExpanded: {
//                    x: 0, y: 0,
//                    scaleX: 1, scaleY: 1, opacity: 1,
//                    originParent: originParent,
//                    originChild: originChild
//                },
//                movable: true
//            });


            canvas.add(background.referencedObject);

            background.referencedObject.registerListener('moving', function () {
                if (!background.referencedObject.isCompressed) {
                    var position = (background.referencedObject.getPointByOrigin('center', 'top'));

                    let yPosition = parseFloat(position.y) - 15
                    let xPosition = parseFloat(position.x);
                    background.minimizeButton.x = xPosition;
                    background.minimizeButton.y = yPosition;
                    background.minimizeButton.left = xPosition;
                    background.minimizeButton.top = yPosition;
                    background.minimizeButton.setCoords();
                }
            });
            
            let sc = background.getPointByOrigin('center', 'center');
            background.referencedObject.top = sc.y;
            background.referencedObject.left = sc.x;
            background.positionObjects();
        }

        addReferencePointer();
        addArrowLine();
        addMinimizeButton();

        background.addReferencedObject();
        background.registerListener('added', function () {
            background.bringToFront();
            bringToFront(background);
            background.childrenOnTop.forEach(function (child) {

                let grandChildren = child.children || child.childrenOnTop;

                if (grandChildren) {
                    grandChildren.forEach(function (contents) {
                        contents.bringToFront();
                        bringToFront(contents);
                    });
                }
                child.bringToFront();
                bringToFront(child)
            });
        })

        this.progvolverType = "CodeNote";
        return this.background;
    }
}
