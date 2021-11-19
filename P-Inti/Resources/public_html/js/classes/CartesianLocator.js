iVoLVER.obj.CartesianLocator = function (options) {

    CartesianLocatorClass = iVoLVER.obj.Locator.createClass(fabric.Rect);

    options.width = 45;
    options.height = 45;
    options.objectCaching = false;

    var cartesianLocator = new CartesianLocatorClass(options);

    cartesianLocator.getSVGForLocationLines = function () {
        var locationLines = new Array();
        var theLocatable = this;
        var theLocator = theLocatable.locator;
        if (theLocator) {
            var markCenter = theLocatable.anchorPoint.getCenterPoint();

            if (!theLocator.isCompressed) {

                var stroke = theLocatable.stroke;
                var strokeWidth = 2;
                var strokeDashArray = [8, 8];

                var hPoints = [markCenter.x, markCenter.y, markCenter.x - theLocatable.xCoordinate, markCenter.y];
                var hLine = new fabric.Line(hPoints, {
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray
                });
                locationLines.push(hLine.toSVG());

                var relativeX = -theLocatable.xCoordinate;
                var relativeY = -theLocatable.yCoordinate;
                var verticalOffset = 0;
                var horizontalOffset = 0;
                var x1 = null;
                var originX = null;
                var originY = null;

                // text of the Y property
                if (relativeX < 0) {
                    originX = "right";
                    if (theLocatable.selected) {
                        x1 = (horizontalOffset + relativeX - 30) / theLocatable.scaleX;
                    } else {
                        x1 = (horizontalOffset + relativeX - 8) / theLocatable.scaleX;
                    }
                } else {
                    originX = "left";
                    if (theLocatable.selected) {
                        x1 = (horizontalOffset + relativeX + 30) / theLocatable.scaleX;
                    } else {
                        x1 = (horizontalOffset + relativeX + 8) / theLocatable.scaleX;
                    }
                }

                if (relativeY < 0) {
                    originY = 'top';
                } else {
                    originY = 'bottom';
                }

                var yDot = new fabric.Circle({
                    originX: 'center',
                    originY: 'center',
                    left: markCenter.x - theLocatable.xCoordinate,
                    top: markCenter.y,
                    fill: stroke,
                    stroke: stroke,
                    radius: 4,
                });
                locationLines.push(yDot.toSVG());

                var ylabel = new fabric.Text(relativeY.toFixed(2), {
                    originX: originX,
                    originY: 'center',
                    left: markCenter.x + x1,
                    top: markCenter.y,
                    fontSize: 16,
                    fill: '#000000',
                    fontFamily: 'Helvetica'
                });
                locationLines.push(ylabel.toSVG());

                var vPoints = [markCenter.x, markCenter.y, markCenter.x, markCenter.y - theLocatable.yCoordinate];
                var vLine = new fabric.Line(vPoints, {
                    stroke: stroke,
                    strokeWidth: strokeWidth,
                    strokeDashArray: strokeDashArray
                });
                locationLines.push(vLine.toSVG());

                var xDot = new fabric.Circle({
                    originX: 'center',
                    originY: 'center',
                    left: markCenter.x,
                    top: markCenter.y - theLocatable.yCoordinate,
                    fill: stroke,
                    stroke: stroke,
                    radius: 4,
                });
                locationLines.push(xDot.toSVG());

                var d = 3;
                var y2 = (verticalOffset + (relativeY + d) * theLocatable.locationLineCompletionLevel) / theLocatable.scaleY;
                var delta;
                if (relativeY < 0) {
                    delta = theLocatable.selected ? -33 : -10;
                } else {
                    delta = theLocatable.selected ? 45 : 20;
                }
                var xlabel = new fabric.Text((-relativeX).toFixed(2), {
                    originX: 'center',
                    originY: originY,
                    left: markCenter.x,
                    top: y2 + markCenter.y + delta,
                    fontSize: 16,
                    fill: '#000000',
                    fontFamily: 'Helvetica'
                });
                locationLines.push(xlabel.toSVG());

            }

        }
        return locationLines;
    };

    cartesianLocator.locationLinesRenderingMethod = function (ctx) {

        var theLocatable = this;

        if (theLocatable.locator) {

            var markCenter = theLocatable.anchorPoint.getCenterPoint();

            ctx.save();

            var relativeX = -theLocatable.xCoordinate;
            var relativeY = -theLocatable.yCoordinate;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                ctx.rotate(-fabric.util.degreesToRadians(theLocatable.angle));
            }
            if (theLocatable.stroke === 'transparent') {
                ctx.strokeStyle = 'rgb(63,63,63)';
            }
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();

            var originX = null;
            var originY = null;

            if (relativeY < 0) {
                originY = 'top';
            } else {
                originY = 'bottom';
            }

            if (relativeX < 0) {
                originX = 'left';
            } else {
                originX = 'right';
            }

            var verticalOffset = 0;
            var horizontalOffset = 0;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                if (theLocatable.anchorX === 'left') {
                    horizontalOffset = -theLocatable.width / 2;
                } else if (theLocatable.anchorX === 'right') {
                    horizontalOffset = theLocatable.width / 2;
                }
                if (theLocatable.anchorY === 'top') {
                    verticalOffset = -theLocatable.height / 2;
                } else if (theLocatable.anchorY === 'bottom') {
                    verticalOffset = theLocatable.height / 2;
                }
            }

            var d = 3;

            // VERTICAL line (the one intersecting the X axis)
            var x = horizontalOffset / theLocatable.scaleX;
            var y1 = verticalOffset / theLocatable.scaleY;
            var y2 = (verticalOffset + (relativeY + d) * theLocatable.locationLineCompletionLevel) / theLocatable.scaleY;


            if (theLocatable.iVoLVERType === 'PathGroupMark') {

                var deltaWidth = (theLocatable.getScaledWidth() - theLocatable.width) / 2;
                var deltaHeight = (theLocatable.getScaledHeight() - theLocatable.height) / 2;

                if (theLocatable.anchorX === 'left') {
                    x += markCenter.x - deltaWidth;
                } else if (theLocatable.anchorX === 'right') {
                    x += markCenter.x + deltaWidth;
                } else {
                    x += markCenter.x;
                }
                if (theLocatable.anchorY === 'top') {
                    y1 += markCenter.y - deltaHeight;
                } else if (theLocatable.anchorY === 'bottom') {
                    y1 += markCenter.y + deltaHeight;
                } else {
                    y1 += markCenter.y;
                }
                y2 = markCenter.y + y2 * theLocatable.scaleY;
            }

            ctx.moveTo(x, y1);
            ctx.lineTo(x, y2);
            ctx.stroke();
            ctx.restore();

            // little dot on the Y axis
            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;
            var pointRadius = iVoLVER.util.computeNormalizedValue(3, 5, theLocatable.locationLineCompletionLevel);
            ctx.beginPath();
            ctx.arc(x, y2 - iVoLVER.util.computeNormalizedValue(0, pointRadius / 2, theLocatable.locationLineCompletionLevel), pointRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            // text showing the value of the X property
            ctx.save();
            ctx.fillStyle = 'rgba(0,0,0,' + theLocatable.locationLineCompletionLevel + ')';
            ctx.font = "16px sans-serif";
            ctx.textAlign = "center";

            var delta;
            if (relativeY < 0) {
                delta = theLocatable.selected ? -33 : -10;
            } else {
                delta = theLocatable.selected ? 40 : 20;
            }
            ctx.fillText(-relativeX.toFixed(2), x, y2 + delta);
            ctx.restore();
            ctx.save();

            var relativeX = -theLocatable.xCoordinate;
            var relativeY = -theLocatable.yCoordinate;

            if (theLocatable.iVoLVERType !== 'PathGroupMark') {
                ctx.rotate(-fabric.util.degreesToRadians(theLocatable.angle));
            }
            if (theLocatable.stroke === 'transparent') {
                ctx.strokeStyle = 'rgb(63,63,63)';
            }
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 8]);
            ctx.beginPath();

            // HORIZONTAL line (the one intersecting the Y axis)
            var x1 = horizontalOffset / theLocatable.scaleX;
            var x2 = (horizontalOffset + (relativeX + d) * theLocatable.locationLineCompletionLevel) / theLocatable.scaleX;
            var y = verticalOffset / theLocatable.scaleY;

            if (theLocatable.iVoLVERType === 'PathGroupMark') {
                var deltaWidth = (theLocatable.getScaledWidth() - theLocatable.width) / 2;
                if (theLocatable.anchorX === 'left') {
                    x1 += markCenter.x - deltaWidth;
                } else if (theLocatable.anchorX === 'right') {
                    x1 += markCenter.x + deltaWidth;
                } else {
                    x1 += markCenter.x;
                }
                if (theLocatable.anchorY === 'top') {
                    y += markCenter.y - deltaHeight;
                } else if (theLocatable.anchorY === 'bottom') {
                    y += markCenter.y + deltaHeight;

                } else {
                    y += markCenter.y;
                }
                x2 = markCenter.x + x2 * theLocatable.scaleX;
            }
            ctx.moveTo(x1, y);
            ctx.lineTo(x2, y);
            ctx.stroke();
            ctx.restore();

            // little dot on the Y axis
            ctx.save();
            ctx.fillStyle = ctx.strokeStyle;
            var pointRadius = iVoLVER.util.computeNormalizedValue(3, 5, theLocatable.locationLineCompletionLevel);
            ctx.beginPath();
            var pss = x2 - iVoLVER.util.computeNormalizedValue(0, pointRadius / 2, theLocatable.locationLineCompletionLevel);
            ctx.arc(pss, y, pointRadius, 0, 2 * Math.PI);
            ctx.closePath();
            ctx.fill();
            ctx.restore();

            ctx.save();

            ctx.fillStyle = 'rgba(0,0,0,' + theLocatable.locationLineCompletionLevel + ')';
            ctx.font = "16px sans-serif";

            // text of the Y property
            if (relativeX < 0) {
                ctx.textAlign = "right";
                if (theLocatable.selected) {
                    x1 = (horizontalOffset + relativeX - 30) / theLocatable.scaleX;
                } else {
                    x1 = (horizontalOffset + relativeX - 8) / theLocatable.scaleX;
                }
            } else {
                ctx.textAlign = "left";
                if (theLocatable.selected) {
                    x1 = (horizontalOffset + relativeX + 30) / theLocatable.scaleX;
                } else {
                    x1 = (horizontalOffset + relativeX + 8) / theLocatable.scaleX;
                }
            }
            y1 = (verticalOffset + 5) / theLocatable.scaleY;
            if (theLocatable.iVoLVERType === 'PathGroupMark') {
                x1 += markCenter.x + 30;
                y1 += markCenter.y;
            }

            var delta;
            if (relativeX < 0) {
                delta = theLocatable.selected ? -33 : -10;
            } else {
                delta = theLocatable.selected ? 30 : 10;
            }

            ctx.fillText(relativeY.toFixed(2), pss + delta, y1);
            ctx.restore();

        }
    };

    cartesianLocator.previousRender = cartesianLocator._render;

    cartesianLocator._render = function (ctx) {
        cartesianLocator.previousRender(ctx);
        ctx.beginPath();
        ctx.save();

        var side = 8;
        ctx.fillStyle = 'black';
        ctx.strokeStyle = 'black';

        ctx.rect(-side / 2, -side / 2, side, side);
        ctx.fill();

        ctx.restore();
        ctx.closePath();

    };

    cartesianLocator.createAxesDescription = function () {

        var theLocator = this;

        var d = 7;
        theLocator.minLength = 100;
        theLocator.axisLineStrokeWidth = 4;

        theLocator.axes = {
            positiveX: {
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                objectOriginX: 'left',
                objectOriginY: 'center',
                lineCoordinates: [0, 0, cartesianLocator.minLength, 0],
                x: -d,
                y: 0,
                deltaX: 15,
                deltaY: 0
            },
            negativeX: {
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                objectOriginX: 'right',
                objectOriginY: 'center',
                lineCoordinates: [0, 0, 15, 0],
                x: d,
                y: 0,
                deltaX: 15,
                deltaY: 0
            },
            positiveY: {
                locatorOriginX: 'center',
                locatorOriginY: 'top',
                objectOriginX: 'center',
                objectOriginY: 'bottom',
                lineCoordinates: [0, 0, 0, cartesianLocator.minLength],
                x: 0,
                y: d,
                deltaX: 0,
                deltaY: 15
            },
            negativeY: {
                locatorOriginX: 'center',
                locatorOriginY: 'bottom',
                objectOriginX: 'center',
                objectOriginY: 'top',
                lineCoordinates: [0, 0, 0, 15],
                x: 0,
                y: -d,
                deltaX: 0,
                deltaY: 15
            }
        };

    };

    cartesianLocator.createArrowHeadsDescription = function () {

        var theLocator = this;

        theLocator.arrowHeads = {
            positiveX: {
                points: [{x: 0, y: 0}, {x: 15, y: 5}, {x: 0, y: 10}],
                stroke: 'green',
                compressedX: 5,
                expandedX: theLocator.minLength - 10,
                compressedY: 0,
                expandedY: 0,
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                objectOriginX: 'left',
                objectOriginY: 'center',
                scaleXCompressed: 1,
                scaleYCompressed: 1,
                opacityCompressed: 1
            },
            negativeX: {
                points: [{x: 0, y: 0}, {x: 15, y: 5}, {x: 15, y: -5}],
                stroke: 'green',
                compressedX: -5,
                expandedX: -5,
                compressedY: 0,
                expandedY: 0,
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                objectOriginX: 'right',
                objectOriginY: 'center',
                scaleXCompressed: 0,
                scaleYCompressed: 0,
                opacityCompressed: 0
            },
            positiveY: {
                points: [{x: 0, y: 0}, {x: 5, y: -15}, {x: 10, y: 0}],
                stroke: 'green',
                compressedX: 0,
                expandedX: 0,
                compressedY: -5,
                expandedY: -(theLocator.minLength - 10),
                locatorOriginX: 'center',
                locatorOriginY: 'top',
                objectOriginX: 'center',
                objectOriginY: 'bottom',
                scaleXCompressed: 1,
                scaleYCompressed: 1,
                opacityCompressed: 1
            },
            negativeY: {
                points: [{x: 0, y: 0}, {x: 5, y: 15}, {x: 10, y: 0}],
                stroke: 'green',
                compressedX: 0,
                expandedX: 0,
                compressedY: 5,
                expandedY: 5,
                locatorOriginX: 'center',
                locatorOriginY: 'bottom',
                objectOriginX: 'center',
                objectOriginY: 'top',
                scaleXCompressed: 0,
                scaleYCompressed: 0,
                opacityCompressed: 0
            }
        };
    };

    cartesianLocator.updateBoundLimits = function () {

        var theLocator = this;
        var marksBoundLimits = theLocator.getMarksBoundLimits();

        theLocator.axesLengthsDescription[0].boundLimit = marksBoundLimits.rightmost;
        theLocator.axesLengthsDescription[1].boundLimit = marksBoundLimits.leftmost;
        theLocator.axesLengthsDescription[2].boundLimit = marksBoundLimits.topmost;
        theLocator.axesLengthsDescription[3].boundLimit = marksBoundLimits.bottommost;

    };

    cartesianLocator.createAxesLengthsDescription = function (withAnimation) {

        var theLocator = this;
        var marksBoundLimits = theLocator.getMarksBoundLimits();

        theLocator.axesLengthsDescription = [{
                name: 'positiveX',
                locatorOriginX: 'right',
                locatorOriginY: 'center',
                limit: 'x',
                arrowDistance: 10,
                boundLimit: marksBoundLimits.rightmost,
                minLength: 100,
            }, {
                name: 'negativeX',
                locatorOriginX: 'left',
                locatorOriginY: 'center',
                limit: 'x',
                arrowDistance: -10,
                boundLimit: marksBoundLimits.leftmost,
                useNegative: true,
                minLength: 15,
            }, {
                name: 'positiveY',
                locatorOriginX: 'center',
                locatorOriginY: 'top',
                limit: 'y',
                arrowDistance: -10,
                boundLimit: marksBoundLimits.topmost,
                minLength: 100,
                useNegative: true,
            }, {
                name: 'negativeY',
                locatorOriginX: 'center',
                locatorOriginY: 'bottom',
                limit: 'y',
                arrowDistance: 10,
                boundLimit: marksBoundLimits.bottommost,
                minLength: 15,
            }
        ];

    };

    cartesianLocator.registerLocatableEvents = function (theLocatable) {

        var theLocator = this;

        theLocatable.registerListener('selected', function (options) {

            if (!theLocator.isCompressing) {

                // deselecting ALL the locatable objects of the locator
                theLocator.deselectLocatableObjects();

                // selecting this one (essentially, showing its location properties)
                theLocatable.selected = true;
                theLocator.setOpacityOfLocationProperties(theLocatable, 1);
            }
        });

        theLocatable.registerListener('moving', function (options) {

//            // console.log("moving locatable");

            var theLocator = theLocatable.locator;

            if (!theLocatable.selected) {
                if (!theLocator.isCompressed) {
                    theLocatable.selected = true;
                    theLocator.setOpacityOfLocationProperties(theLocatable, 1);
                }
            }

            if (theLocator) {

//                // console.log("1111111");

                theLocatable.setCoords && theLocatable.setCoords();

                var locatorCenter = theLocator.getPointByOrigin('center', 'center');

                var targetPosition = theLocatable.getPointByOrigin(theLocatable.anchorX, theLocatable.anchorY);

//                // console.log(targetPosition.x);
//                // console.log(locatorCenter.x);

                // updating the mark's position attributes
                theLocatable.xCoordinate = targetPosition.x - locatorCenter.x;
                theLocatable.yCoordinate = targetPosition.y - locatorCenter.y;


//                // console.log(theLocatable.xCoordinate);

                var markCompressedOptions = theLocator.getStateProperties(theLocatable, false);
                markCompressedOptions.x = theLocatable.xCoordinate;
                markCompressedOptions.y = theLocatable.yCoordinate;

                var markExpandedOptions = theLocator.getStateProperties(theLocatable, true);
                markExpandedOptions.x = theLocatable.xCoordinate;
                markExpandedOptions.y = theLocatable.yCoordinate;

                var xPropertyCompressedOptions = theLocator.getStateProperties(theLocatable.xProperty, false);
                xPropertyCompressedOptions.x = theLocatable.xCoordinate;
                var xPropertyExpandedOptions = theLocator.getStateProperties(theLocatable.xProperty, true);
                xPropertyExpandedOptions.x = theLocatable.xCoordinate;

                var yPropertyCompressedOptions = theLocator.getStateProperties(theLocatable.yProperty, false);
                yPropertyCompressedOptions.y = theLocatable.yCoordinate;
                var yPropertyExpandedOptions = theLocator.getStateProperties(theLocatable.yProperty, true);
                yPropertyExpandedOptions.y = theLocatable.yCoordinate;

                // disconnecting the location properties when the value they hold is not the right one
                if (!theLocatable.locked) {
                    if (theLocatable.xProperty.value.number !== theLocatable.xCoordinate) {
                        theLocatable.xProperty.disconnect(true, false);
                    }
                    if (theLocatable.yProperty.value.number !== -theLocatable.yCoordinate) {
                        theLocatable.yProperty.disconnect(true, false);
                    }
                }

                theLocatable.xProperty.setValue(createNumberValue({unscaledValue: theLocatable.xCoordinate}), false, true);
                theLocatable.yProperty.setValue(createNumberValue({unscaledValue: -theLocatable.yCoordinate}), false, true);
                theLocator.positionObjects();

                theLocator.updateAxesLengths(false, false);

            }
        });
    };


    cartesianLocator.computeLocatableCoordinates = function (theLocatable) {

        var theLocator = this;

        var locatorCenter = theLocator.getPointByOrigin('center', 'center');
        var targetPosition = theLocatable.getPointByOrigin(theLocatable.anchorX, theLocatable.anchorY);
        var x = targetPosition.x - locatorCenter.x;
        var y = targetPosition.y - locatorCenter.y;

        theLocator.addChild(theLocatable, {
            whenCompressed: {
                x: x,
                y: y,
                scaleX: 1,
                scaleY: 1,
                opacity: 1,
                originChild: {originX: theLocatable.anchorX, originY: theLocatable.anchorY},
            },
            whenExpanded: {
                x: x,
                y: y,
                originChild: {originX: theLocatable.anchorX, originY: theLocatable.anchorY},
            }
        });

        theLocatable.locator = theLocator;
        theLocatable.xCoordinate = x;
        theLocatable.yCoordinate = y;

    };


    // Each locator is responsible to create the location properties of an object
    // (because only the locator itself is able to know what properties it will need to locate a given object)
    cartesianLocator.createLocationProperties = function (object) {

        var theLocator = this;

        //let yCoordinate = 100//object.getPointBy
        var xProperty = new iVoLVER.model.ValueHolder({
            value: 123,
            fill: object.fill,
            stroke: object.stroke !== 'transparent' ? object.stroke : 'rgb(63,63,63)',
            name: 'xCoordinate',
            path: paths.x.rw,
            locatable: object,
            showLabel: false
        });

        var yProperty = new iVoLVER.model.ValueHolder({
            value: 100,
            fill: object.fill,
            stroke: object.stroke !== 'transparent' ? object.stroke : 'rgb(63,63,63)',
            name: 'yCoordinate',
            path: paths.y.rw,
            locatable: object,
            showLabel: false
        });

        object.locationProperties = new Array();
        object.locationProperties.push(xProperty);
        object.locationProperties.push(yProperty);

        object.xProperty = xProperty;
        object.yProperty = yProperty;

        theLocator.addChild(object.xProperty, {
            whenCompressed: {
                x: object.xCoordinate,
                y: 0,
            },
            whenExpanded: {
                x: object.xCoordinate,
                y: 0,
                opacity: 0
            },
            movable: false
        });

        theLocator.addChild(object.yProperty, {
            whenCompressed: {
                x: 0,
                y: object.yCoordinate,
            },
            whenExpanded: {
                x: 0,
                y: object.yCoordinate,
                opacity: 0
            },
            movable: false
        });

        xProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;
        yProperty.beforeRender = iVoLVER.obj.Mark.beforeRenderCircularVisualProperty;

        canvas.add(object.xProperty);
        canvas.add(object.yProperty);

        // x property event
        theLocator.subscribe(xProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {

            var withAnimation = eventOptions.withAnimation;

            var theValue = xProperty.value;
            var number = theValue.number;

            var theLocatable = object;
            var oldX = theLocatable.xCoordinate;


            var xPropertyCompressedOptions = theLocator.getStateProperties(xProperty, false);
            var xPropertyExpandedOptions = theLocator.getStateProperties(xProperty, true);
            var locatableCompressedOptions = theLocator.getStateProperties(theLocatable, false);
            var locatableExpandedOptions = theLocator.getStateProperties(theLocatable, true);

            if (withAnimation) {
                fabric.util.animate({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500,
                    startValue: 0,
                    endValue: 1,
                    onChange: function (currentValue) {
                        var newX = iVoLVER.util.computeNormalizedValue(oldX, number, currentValue);
                        theLocatable.xCoordinate = newX;
                        xPropertyCompressedOptions.x = newX;
                        xPropertyExpandedOptions.x = newX;
                        locatableCompressedOptions.x = newX;
                        locatableExpandedOptions.x = newX;
                        theLocator.positionObjects();
                        theLocator.updateAxesLengths(false, false);

                    }
                });
            } else {
                theLocatable.xCoordinate = number;
                xPropertyCompressedOptions.x = number;
                xPropertyExpandedOptions.x = number;
                locatableCompressedOptions.x = number;
                locatableExpandedOptions.x = number;
                theLocator.positionObjects();
                theLocator.updateAxesLengths(false, false);
            }
        });


        // y property event
        theLocator.subscribe(yProperty, 'valueSet', function (subscriber, subscribable, eventOptions) {

            var withAnimation = eventOptions.withAnimation;

            var theValue = yProperty.value;
            var number = theValue.number;

            var theLocatable = object;
            var oldY = -theLocatable.yCoordinate;

            var yPropertyCompressedOptions = theLocator.getStateProperties(yProperty, false);
            var yPropertyExpandedOptions = theLocator.getStateProperties(yProperty, true);
            var locatableCompressedOptions = theLocator.getStateProperties(theLocatable, false);
            var locatableExpandedOptions = theLocator.getStateProperties(theLocatable, true);

            if (withAnimation) {
                fabric.util.animate({
                    easing: fabric.util.ease.easeOutBack,
                    duration: 500,
                    startValue: 0,
                    endValue: 1,
                    onChange: function (currentValue) {
                        var newY = iVoLVER.util.computeNormalizedValue(oldY, number, currentValue);
                        theLocatable.yCoordinate = -newY;
                        yPropertyCompressedOptions.y = -newY;
                        yPropertyExpandedOptions.y = -newY;
                        locatableCompressedOptions.y = -newY;
                        locatableExpandedOptions.y = -newY;
                        theLocator.positionObjects();
                        theLocator.updateAxesLengths(false, false);

                    }
                });
            } else {
                theLocatable.yCoordinate = -number;
                yPropertyCompressedOptions.y = -number;
                yPropertyExpandedOptions.y = -number;
                locatableCompressedOptions.y = -number;
                locatableExpandedOptions.y = -number;
                theLocator.positionObjects();
                theLocator.updateAxesLengths(false, false);
            }
        });




    };

    return cartesianLocator;

}
