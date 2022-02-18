class ArraySymbol {
    constructor(options) {
        var symbolFont = '20px Helvetica';

        options.height = options.height || 1;
        options.width = options.width || 1;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.label = options.label || options.fileName && options.lineNumber ? options.fileName + ' (' + options.lineNumber + ')' : options.fileName || '';
        options.fill = options.fill || "#DFE3B3";
        options.stroke = options.stroke || darken("#DFE3B3");
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;
        options.connectionPortLocations = ['right'];

        options.nonResizable = false;
        options.hasControls = true;
        options.hasBorders = false;
        options.noScaleCache = false;
        options.value = "";
        options.doNotCompressWhenCanvasClicked = true;

//        options.compressedProperties = {
//            width: 10,
//            height: 10
//        }
        var background = createObjectBackground(fabric.Rect, options, null);

        console.log("Background is: " + background);
        console.log(background)
        background.expandedWidth = 0;
        background.expandedHeight = 0;
        background.compressed = true;
        background.isMember = options.isMember;
//        background.compressedProperties = {
//            width: 10,
//            height: 10,
//        };

        background.onChangeCompressing = function (currentValue) {
            if (!background.expandedWidth) {
                background.expandedWidth = background.width;
                background.expandedHeight = background.height;
            }

            background.set('width', (background.expandedWidth * currentValue) + 50);
            background.set('height', (background.expandedHeight * currentValue) + 50);
            background.compressed = true;
        }

        background.afterCompressing = function () {
            background.set('width', 0);
            background.set('height', 0);
        }

        background.onChangeExpanding = function (currentValue) {
            if (!background.expandedWidth) {
                background.expandedWidth = background.width;
                background.expandedHeight = background.height;
            }

            background.set('width', (background.expandedWidth * currentValue) + 50);
            background.set('height', (background.expandedHeight * currentValue) + 70);
            background.compressed = false;
        }

        background.afterExpanding = function () {
            background.set('width', (background.expandedWidth));
            background.set('height', (background.expandedHeight) + 70);
            background.positionObjects();
        }


        background.noScaleCache = false;
        background.isArray = true;

        background.areElementsOnLeft = false;
        background.areElementsOnRight = false;
        background.customScalingFunction = function () {
            let i;
            let j;

            LOG && console.log("New width is: " + background.cacheWidth)
            background.set('width', background.cacheWidth);
            background.set('height', background.cacheHeight);
            for (i = 0; i < rows; i++) {
                for (j = 0; j < columns; j++) {
                    LOG && console.log("Position for row: " + i + " and column " + j + " is " + parseFloat(background.expandedOptions[arrayElementsArray[i][j].id].x) + parseFloat(arrayElementsArray[i][j].width));
                    if ((parseFloat(background.expandedOptions[arrayElementsArray[i][j].id].x) + parseFloat(arrayElementsArray[i][j].width) + 45) < background.width) {
                        if ((parseFloat(background.expandedOptions[arrayElementsArray[i][j].id].y) + parseFloat(arrayElementsArray[i][j].height) + 45) < background.height) {
                            background.expandedOptions[arrayElementsArray[i][j].id].opacity = 1;
                            background.compressedOptions[arrayElementsArray[i][j].id].opacity = 1;
                            arrayElementsArray[i][j].setVisible(true);
                            background.positionObject(arrayElementsArray[i][j]);
                        } else {
                            background.expandedOptions[arrayElementsArray[i][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i][j].id].opacity = 0;

                            if (arrayElementsArray[i][j].visible) {
                                background.positionObject(arrayElementsArray[i][j]);
                            }
                            arrayElementsArray[i][j].setVisible(false);
                        }
                    } else {
                        background.expandedOptions[arrayElementsArray[i][j].id].opacity = 0;
                        background.compressedOptions[arrayElementsArray[i][j].id].opacity = 0;

                        if (arrayElementsArray[i][j].visible) {
                            background.positionObject(arrayElementsArray[i][j]);
                        }
                        arrayElementsArray[i][j].setVisible(false);
                    }
                }
            }

            background.leftBuffer && background.positionObject(background.leftBuffer);
            background.rightBuffer && background.positionObject(background.rightBuffer);
            background.topBuffer && background.positionObject(background.topBuffer);
            background.bottomBuffer && background.positionObject(background.bottomBuffer);
            background.labelObject && background.positionObject(background.labelObject);
            background.nameObject && background.positionObject(background.nameObject);
            background.scrollY && background.positionObject(background.scrollY);
            background.topArrow && background.positionObject(background.topArrow);
            background.bottomArrow && background.positionObject(background.bottomArrow);
            background.scrollX && background.positionObject(background.scrollX);
            background.leftArrow && background.positionObject(background.leftArrow);
            background.rightArrow && background.positionObject(background.rightArrow);
            background.rotationButton && background.positionObject(background.rotationButton);

            background.widget.thePorts.forEach(function (port) {
                background.positionObject(port);
            });

            background.setCoords();
        };

        background.children = [];

        background.elements = options.elements;
        background.name = options.name;
        background.dataType = options.type;
        background.orientation = 0;
        background.containingType = options.containingType;
        background.initialValue = options.initialValue;
        background.isClass = options.isClass;
        background.objectMembers = options.objectMembers;

        background.elements = options.elements;
        background.name = options.name;
        background.dataType = options.type;
        background.initialValue = options.initialValue;
        background.fileName = options.fileName;
        background.label = options.label;
        background.lineNumber = options.lineNumber;

        background.value = options.value || '';

        var defaultValues = {"int": 0, "double": 0.0, "String": ""};

        console.log("background is: ");
        console.log(background);
        var arrayElementsArray = [];
        background.arrayElementsArray = arrayElementsArray;
        background.isInitialized = false;

        background.onValuesUpdated = function (dataItem) {
            if (columns == 1)
                background.setValue(dataItem.array);
        };

        background.setProgramTime = function (time) {

            // 'this' here refers to the variable background
            background.time = time;
            background.currentTime = time;
            if (background.history) {
                background.values = background.history.filter(item => item.time <= time);
                if (background.values.length) {
                    background.onValuesUpdated && background.onValuesUpdated(background.values[background.values.length - 1]);
                }
            }
        };

        background.registerListener('added', function (options) {
            if (!background.isInitialized) {
                background.setCoords();
                //background.addBuffers();
                background.addInitialArrayElements(background.initialValue);
                background.addLabelObject();
                background.addRotationButton();
                background.addScrollX();

                background.addScrollY();
                background.addColorWidget();

                background.positionObjects();
                background.isInitialized = true;
            }
        });

        var rows;
        var columns;
        let objectMembersIndex = 0;
        background.addInitialArrayElements = function (initialValue) {
            let maxWidth = 200;
            let arrayDimensions = getArrayDimensions(initialValue);

            rows = arrayDimensions[0];
            columns = arrayDimensions[1];

            background.rows = rows;
            background.columns = columns;

            let splitStr = initialValue.split(" ");
            let dataType = splitStr[1].substring(0, splitStr[1].indexOf('['));

            let dataItem = [];

            let xPosition = 0;
            let yPosition = 0;

            let i = 0;
            let j = 0;
            let element;

            for (i = 0; i < rows; i++) {
                for (j = 0; j < columns; j++) {
                    element = {};
                    element["row"] = i;
                    element["column"] = j;
                    element["value"] = defaultValues[dataType];

                    if (j == 0) {//= Create new row
                        dataItem.push([]);
                    }
                    dataItem[i].push(element);

                    if (columns == 1) { //1D array
                        if (i == 0)
                            xPosition = 45;
                        else
                            xPosition = xPosition + arrayElementsArray[i - 1][0].width;
                    } else {
                        if (j == 0)
                            xPosition = 45;
                        else
                            xPosition = xPosition + arrayElementsArray[i][j - 1].width;
                    }
                    LOG && console.log("Index: [" + i + ", " + j + "] element: " + dataItem[i][j].value);

                    let index;
                    if (columns == 1) //1D Array
                        index = i;
                    else
                        index = i + ',' + j;

                    var arrayElement;
                    let changeView = true;
                    // Check if array of primitives or array of references
                    if (background.isClass) {
                        let isArrayMember = true;
                        let returnObjectWidget = true;
                        let referencedObject = getReferenceWidgetForInnerClass(options, options.members, isArrayMember, returnObjectWidget);
                        arrayElement = new ArrayElementObject({
                            element: dataItem[i][j].value,
                            index: index,
                            fill: background.fill,
                            stroke: background.stroke,
                            width: 45,
                            height: 35,
                            array: background,
                            visible: true,
                            dataType: dataType,
                            isClass: background.isClass,
                            referencedObject: referencedObject
                        });
                    } else {
                        arrayElement = new ArrayElementSymbol({
                            element: dataItem[i][j].value,
                            index: index,
                            fill: background.fill,
                            stroke: background.stroke,
                            width: 45,
                            array: background,
                            visible: true,
                            dataType: dataType,
                            isClass: background.isClass,
                            numberOfColumns: columns,
                            row: i,
                            column: j,
                            changeView: changeView
                        });
                    }

                    var originParent;
                    var originChild;

                    if (background.orientation == 0) {
                        //horizontal
                        if (columns > 1) {
                            originParent = {originX: 'left', originY: 'top'};
                            originChild = {originX: 'left', originY: 'top'};
                        } else {
                            originParent = {originX: 'left', originY: 'center'};
                            originChild = {originX: 'left', originY: 'center'};
                        }
                    } else {
                        // vertical
                        originParent = {originX: 'center', originY: 'top'};
                        originChild = {originX: 'center', originY: 'top'};
                    }

                    LOG && console.log(" xpos: " + xPosition + " ypos: " + yPosition + " index: " + i + ", " + j);

                    let opacity;
                    let elementWidth = 45;
                    let maxWidth = 270;

                    LOG && console.log(" xpos: " + xPosition + " ypos: " + yPosition + " index: " + i + ", " + j);

                    let elementRightX = xPosition + elementWidth;
                    let allowedSize = maxWidth - 45;
                    LOG && console.log("ElementRightX: " + elementRightX + " & allowedSize: " + allowedSize);

                    if (elementRightX > allowedSize) {
                        opacity = 0;
                        background.areElementsOnRight = true;
                        arrayElement.setVisible(false);
                    } else {
                        opacity = 1;
                        arrayElement.setVisible(true);
                    }

                    if (columns > 1) {
                        if (background.isClass) {
                            yPosition = (i * 100) + 50;
                        } else {
                            if (!changeView) {
                                yPosition = (i * 50) + 30;
                            } else {
                                yPosition = (i * 40) + 30;
                            }
                        }
                    } else {
                        yPosition = 0;
                    }

                    let elementHeight = 50
                    let maxHeight = 130;
                    if (yPosition + elementHeight > maxHeight - 60) {
                        opacity = 0;
                        arrayElement.setVisible(false);
                    }


                    background.addChild(arrayElement, {
                        whenCompressed: {
                            x: xPosition, y: yPosition,
                            scaleX: 0, scaleY: 0, opacity: opacity,
                            originParent: originParent,
                            originChild: originChild
                        },
                        whenExpanded: {
                            x: xPosition, y: yPosition,
                            scaleX: 1, scaleY: 1, opacity: opacity,
                            originParent: originParent,
                            originChild: originChild
                        },
                        movable: false
                    });

                    if (j == 0) { // create new row
                        arrayElementsArray.push([]);
                    }
                    arrayElementsArray[i].push(arrayElement);

                    if (background.orientation == 0) {
                        let backgroundWidth = xPosition + arrayElement.width + 50;
                        if ((background.width < backgroundWidth) && (backgroundWidth < maxWidth)) {
                            //background.set('width', backgroundWidth);// = backgroundWidth;
                            background.expandedWidth = backgroundWidth;
                        } else {
                            //background.set('width', maxWidth);
                            background.expandedWidth = maxWidth;
                        }

                        if (background.height < yPosition && yPosition < maxHeight) {
                            LOG && console.log("Setting new height");
                            if (!background.isClass) {
                                if (!changeView) {
                                    background.expandedHeight = yPosition + 70;
                                } else {
                                    background.expandedHeight = yPosition + 10;
                                }
                            } else {
                                background.expandedHeight = yPosition + 70;
                            }
                        }
                    } else {
                        let backgroundHeight = yPosition + arrayElement.height + 50;
                        if (background.height < backgroundHeight) {
                            background.expandedHeight = backgroundHeight;
                        }
                    }

                    canvas.add(arrayElement);
                    background.children.push(arrayElement);
                    arrayElement.lockMovementX = true;
                    arrayElement.lockMovementY = true;
                    objectMembersIndex++;
                }
            }
            background.positionObjects();
        }

        background.addLabelObject = function () {
            var labelObject = new fabric.Text(background.label, {
                fontFamily: 'Arial',
                fill: '#0366d6',
                fontSize: 14,
                hasControls: false,
                hasBorders: false,
                textAlign: 'center',
                fontWeight: '100',
                hoverCursor: "pointer"
            });
            var originParent = {originX: 'center', originY: 'bottom'};
            var originChild = {originX: 'center', originY: 'top'};

            let scaleX, scaleY, opacity;
            if (background.isMember) {
                scaleX = 0;
                scaleY = 0;
                opacity = 0;
            } else {
                scaleX = 1;
                scaleY = 1;
                opacity = 1;
            }

            background.addChild(labelObject, {
                whenCompressed: {
                    x: 0, y: 2,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 2,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.labelObject = labelObject;
            background.children.push(background.labelObject);

            background.labelObject.on({
                mouseup: function (options) {

                    deselectAllObjects();
                    background.fire('selected');

                    if (!iVoLVER.util.isUndefined(background.lineNumber)) {
                        if (window.jsHandler) {
                            if (window.jsHandler.goTo) {
                                var lineNumber = background.lineNumber - 1;
                                var args = {
                                    id: background.id,
                                    mainColor: background.fill,
                                    startLine: lineNumber,
                                    endLine: lineNumber,
                                    file: background.file,
                                    lineNumber: lineNumber,
                                    animate: true,
                                    newDispatcher: true
                                };
                                console.log(args);
                                window.jsHandler.goTo(args);
                            }
                        }
                    }
                },
            });
        }

        background.setHistory = function () {
            background.history = window.logData.filter(item => item.widgetsID == background.id);
        }

        background.setFile = function (file) {
            background.file = file;
            background.fileName = file.split('\\').pop().split('/').pop();
        }

        background.setLineNumber = function (lineNumber) {
            background.lineNumber = lineNumber;
        }

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.font = symbolFont;
            ctx.fillStyle = 'rgba(65, 65, 65, ' + background.opacity + ')';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            var renderableValue = background.value;
            if (!iVoLVER.util.isUndefined(background.value) && iVoLVER.util.isNumber(background.value)) {
                renderableValue = background.value.toFixed(2);
            }

            if (!background.isCompressed) {

                if (background.areElementsOnLeft) {
                    let positionLeft = background.getPointByOrigin('left', 'center');
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(positionLeft.x + 15, positionLeft.y, 2, 0, 2 * Math.PI);
                    ctx.arc(positionLeft.x + 20, positionLeft.y, 2, 0, 2 * Math.PI);
                    ctx.arc(positionLeft.x + 25, positionLeft.y, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = background.stroke;
                    ctx.fill();
                    ctx.restore();
                }

                if (background.areElementsOnRight) {
                    let positionRight = background.getPointByOrigin('right', 'center');
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(positionRight.x - 15, positionRight.y, 2, 0, 2 * Math.PI);
                    ctx.arc(positionRight.x - 20, positionRight.y, 2, 0, 2 * Math.PI);
                    ctx.arc(positionRight.x - 25, positionRight.y, 2, 0, 2 * Math.PI);
                    ctx.fillStyle = background.stroke;
                    ctx.fill();
                    ctx.restore();
                }

                let positionBottom = background.getPointByOrigin('left', 'bottom');
                ctx.save();
                ctx.beginPath();
                ctx.rect(positionBottom.x + background.strokeWidth + 2, positionBottom.y - background.strokeWidth - 2 - 9, background.width - (2 * background.strokeWidth) - 2, 9);
                ctx.fillStyle = lighten(background.fill, 10);
                ctx.fill();
                ctx.restore();

                if (columns > 1) {
                    let positionRight = background.getPointByOrigin('right', 'top');
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(positionRight.x - background.strokeWidth - 9, positionRight.y + background.strokeWidth + 2, 8, background.height - (2 * background.strokeWidth) - 8);
                    ctx.fillStyle = lighten(background.fill, 10);
                    ctx.fill();
                    ctx.restore();
                }
            }

            ctx.fillText(renderableValue, center.x, center.y + 3);
        };

        background.addRotationButton = function () {
            var svgString = "M20.49,13.98h-1.25v-7.1V1.87H7.42V0.51C7.42,0.5,7.41,0.5,7.4,0.5L0.51,4.25c-0.01,0.01-0.01,0.02,0,0.02 L7.4,8.03c0.01,0.01,0.02,0,0.02-0.01V6.88h6.5v7.1h-1.4c-0.01,0-0.02,0.01-0.01,0.02l3.98,6.5c0.01,0.01,0.02,0.01,0.02,0L20.5,14 C20.5,13.99,20.5,13.98,20.49,13.98z"
            var rotationButton = new fabric.Path(svgString, {
                top: 20,
                left: 20,
                width: 20,
                height: 20,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false

            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'center', originY: 'center'};

            background.addChild(rotationButton, {
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

            rotationButton.on('mouseup', function () {
                if (!background.orientation || background.orientation == 0) {
                    background.orientation = 1;
                } else {
                    background.orientation = 0;
                }

                background.previousHeight = background.height;
                background.previousWidth = background.width;

                var originParent;
                var originChild;

                if (background.orientation == 0) {
                    originParent = {originX: 'left', originY: 'center'};
                    originChild = {originX: 'left', originY: 'center'};
                } else {
                    originParent = {originX: 'center', originY: 'top'};
                    originChild = {originX: 'center', originY: 'top'};
                }

                let widthSum = 0;
                let heightSum = 0;

                let xPosition = 0;
                let yPosition = 0;
                for (let i = 0; i < rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        if (columns == 1) { //1D array
                            if (i == 0) {
                                xPosition = (1 - background.orientation) * 45;
                                yPosition = background.orientation * 25;
                            } else {
                                xPosition = (1 - background.orientation) * (xPosition + arrayElementsArray[i - 1][0].width);
                                yPosition = background.orientation * (yPosition + arrayElementsArray[i - 1][0].height);
                            }
                        } else {
                            if (j == 0) {
                                xPosition = (1 - background.orientation) * 45;
                                yPosition = background.orientation * 25;
                            } else {
                                xPosition = (1 - background.orientation) * (xPosition + arrayElementsArray[i][j - 1].width);
                                yPosition = background.orientation * (yPosition + arrayElementsArray[i][j - 1].height);
                            }
                        }

                        let arrayElement = arrayElementsArray[i][j];

                        if (background.orientation == 1 && i == 0) {
                            console.log("X and y position are: " + xPosition + " and " + yPosition);
                        }
                        widthSum = widthSum + arrayElement.width;
                        heightSum = heightSum + arrayElement.height;

                        console.log(arrayElementsArray[i]);

                        background.compressedOptions[arrayElement.id].originParent = originParent;
                        background.compressedOptions[arrayElement.id].originChild = originChild;

                        background.expandedOptions[arrayElement.id].originParent = originParent;
                        background.expandedOptions[arrayElement.id].originChild = originChild;

                        background.compressedOptions[arrayElement.id].x = xPosition;
                        background.compressedOptions[arrayElement.id].y = yPosition;

                        background.expandedOptions[arrayElement.id].x = xPosition;
                        background.expandedOptions[arrayElement.id].y = yPosition;
                        console.log("Xpos and ypos of current element are " + background.compressedOptions[arrayElement.id].x + " and " + background.compressedOptions[arrayElement.id].y);
                    }
                }

                if (background.orientation == 0) {
                    let width;
                    let maxWidth = 270;
                    if (maxWidth < widthSum) {
                        width = maxWidth;
                    } else {
                        width = widthSum
                    }

                    background.set('height', 70);
                    background.set('width', width);
                } else {
                    let height;
                    let maxHeight = 190;

                    if (maxHeight < heightSum) {
                        height = maxHeight;
                    } else {
                        height = heightSum
                    }

                    background.set('width', 70);
                    background.set('height', height);
                }

                background.expandedWidth = background.height;
                background.expandedHeight = background.width;
                background.positionObjects();

                console.log("Here")
                if (background.orientation == 1) {
                    canvas.remove(background.scrollX);
                    canvas.remove(background.leftArrow);
                    canvas.remove(background.rightArrow);

                    canvas.add(background.scrollY);
                    canvas.add(background.topArrow);
                    canvas.add(background.bottomArrow);
                } else {
                    canvas.add(background.scrollX);
                    canvas.add(background.leftArrow);
                    canvas.add(background.rightArrow);

                    canvas.remove(background.scrollY);
                    canvas.remove(background.topArrow);
                    canvas.remove(background.bottomArrow);
                }
            });


            canvas.add(rotationButton);
            background.rotationButton = rotationButton;
            background.children.push(background.rotationButton);


        }

        var hiddenTop = 0;
        var lastVisibleRow = 0;

        background.addScrollY = function () {
            var topArrow = new fabric.Triangle({
                height: 6,
                width: 6,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
                angle: 0
            });

            var bottomArrow = new fabric.Triangle({
                height: 6,
                width: 6,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
                angle: 90
            });

            var scrollY = new fabric.Rect({
                height: 40,
                width: 6,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
            });
            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'right', originY: 'top'};

            background.addChild(topArrow, {
                whenCompressed: {
                    x: -2 - background.strokeWidth, y: 2,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -2 - background.strokeWidth, y: 2,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            background.addChild(scrollY, {
                whenCompressed: {
                    x: -2 - background.strokeWidth, y: 12,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -2 - background.strokeWidth, y: 12,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: {
                    y: {
                        min: {
                            distance: 1, origin: 'top',
                            reference: {object: topArrow, origin: 'bottom'}
                        },
                        max: {
                            distance: -2, origin: 'bottom',
                            reference: {object: bottomArrow, origin: 'bottom'}
                        }
                    }
                }
            });

            var originParent = {originX: 'right', originY: 'bottom'};
            var originChild = {originX: 'right', originY: 'top'};

            background.addChild(bottomArrow, {
                whenCompressed: {
                    x: -background.strokeWidth * 4.5, y: -12,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    angle: 180,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -background.strokeWidth * 4.5, y: -12,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    angle: 180,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            scrollY.registerListener('moving', function () {
                // Divide the y axis into ticks for the array. -20 is for the left and the right arrows.
                console.log("ScrollY moving!");
                let ticks;

                if (columns > 1) {
                    ticks = (background.height - scrollY.height) / rows;
                } else {
                    ticks = (background.height - scrollY.height) / arrayElementsArray.length;
                }

                console.log("Number of ticks are: " + ticks);

                let currentY = background.expandedOptions[scrollY.id].y;
                console.log("CurrentY is: " + currentY);
                background.compressedOptions[scrollY.id].y = currentY;

                let hiddenNumber = (currentY / ticks);
                hiddenNumber = Math.floor(hiddenNumber);

                if (hiddenNumber == hiddenTop)
                    return;
                else
                    hiddenTop = hiddenNumber;

                console.log("Hidden number is: " + hiddenNumber);

                var areElementsOnTop = false;
                var areElementsOnBottom = false;
                var updatedFirstVisible = false;
                var updatedLastVisible = false;
                let indentation;
                for (let i = 1; i <= rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        var topHidden = false;
                        var bottomHidden = false;

                        console.log("First visible is now: " + background.firstVisibleRow);
                        indentation = (i - hiddenNumber - 1); // CHANGE FOR ORIENTATION

                        let newYPosition = parseFloat((indentation * 50) + 30);
                        let elementHeight = arrayElementsArray[i - 1][j].height;
                        console.log("YPosition: " + newYPosition + " and index: " + (i - 1) + ", " + (j));

                        if (hiddenNumber >= i || newYPosition < 30) {
                            newYPosition = 30;
                            topHidden = true;
                            areElementsOnTop = true;
                        }

                        if (newYPosition + elementHeight > (background.height - 30)) {
                            newYPosition = background.height - 30;
                            bottomHidden = true;
                            areElementsOnBottom = true;
                        }

                        background.expandedOptions[arrayElementsArray[i - 1][j].id].y = newYPosition;
                        background.compressedOptions[arrayElementsArray[i - 1][j].id].y = newYPosition;

                        if (topHidden) {
                            //arrayElementsArray[i - 1].opacity = 0;
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            topHidden = hiddenNumber;
                            console.log("Hidden top is now: " + topHidden);
                            // Move it to the top
                            console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide top");
                            arrayElementsArray[i - 1][j].setVisible(false);
                        } else if (bottomHidden) {
                            console.log("Hiding to the bottom");
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            arrayElementsArray[i - 1][j].setVisible(false);

                            console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide bottom");
                        } else { // Visible
                            if (!updatedFirstVisible) {
                                updatedFirstVisible = true;
                                background.firstVisibleRow = i;
                            }

                            let maxWidth = background.width - 80;
                            if (background.expandedOptions[arrayElementsArray[i - 1][j].id].x > maxWidth)
                                continue;
                            arrayElementsArray[i - 1][j].setVisible(true);

                            arrayElementsArray[i - 1][j].opacity = 1;
                            console.log("Array index: " + (i - 1) + ", " + (j) + " is visible");
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                            background.lastVisible = i;
                        }
                    }
                }
                background.positionObjects();

                console.log("Y is now: " + background.expandedOptions[scrollY.id].x);
            });

            topArrow.on('mouseup', function () {
                var areElementsOnTop = false;
                var areElementsOnBottom = false;
                var updatedFirstVisible = false;
                var updatedLastVisible = false;

                if (hiddenTop == 0)
                    return;

                var hiddenNumber = hiddenTop - 1;
                hiddenTop = hiddenNumber;

                let indentation;
                for (let i = 1; i <= rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        var topHidden = false;
                        var bottomHidden = false;

                        console.log("First visible is now: " + background.firstVisibleRow);
                        indentation = (i - hiddenNumber - 1); // CHANGE FOR ORIENTATION

                        let newYPosition = parseFloat((indentation * 50) + 30);
                        let elementHeight = arrayElementsArray[i - 1][j].height;
                        console.log("YPosition: " + newYPosition + " and index: " + (i - 1) + ", " + (j));

                        if (hiddenNumber >= i || newYPosition < 30) {
                            newYPosition = 30;
                            topHidden = true;
                            areElementsOnTop = true;
                        }

                        if (newYPosition + elementHeight > (background.height - 30)) {
                            newYPosition = background.height - 30;
                            bottomHidden = true;
                            areElementsOnBottom = true;
                        }

                        background.expandedOptions[arrayElementsArray[i - 1][j].id].y = newYPosition;
                        background.compressedOptions[arrayElementsArray[i - 1][j].id].y = newYPosition;

                        if (topHidden) {
                            //arrayElementsArray[i - 1].opacity = 0;
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            topHidden = hiddenNumber;
                            console.log("Hidden top is now: " + topHidden);
                            // Move it to the top
                            console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide top");
                            arrayElementsArray[i - 1][j].setVisible(false);
                        } else if (bottomHidden) {
                            console.log("Hiding to the bottom");
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            arrayElementsArray[i - 1][j].setVisible(false);

                            console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide bottom");
                        } else { // Visible
                            if (!updatedFirstVisible) {
                                updatedFirstVisible = true;
                                background.firstVisibleRow = i;
                            }

                            let maxWidth = background.width - 80;
                            if (background.expandedOptions[arrayElementsArray[i - 1][j].id].x > maxWidth)
                                continue;
                            arrayElementsArray[i - 1][j].setVisible(true);

                            arrayElementsArray[i - 1][j].opacity = 1;
                            console.log("Array index: " + (i - 1) + ", " + (j) + " is visible");
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                            background.lastVisible = i;
                        }
                    }
                }
                background.positionObjects();
//                if (areElementsOnTop) {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 1;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 0;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 0;
//
//                }

                if (areElementsOnBottom) {
                    background.expandedOptions[background.rightBuffer.id].opacity = 1;
                    background.compressedOptions[background.rightBuffer.id].opacity = 1;
                } else {
                    background.expandedOptions[background.rightBuffer.id].opacity = 0;
                    background.compressedOptions[background.rightBuffer.id].opacity = 0;
                }
                console.log("Y is now: " + background.expandedOptions[scrollY.id].x);
            });

            bottomArrow.on('mouseup', function () {
                var areElementsOnTop = false;
                var areElementsOnBottom = false;
                var updatedFirstVisible = false;
                var updatedLastVisible = false;

                if (hiddenTop >= rows)
                    return;

                var hiddenNumber = hiddenTop + 1;
                hiddenTop = hiddenNumber;

                let indentation;
                for (let i = 1; i <= rows; i++) {
                    for (let j = 0; j < columns; j++) {
                        var topHidden = false;
                        var bottomHidden = false;

                        console.log("First visible is now: " + background.firstVisibleRow);
                        indentation = (i - hiddenNumber - 1); // CHANGE FOR ORIENTATION

                        let newYPosition = parseFloat((indentation * 50) + 30);
                        let elementHeight = arrayElementsArray[i - 1][j].height;
                        console.log("YPosition: " + newYPosition + " and index: " + (i - 1) + ", " + (j));

                        if (hiddenNumber >= i || newYPosition < 30) {
                            newYPosition = 30;
                            topHidden = true;
                            areElementsOnTop = true;
                        }

                        if (newYPosition + elementHeight > (background.height - 30)) {
                            newYPosition = background.height - 30;
                            bottomHidden = true;
                            areElementsOnBottom = true;
                        }

                        background.expandedOptions[arrayElementsArray[i - 1][j].id].y = newYPosition;
                        background.compressedOptions[arrayElementsArray[i - 1][j].id].y = newYPosition;

                        if (topHidden) {
                            //arrayElementsArray[i - 1].opacity = 0;
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            topHidden = hiddenNumber;
                            console.log("Hidden top is now: " + topHidden);
                            // Move it to the top
                            console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide top");
                            arrayElementsArray[i - 1][j].setVisible(false);
                        } else if (bottomHidden) {
                            console.log("Hiding to the bottom");
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 0;
                            arrayElementsArray[i - 1][j].setVisible(false);

                            console.log("Array index: " + (i - 1) + ", " + (j) + " going to hide bottom");
                        } else { // Visible
                            if (!updatedFirstVisible) {
                                updatedFirstVisible = true;
                                background.firstVisibleRow = i;
                            }

                            let maxWidth = background.width - 80;
                            if (background.expandedOptions[arrayElementsArray[i - 1][j].id].x > maxWidth)
                                continue;
                            arrayElementsArray[i - 1][j].setVisible(true);

                            arrayElementsArray[i - 1][j].opacity = 1;
                            console.log("Array index: " + (i - 1) + ", " + (j) + " is visible");
                            background.expandedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                            background.compressedOptions[arrayElementsArray[i - 1][j].id].opacity = 1;
                            lastVisibleRow = i;
                        }
                    }
                }
                background.positionObjects();
//                if (areElementsOnTop) {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 1;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 1;
//                } else {
//                    background.expandedOptions[background.leftBuffer.id].opacity = 0;
//                    background.compressedOptions[background.leftBuffer.id].opacity = 0;
//
//                }

                if (areElementsOnBottom) {
                    background.expandedOptions[background.rightBuffer.id].opacity = 1;
                    background.compressedOptions[background.rightBuffer.id].opacity = 1;
                } else {
                    background.expandedOptions[background.rightBuffer.id].opacity = 0;
                    background.compressedOptions[background.rightBuffer.id].opacity = 0;
                }
                console.log("Y is now: " + background.expandedOptions[scrollY.id].y);
            });

            if (columns > 1) {
                canvas.add(scrollY);
                canvas.add(topArrow);
                canvas.add(bottomArrow);
            }

            background.scrollY = scrollY;
            background.topArrow = topArrow;
            background.bottomArrow = bottomArrow;

            background.children.push(background.scrollY);
            background.children.push(background.topArrow);
            background.children.push(background.bottomArrow);

            scrollY.processConnectionRequest = function (connection) {
                return {
                    connectionAccepted: true,
                    message: 'The object refused to accept the connection!',
                    processedValue: null
                };
            }

            scrollY.acceptConnection = function (connection, processedValue) {
                console.log("Connection accepted!")
            }
        }

        background.topHidden = 0;
        background.lastVisible = 0;
        background.firstVisibleRow = 1;
        background.hiddenX = 0;

        background.addScrollX = function () {
            let leftArrow = new fabric.Triangle({
                height: 6,
                width: 6,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
                angle: 270
            });

            let rightArrow = new fabric.Triangle({
                height: 6,
                width: 6,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
                angle: 90
            });

            let scrollX = new fabric.Rect({
                height: 6,
                width: 40,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false
            });

            let originParent = {originX: 'left', originY: 'bottom'};
            let originChild = {originX: 'left', originY: 'bottom'};

            background.addChild(leftArrow, {
                whenCompressed: {
                    x: leftArrow.width + 4, y: -2 - background.strokeWidth,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    angle: 270,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: leftArrow.width + 4, y: -2 - background.strokeWidth,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    angle: 270,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            background.addChild(scrollX, {
                whenCompressed: {
                    x: 12, y: -3 - background.strokeWidth,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 12, y: -3 - background.strokeWidth,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: {
                    x: {
                        min: {
                            distance: 5, origin: 'left',
                            reference: {object: leftArrow, origin: 'right'}
                        },
                        max: {
                            distance: -5, origin: 'right',
                            reference: {object: rightArrow, origin: 'left'}
                        }
                    }
                }
            });

            originParent = {originX: 'right', originY: 'bottom'};
            originChild = {originX: 'left', originY: 'bottom'};

            background.addChild(rightArrow, {
                whenCompressed: {
                    x: -10, y: -3 - rightArrow.height - background.strokeWidth,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    angle: 90,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -10, y: -3 - rightArrow.height - background.strokeWidth,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    angle: 90,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            scrollX.registerListener('moving', function () {
                moveScrollX(background);
            });

            leftArrow.on('mouseup', function () {
                leftArrowScroll(background);
            });

            rightArrow.on('mouseup', function () {
                rightArrowScroll(background);
            });

            canvas.add(scrollX);
            canvas.add(leftArrow);
            canvas.add(rightArrow);

            background.scrollX = scrollX;
            background.leftArrow = leftArrow;
            background.rightArrow = rightArrow;
            background.children.push(background.scrollX);
            background.children.push(background.leftArrow);
            background.children.push(background.rightArrow);
            console.log("Background is: ");
            console.log(background);
        }

        background.addColorWidget = function () {
            var arrayColorWidget = new ArrayColorWidget({
                array: background,
            });

            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'bottom'};


            background.addChild(arrayColorWidget, {
                whenCompressed: {
                    x: 0, y: -3,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: -3,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            background.arrayColorWidget = arrayColorWidget;
            background.children.push(background.arrayColorWidget);
            canvas.add(arrayColorWidget);
        }

        background.addAll = function () {
            background.expand();

            background.children.forEach(function (child) {
                child.expand && child.expand();
            });
            background.arrayColorWidget.colorWidgetAddition.bringToFront();
        }

        // Use compressed and expanded options. compress() and expand()
        background.removeAll = function () {
            background.compress();

            background.children.forEach(function (child) {
                child.compress && child.compress();
            });
        }

        background.progvolverType = "Array widget";
        registerProgvolverObject(this);

        background.clone = function () {
            var arrayWidget = new ArraySymbol({
                value: '',
                type: background.dataType,
                name: background.name,
                file: background.fileName,
                fileName: background.fileName,
                lineNumber: background.lineNumber,
                initialValue: background.initialValue,
                isCompressed: true,
                isMember: true,
                movable: true
            });

            return arrayWidget;
        }

        background.setValue = function (newValue) {
            // [3;40;60;100000000;0;0;0;0;0]

            var valuesArray = newValue.substring(1, newValue.length - 1).split(';');
            for (let i = 0; i < valuesArray.length; i++) {
                let currentValue = arrayElementsArray[i][0].element;

                if (currentValue != valuesArray[i]) {
                    arrayElementsArray[i][0].timeOfChange = background.currentTime;
                }

                arrayElementsArray[i][0].element = valuesArray[i];
                background.updateColorDecay(arrayElementsArray[i][0]);
            }
        }

        background.updateColorDecay = function (arrayElement) {
            let colorDecay = getColorDecayAtTime(background.currentTime, arrayElement.timeOfChange, '#414141');

            if (colorDecay[0] == "#ffNaNNaN") {
                colorDecay = [background.fill, 1];
            }

            let colorValue = colorDecay[0];
            arrayElement.set('fontColor', colorValue);
        };


        background.colorWidgetOutput = [];
        background.addColorWidgetOutput = function (index) {
            let colorIndex = (index % colorsArray.length);

            var colorWidgetOutput = new ArrayColorWidgetOutput({
                parent: background,
                array: background.array,
                fill: colorsArray[colorIndex],
                stroke: darken((colorsArray[colorIndex]))
            });

            let parentOrigin = {originX: 'left', originY: 'bottom'};
            let childOrigin = {originX: 'left', originY: 'top'};

            let x = (index * 14) + 3;

            background.addChild(colorWidgetOutput, {
                whenCompressed: {
                    x: x, y: 2,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: parentOrigin,
                    originChild: childOrigin
                },
                whenExpanded: {
                    x: x, y: 2,
                    originParent: parentOrigin,
                    originChild: childOrigin
                },
                movable: false
            });

            colorWidgetOutput.lockMovementX = true;
            colorWidgetOutput.lockMovementY = true;

            canvas.add(colorWidgetOutput);
            background.colorWidgetOutput.push(colorWidgetOutput);
            return colorWidgetOutput;
        }


        function getArrayDimensions(initialValue) {
            let indexOfOpeningBrace = initialValue.indexOf('[');
            let indexOfClosingBrace = initialValue.indexOf(']');
            let rows, columns;

            LOG && console.log("Initial value: " + initialValue.substring(indexOfOpeningBrace + 1, indexOfClosingBrace));

            // 2D array
            if (initialValue.substring(indexOfOpeningBrace + 1, indexOfClosingBrace).indexOf(',') != -1) {
                let index = initialValue.indexOf(',');
                LOG && console.log("Row string: " + initialValue.substring(indexOfOpeningBrace + 1, index));
                rows = parseInt(initialValue.substring(indexOfOpeningBrace + 1, index));
                columns = parseInt(initialValue.substring(index + 1, indexOfClosingBrace));
                LOG && console.log("Columns string: " + initialValue.substring(index + 1, indexOfClosingBrace));
                LOG && console.log("Rows: " + rows + " and columns: " + columns);
            } else {
                rows = parseInt(initialValue.substring(indexOfOpeningBrace + 1, indexOfClosingBrace));
                columns = 1;
            }

            return [rows, columns]
        }

        registerProgvolverObject(this);
        return background;
    }
}