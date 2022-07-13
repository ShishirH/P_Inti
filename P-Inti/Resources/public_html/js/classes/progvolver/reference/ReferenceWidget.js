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
        background.children = [];
        background.isArrayElement = options.isArrayElement || false;
        background.isArray = options.isArray || false;

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
            var referencePointer = new ReferencePointer({background: background, drawPointer: true, radius: 6, fill: 'black'});

            var originParent;
            var originChild;

            var xPosition, yPosition;
            var scaleX = 0, scaleY = 0, opacity = 0;

            if (options.isMember) {
                xPosition = 250;
                yPosition = 0;
                originParent = {originX: 'center', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            } else if (options.isArrayMember) {
                xPosition = 0;
                yPosition = 0;
                originParent = {originX: 'center', originY: 'center'};
                originChild = {originX: 'center', originY: 'center'};
                scaleX = 1;
                scaleY = 1;
                opacity = 1;
            }

            xPosition = 3;
            yPosition = 1.5;
            originParent = {originX: 'left', originY: 'center'};
            originChild = {originX: 'left', originY: 'center'};

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
                xPosition = 12;
                yPosition = 0;
                originParent = {originX: 'center', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            } else {
                xPosition = 12;
                yPosition = 0;
                originParent = {originX: 'right', originY: 'center'};
                originChild = {originX: 'left', originY: 'center'};
            }

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

            var sc = background.getPointByOrigin('right', 'center');
            minimizeButton.x = sc.x + 12;
            minimizeButton.y = sc.y;
            minimizeButton.left = sc.x + 12;
            minimizeButton.top = sc.y;

            minimizeButton.state = "minimize";

            if (background.object) {
                minimizeButton.registerListener('mouseup', function () {
                    let screenCoords = background.minimizeButton.getPointByOrigin('right', 'center');
                    let xPosition = screenCoords.x + (background.object.expandedWidth / 2) + 5;
                    let yPosition = screenCoords.y;

                    background.object.x = xPosition;
                    background.object.left = xPosition;

                    background.object.y = yPosition;
                    background.object.top = yPosition;

                    // display class that it is reference of, and hide the button
                    if (minimizeButton.state == "minimize") {
                        if (background.object.addAll)
                            background.object.addAll();
                        else
                            canvas.add(background.object);

                        minimizeButton.state = "maximize"
                        minimizeButton.sign = "–";
                    } else {
                        if (background.object.removeAll)
                            background.object.removeAll();
                        else
                            canvas.remove(background.object);

                        minimizeButton.state = "minimize"
                        minimizeButton.sign = "+";

                    }
                });
            }
            canvas.add(minimizeButton);
            background.minimizeButton = minimizeButton;
            background.children.push(background.minimizeButton);
            background.childrenOnTop.push(background.minimizeButton);
        }

        function addReferencedObject() {
            console.log("Adding reference object");
            console.log(background.object);

            if (background.object === undefined) {
                background.minimizeButton.sign = "?";
                return;
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


        background.setValue = function (newValue) {
            console.log("New value is: ");
            console.log(newValue);
            // [3;40;60;100000000;0;0;0;0;0]

            background.object.setValue(newValue);
        }

        background.setProgramTime = function (currentTime) {
            background.object.setProgramTime(currentTime);
        }

        background.setHistory = function () {
            background.object.history = window.logData.filter(item => item.widgetsID.indexOf(background.object.id) != -1);
        }

        this.progvolverType = "ReferenceWidget";
        registerProgvolverObject(background);

        console.log("Adding to persistent entry")
        PERSISTENT_CANVAS_ENTRIES.push(background);

        return background;
    }

    static fromJson (json) {
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

        let obj =  new ReferenceWidget({
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