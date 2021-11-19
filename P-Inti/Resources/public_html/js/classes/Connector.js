var Connector = fabric.util.createClass(fabric.Line, {
    type: 'connector',
    getValue: function () {
        return this.value;
    },
    getSource: function () {
        return this.source;
    },
    getTarget: function () {
        return this.target;
    },
    toXML: function () {

        var theConnector = this;

        var source = theConnector.source;
        var target = theConnector.target;

        var sourceID = source ? source.xmlID : -1;
        var targetID = target ? target.xmlID : -1;

        var connectorNode = createXMLElement("connector");
        addAttributeWithValue(connectorNode, "from", sourceID);
        addAttributeWithValue(connectorNode, "to", targetID);
        addAttributeWithValue(connectorNode, "arrowColor", theConnector.arrowColor);
        addAttributeWithValue(connectorNode, "strokeWidth", 1);
        addAttributeWithValue(connectorNode, "filledArrow", theConnector.filledArrow);
        addAttributeWithValue(connectorNode, "opacity", theConnector.opacity);

        return connectorNode;
    },
    initialize: function (options) {

//        console.log("%c" + "Creating a connection via the initialize method of the CONNECTOR class...", "background: red; color: white;");

        options || (options = {});

        this.set('source', options.source || null);

//        if (LOG) console.log("options.value: " + options.value);

//        this.set('value', options.value || this.source.value || 0);
        this.set('value', options.value || this.source.value);

//        if (LOG) console.log("%cCreating CONNECTOR with value " + this.value + " of type " + typeof this.value, "background: yellow");


        this.set('target', options.target || null);
        this.set('showInformationFlow', true);

        if (this.showInformationFlow) {
            this.set('movement', 0);
        } else {
            this.set('movement', 0);
        }

        var sourceCenter = this.source.getCompressedMassPoint ? this.source.getCompressedMassPoint() : this.source.getPointByOrigin('center', 'center');
        var targetCenter = this.target ? this.target.getCompressedMassPoint ? this.target.getCompressedMassPoint() : this.target.getPointByOrigin('center', 'center') : (options.x2 && options.y2 ? new fabric.Point(options.x2, options.y2) : sourceCenter);

//        var points = [sourceCenter.x, sourceCenter.y, this.target != null ? this.target.left : options.x2, this.target != null ? this.target.top : options.y2];
        var points = [sourceCenter.x, sourceCenter.y, targetCenter.x, targetCenter.y];

//        console.log(points);

        this.callSuper('initialize', points, options);
        this.set('arrowSeparation', options.arrowSeparation || 80);
        this.set('arrowSize', options.arrowSize || 11);
        this.set('isConnector', true);
        this.set('strokeWidth', options.strokeWidth || 1);
        this.set('lockRotation', true);
        this.set('perPixelTargetFind', false);
        this.set('transparentCorners', false);
        this.set('hasRotatingPoint', false);
        //this.set('dirty', true);
        this.set('objectCaching', true);

        this.set('selectable', false);

        this.set('evented', false);

        this.set('hasBorders', false);
        this.set('hasControls', false);
        this.set('hasRotatingPoint', false);


        this.set('arrowColor', options.arrowColor || this.source.fill);
        this.originalColor = this.arrowColor;
        this.set('stroke', options.stroke || this.arrowColor);
        this.originalStroke = this.stroke;

        if (options.undirected) {
            this.set('stroke', '');
            this.set('strokeWidth', 0);
        } else {
            if (this.source.emitSignal) {
                this.set('strokeWidth', 0)
            } else {
                this.set('strokeDashArray', options.strokeDashArray || [7, 7]);
            }
        }

        this.set('filledArrow', options.filledArrow || false);

        this.set('hidden', options.hidden || canvas.connectorsHidden);
        if (this.hidden) {
            this.opacity = 0;
        }

        this.triangle = [
            [3, 0],
            [-10, -6],
            [-10, 6]
        ];

        var theConnector = this;
        var theSource = theConnector.source;
        var theDestination = theConnector.target;

        /*if (theSource) {
         
         var updatingSource = function (options) {
         var massCenter = theSource.getPointByOrigin('center', 'center');
         if (theSource.getCompressedMassPoint) {
         massCenter = theSource.getCompressedMassPoint();
         }
         theConnector.set({'x1': massCenter.x, 'y1': massCenter.y});
         theConnector.setCoords();
         };
         
         theSource.on('moving', updatingSource);
         theConnector.source.on('scaling', updatingSource);
         theConnector.source.on('modified', updatingSource);
         }*/

        /*if (theDestination) {
         
         var updatingDestination = function () {
         var massCenter = theDestination.getPointByOrigin('center', 'center');
         if (theDestination.getCompressedMassPoint) {
         massCenter = theDestination.getCompressedMassPoint();
         }
         theConnector.set({'x2': massCenter.x, 'y2': massCenter.y});
         theConnector.setCoords();
         if (LOG) {
         console.log("connector target moving");
         }
         };
         
         theConnector.target.on('moving', updatingDestination);
         theConnector.target.on('scaling', updatingDestination);
         theConnector.target.on('modified', updatingDestination);
         }*/

        theConnector.initExpandable();

    },
    split: function (splitPoint, line) {
        console.log("Going to split connector");
        var connector = this;
        var deltaX = line.x2 - line.x1;
        var deltaY = line.y2 - line.y1;
        var angle = fabric.util.radiansToDegrees(Math.atan(deltaY / deltaX)) + 90;
        var theLine = new fabric.Line([splitPoint.x, splitPoint.y, splitPoint.x, splitPoint.y], {
            originX: 'center',
            originY: 'center',
            stroke: 'black',
            strokeWidth: 3,
            selectable: false,
            perPixelTargetFind: true,
            angle: angle
        });
        canvas.add(theLine);
        connector.strokeWidth = 2;
        connector.stroke = '#bcbcbc';
        var increment = 15;
        var initY1 = theLine['y1'];
        fabric.util.animate({
            startValue: initY1,
            endValue: initY1 + increment,
            duration: 300,
            onChange: function (value) {
                theLine.set('y1', value);
            }
        });
        var initY2 = theLine['y2'];
        fabric.util.animate({
            startValue: initY2,
            endValue: initY2 - increment,
            duration: 300,
            onChange: function (value) {
                theLine.set('y2', value);
            },
            onComplete: function () {
                var startAngle = theLine['angle'];
                fabric.util.animate({
                    startValue: startAngle,
                    endValue: startAngle + 180 * 3,
                    duration: 500,
                    onChange: function (value) {
                        theLine.set('angle', value);
                    },
                    onComplete: function () {
                        canvas.remove(theLine);
                        var initOpacity = connector['opacity'];
                        fabric.util.animate({
                            startValue: initOpacity,
                            endValue: 0,
                            duration: 450,
                            easing: fabric.util.ease['easeInQuad'],
                            onChange: function (value) {
                                connector.set('opacity', value);
                            },
                            onComplete: function () {
                                var options = {
                                    connector: connector
                                };
                                connector.target.fire('inConnectionRemoved', options);
                                connector.source.fire('outConnectionRemoved', options);

                                if (connector.target.inConnectionRemoved) {
                                    connector.target.inConnectionRemoved(options);
                                }
                                if (connector.source.outConnectionRemoved) {
                                    connector.source.outConnectionRemoved(options);
                                }

                                canvas.remove(connector);
                            }
                        });
                    }
                });
            }
        });
    },
    grow: function (targetObject, doNotRemoveOnComplete, doNotRefreshCanvas, easing) {

        var theConnector = this;

        console.log("Contracting connection with ID: " + theConnector.id);

        theConnector.growing = true;
        theConnector.stroke = theConnector.arrowColor;

        var xProperty = 'x2';
        var yProperty = 'y2';
        var initX = theConnector['x1'];
        var initY = theConnector['y1'];

        var duration = 350;
        easing = null;

        var center = targetObject.getCompressedMassPoint ? targetObject.getCompressedMassPoint() : targetObject.getCenterPoint();

        var endX = center.x;
        var endY = center.y;

        if (Math.abs(theConnector[xProperty] - endX) < 20 || Math.abs(theConnector[yProperty] - endY) < 20) {
            easing = null;
            duration = 200;
        }

        fabric.util.animate({
            startValue: initX,
            endValue: endX,
            duration: duration,
            easing: easing,
            onChange: function (value) {
                theConnector.set(xProperty, value);
            }
        });
        fabric.util.animate({
            startValue: initY,
            endValue: endY,
            duration: duration,
            easing: easing,
            onChange: function (value) {
                theConnector.set(yProperty, value);
            },
            onComplete: function () {
                theConnector.target = targetObject;
                targetObject._addIncomingConnection(theConnector);
                iVoLVER.registerConnection(theConnector.source.ID, targetObject.ID, theConnector);
            }
        });
    },
    contract: function (toDestination, doNotRemoveOnComplete, easing) {

        var theConnector = this;

        //console.log("XXXXXXXXXXXXXX Contracting connection with ID: " + theConnector.id);

        theConnector.contracting = true;

        var endX = theConnector.source.left;
        var endY = theConnector.source.top;
        var xProperty = 'x2';
        var yProperty = 'y2';

        theConnector.stroke = '#bcbcbc';

//        var duration = easing ? 650 : 2000;
//        easing = fabric.util.ease['easeOutElastic'];

        var duration = 350;
        easing = null;

        if (toDestination) {
            endX = theConnector.target.left;
            endY = theConnector.target.top;
            xProperty = 'x1';
            yProperty = 'y1';
        }

        if (LOG) {
            console.log("theConnector.x1: " + theConnector.x1);
            console.log("theConnector.y1: " + theConnector.y1);
            console.log("theConnector.x2: " + theConnector.x2);
            console.log("theConnector.y2: " + theConnector.y2);
            console.log("endX: " + endX);
            console.log("endY: " + endY);
        }

        if (Math.abs(theConnector[xProperty] - endX) < 20 || Math.abs(theConnector[yProperty] - endY) < 20) {
//            if (LOG) {
//            console.log("Chaging easing and duration...");
//            }
            easing = null;
            duration = 200;
        }

        var initX = theConnector[xProperty];
        var initY = theConnector[yProperty];

        fabric.util.animate({
            startValue: initX,
            endValue: endX,
            duration: duration,
            easing: easing,
            onChange: function (value) {
                theConnector.set(xProperty, value);
            }
        });
        fabric.util.animate({
            startValue: initY,
            endValue: endY,
            duration: duration,
            easing: easing,
            onChange: function (value) {
                theConnector.set(yProperty, value);
            },
            onComplete: function () {
                if (!doNotRemoveOnComplete) {
                    var options = {
                        connector: theConnector
                    };
                    if (theConnector.target) {
                        theConnector.target.fire('inConnectionRemoved', options);
                        if (theConnector.target.inConnectionRemoved) {
                            theConnector.target.inConnectionRemoved(options); // for the connectable interface
                        }
                    }
                    if (theConnector.source) {
                        theConnector.source.fire('outConnectionRemoved', options);
                        if (theConnector.source.outConnectionRemoved) {
                            theConnector.source.outConnectionRemoved(options); // for the connectable interface
                        }
                    }
                    theConnector.contracting = false;
                    canvas.remove(theConnector);
                    if (LOG) {
                        console.log("%cConnector fully contracted and removed", "background: black; color: grey;");
                    }
                }
            }
        });
    },
    setValue: function (value, withAnimation) {
        var theConnector = this;
        theConnector.value = value;
        var theTarget = theConnector.target;
        if (theTarget) {
            if (theTarget.inValueUpdated) {
                theTarget.inValueUpdated(value, withAnimation);
            } else {
                theTarget.setValue(value, withAnimation);
            }
        }
    },
//    setValue: function (value, markDestinationAsSelected, shouldAnimate) {
//
//        if (LOG) {
//            console.log("%c setValue function CONNECTOR class. shouldAnimate: " + shouldAnimate, "background: green; color: white;");
//            console.log("%c value:", "background: blue; color: white;");
//            console.log(value);
//        }
//
//        this.value = value;
//        if (this.target) {
//
//            var options = {
//                inConnection: this,
//                markAsSelected: markDestinationAsSelected,
//                shouldAnimate: shouldAnimate
//            };
//
//            if (this.target.inValueUpdated) {
//                this.target.inValueUpdated(options); // instead of using an event, we call a function
//            } else {
//                this.target.setValue(value, false);
//            }
//
//
//        }
//    },
    applySelectedStyle: function (selectSource, selectDestination) {

        if (LOG) {
            console.log("Applying selected style for CONNECTOR");
        }

        this.strokeWidth = this.selectedStrokeWidth || 3;
        if (selectSource) {
            if (this.source && this.source.applySelectedStyle) {
                this.source.applySelectedStyle(false);
            }
        }
        if (selectDestination) {
            if (this.target && this.target.applySelectedStyle) {
                this.target.applySelectedStyle(false);
            }
        }
    },
    applyDeselectedStyle: function (unselectSource, unselectDestination) {
        this.strokeWidth = this.originalStrokeWidth || 1;
        if (unselectSource) {
            if (this.source && this.source.applyDeselectedStyle) {
                this.source.applyDeselectedStyle(false);
            }
        }
        if (unselectDestination) {
            if (this.target && this.target.applyDeselectedStyle) {
                this.target.applyDeselectedStyle(false);
            }

        }
    },
    setDestination: function (target, shouldAnimate, doNotBlink) {

//        popSound.play();

        var theConnection = this;

        if (LOG) {
            console.log("%c setDestination CONNECTOR class. shouldAnimate: " + shouldAnimate, "background:blue; color: white");
            console.log("target:");
            console.log(target);
        }

        var massCenter = target.getPointByOrigin('center', 'center');
        if (target.getCompressedMassPoint) {
            massCenter = target.getCompressedMassPoint();
        }

        if (LOG) {
            console.log("massCenter:");
            console.log(massCenter);
        }

        if (target) {

            var duration = 250;

            theConnection.animate('x2', massCenter.x, {
                duration: duration,
            });
            theConnection.animate('y2', massCenter.y, {
                duration: duration,
            });

            theConnection.target = target;

            if (LOG) {
                console.log("The target of this connector is: " + target.type);
            }

            var options = {
                newInConnection: theConnection,
                shouldAnimate: shouldAnimate,
                doNotBlink: doNotBlink,
            };

//            theConnection.target.fire('newInConnection', options); // old ivolver

        } else {
            alertify.error("No target provided for this connector", "", 2000);
        }
    },
    setSource: function (source) {
        if (source) {
            var theConnector = this;
            theConnector.source = source;
        }
    },
    remove: function () {
        var theConnector = this;
        if (LOG) {
            console.log("removing connector");
        }
        theConnector.callSuper('remove');
    },
    toObject: function () {
        return fabric.util.object.extend(this.callSuper('toObject'), {
            operator: this.get('operator'),
            isConnector: this.get('isConnector'),
            source: this.get('source'),
            target: this.get('target'),
            arrowSeparation: this.get('arrowSeparation'),
            arrowSize: this.get('arrowSize'),
            arrowColor: this.get('arrowColor'),
        });
    },
    _render: function (ctx) {
        var theConnector = this;
        theConnector.callSuper('_render', ctx);

        ctx.fillStyle = ctx.strokeStyle;

        var x1 = -theConnector.width / 2;
        var y1 = theConnector.height / 2;
        var x2 = theConnector.width / 2;
        var y2 = -theConnector.height / 2;

        if (theConnector.y1 < theConnector.y2) {
            y1 = -theConnector.height / 2;
            y2 = theConnector.height / 2;
        }

        if (theConnector.x1 > theConnector.x2) {
            x1 = theConnector.width / 2;
            x2 = -theConnector.width / 2;
        }

        var deltaX = x2 - x1;
        var deltaY = y2 - y1;

        var angle = Math.atan(deltaY / deltaX);
        if (theConnector.x1 > theConnector.x2) {
            angle += fabric.util.degreesToRadians(180);
        }

        var p1 = {x: x1, y: y1};
        var p2 = {x: x2, y: y2};
        var line = {p1: p1, p2: p2};
        var length = computeLength(line);
        var step = 45;
        if (theConnector.undirected) {
            step = 25;
        }
        var cummulatedDistance;
        var r = 2;
        var gap = 4;

        if (this.showInformationFlow) {
            cummulatedDistance = step;
            if (!theConnector.source || !theConnector.source.emitSignal) {
                this.arrowColor = darken(this.originalColor);
                this.stroke = darken(this.originalStroke);
            }
        } else {
            cummulatedDistance = step;
            if (!theConnector.source || !theConnector.source.emitSignal) {
                this.arrowColor = this.originalColor;
                this.stroke = this.originalStroke;
            }
        }

        while (true) {
            if (this.showInformationFlow && this.movement >= cummulatedDistance / 2) {
                this.movement = 0;
            }

            var point = getPointAlongLine(line, cummulatedDistance + this.get('movement'));
            var x = point.x;
            var y = point.y;

            if (theConnector.undirected) {
                ctx.save();

                ctx.lineWidth = 2;

                ctx.beginPath();
                ctx.arc(x, y, 1, 0, 2 * Math.PI);
                ctx.fillStyle = theConnector.arrowColor;
                ctx.fill();
                ctx.closePath();

                var from = getPointAlongLine(line, cummulatedDistance - step + (gap + r));
                var to = getPointAlongLine(line, cummulatedDistance - (gap + r));
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);

                ctx.strokeStyle = theConnector.arrowColor;
                ctx.stroke();
                ctx.restore();
            } else {
                // Draw wavy line to represent signal
                if (theConnector.source && theConnector.source.emitSignal) {
                    ctx.save();
                    ctx.lineWidth = 2;

                    let xDiff = x2 - x1;
                    let yDiff = y2 - y1;
                    const angle = Math.atan2(yDiff, xDiff);
                    ctx.translate(xDiff / 2, yDiff / 2);
                    ctx.rotate(angle);
                    ctx.beginPath();
                    // Move 4px in front of line to start the arrow so it does not have the square line end showing in front (0,0)
                    ctx.moveTo(4, 0);
                    ctx.lineTo(-4, 4);
                    ctx.lineTo(-4, -4);
                    ctx.closePath();

                    ctx.fillStyle = darken(theConnector.arrowColor);
                    ctx.fill();
                    ctx.restore();

                    ctx.strokeStyle = darken(theConnector.arrowColor);
                    ctx.fillStyle = darken(theConnector.arrowColor);
                    var p = this.calcLinePoints();
                    var point = this.pointOnLine(this.point(p.x2, p.y2), this.point(p.x1, p.y1), 10)
                    this.wavy(this.point(p.x1, p.y1), point, this.point(p.x2, p.y2), ctx);
                    ctx.setLineDash([4, 4]);
                    ctx.stroke();
                    //drawFilledPolygon(translateShape(rotateShape(theConnector.triangle, angle), x2, y2), ctx);
                } else {
                    drawFilledPolygon(translateShape(rotateShape(theConnector.triangle, angle), x, y), ctx);
                }
            }

            cummulatedDistance += step;

            if (this.showInformationFlow) {
                //this.movement += 0.5;
            }

            if (cummulatedDistance >= length) {
                break;
            }
        }

    },
    toSVG: function () {
        var theConnector = this;
        var x1 = -theConnector.width / 2;
        var y1 = theConnector.height / 2;
        var x2 = theConnector.width / 2;
        var y2 = -theConnector.height / 2;
        if (theConnector.y1 < theConnector.y2) {
            y1 = -theConnector.height / 2;
            y2 = theConnector.height / 2;
        }
        if (theConnector.x1 > theConnector.x2) {
            x1 = theConnector.width / 2;
            x2 = -theConnector.width / 2;
        }
        var deltaX = x2 - x1;
        var deltaY = y2 - y1;
        var angle = Math.atan(deltaY / deltaX);
        if (theConnector.x1 < theConnector.x2) {
            angle += fabric.util.degreesToRadians(180);
        }
        var s = '';
        var p1 = {x: x1, y: y1};
        var p2 = {x: x2, y: y2};
        var line = {p1: p1, p2: p2};
        var length = computeLength(line);
        var step = 45;
        if (theConnector.undirected) {
            step = 25;
        }
        var cummulatedDistance = step;
        var r = 2;
        var gap = 4;
        var center = theConnector.getCenterPoint();
        while (true) {
            if (cummulatedDistance >= length) {
                break;
            }
            var point = getPointAlongLine(line, cummulatedDistance);
            var x = point.x;
            var y = point.y;
            var shape = null;

            if (theConnector.undirected && theConnector.opacity > 0.05) {

                console.log("theConnector.opacity: " + theConnector.opacity);

                shape = new fabric.Circle({
                    fill: theConnector.arrowColor,
                    stroke: 'transparent',
                    strokeWidth: 2,
                    radius: 2,
                    originX: 'center',
                    originY: 'center',
                    top: center.y + y,
                    left: center.x + x
                });
                s += shape.toSVG();

                var from = getPointAlongLine(line, cummulatedDistance - step + (gap + r));
                var to = getPointAlongLine(line, cummulatedDistance - (gap + r));

                var l = new fabric.Line([center.x + from.x, center.y + from.y, center.x + to.x, center.y + to.y], {
                    stroke: theConnector.arrowColor,
                    strokeWidth: 2
                });

                s += l.toSVG();

            } else {
                shape = new fabric.Triangle({
                    fill: theConnector.stroke,
                    stroke: 'transparent',
                    strokeWidth: 0,
                    width: 12,
                    height: 13,
                    originX: 'center',
                    originY: 'center',
                    top: center.y + y,
                    left: center.x + x,
                    angle: fabric.util.radiansToDegrees(angle) - 90
                });
                s += shape.toSVG();
            }
            cummulatedDistance += step;
        }

        if (theConnector.undirected) {
            return s;
        } else {
            return this.callSuper('toSVG') + s;
        }


    },
    hide: function () {
        this.opacity = 0;
        this.canvas.connectorsHidden = true;
        this.hidden = true;
    },
    show: function () {
        this.opacity = 1;
        this.canvas.connectorsHidden = false;
        this.hidden = false;
    },
    toggleVisibility: function () {
        if (this.hidden) {
            this.show();
        } else {
            this.hide();
        }
    },
    setConnectorColor: function (color) {
        this.set('fill', color);
        this.arrowColor = color;
        this.set('stroke', color);
    },
    point: function (x, y) {
        return {
            x: x,
            y: y
        };
    },
    wavy: function (from, to, endPoint, ctx) {
        var cx = 0,
                cy = 0,
                fx = from.x,
                fy = from.y,
                tx = to.x,
                ty = to.y,
                i = 0,
                step = 4,
                waveOffsetLength = 0,
                ang = Math.atan2(ty - fy, tx - fx),
                distance = Math.sqrt((fx - tx) * (fx - tx) + (fy - ty) * (fy - ty)),
                amplitude = -7,
                f = Math.PI * distance / 20;


        var counter = 0;
        for (i; i <= distance; i += step) {
            waveOffsetLength = Math.sin((i / distance) * f) * amplitude;
            cx = from.x + Math.cos(ang) * i + Math.cos(ang - Math.PI / 2) * waveOffsetLength;
            cy = from.y + Math.sin(ang) * i + Math.sin(ang - Math.PI / 2) * waveOffsetLength;

//            if (counter == 5) {
//                var position = 4;
//                ctx.save();
//                ctx.beginPath();
//                ctx.moveTo(cx, cy);
//                ctx.lineTo(cx - position, cy + position);
//                ctx.lineTo(cx - position, cy - position);
//                ctx.closePath();
//                ctx.fillStyle = "#FFCC00";
//                ctx.fill();
//                ctx.restore();
//                //drawLineArrow(ctx, cx, cy, cx + 3, cy + 3)
//                counter = 0;
//            }

            i > 0 ? ctx.lineTo(cx, cy) : ctx.moveTo(cx, cy);
            counter++;

        }


        ctx.lineTo(to.x, to.y);
        ctx.lineTo(endPoint.x, endPoint.y);
    },

    pointOnLine: function (point1, point2, dist) {
        var len = Math.sqrt(((point2.x - point1.x) * (point2.x - point1.x)) + ((point2.y - point1.y) * (point2.y - point1.y)));
        var t = (dist) / len;
        var x3 = ((1 - t) * point1.x) + (t * point2.x),
                y3 = ((1 - t) * point1.y) + (t * point2.y);
        return new fabric.Point(x3, y3);
    },
});


iVoLVER.util.extends(Connector.prototype, iVoLVER.model.Expandable);


function createConnectorFromXMLNode(connectorNode) {

    var fromID = connectorNode.attr('from');
    var toID = connectorNode.attr('to');

    console.log("%c" + "Attempting new connection between " + fromID + " and " + toID, "font-weight: bold; font-size: 15px; background: black; color: rgb(240,205,90);");

    var source = connectableElements[fromID];
    var target = connectableElements[toID];

    if (!source || typeof source === 'undefined') {
        console.log("%c" + "Source NOT found!", "font-weight: bold; font-size: 15px; background: black; color: rgb(215,240,90);");
    }
    if (!target || typeof target === 'undefined') {
        console.log("%c" + "Destination NOT found!", "font-weight: bold; font-size: 15px; background: black; color: rgb(215,240,90);");
    }

    if (typeof source !== 'undefined' && typeof target !== 'undefined' && source !== null && target !== null) {

        var arrowColor = connectorNode.attr('arrowColor');
        var strokeWidth = Number(connectorNode.attr('strokeWidth'));
        var filledArrow = connectorNode.attr('filledArrow') === 'true';
        var opacity = Number(connectorNode.attr('opacity'));

        var x1 = source.left;
        var y1 = source.top;
        var x2 = target.left;
        var y2 = target.top;

        var connector = new Connector({
            source: source,
            x1: x1,
            y1: y1,
            target: target,
            x2: x2,
            y2: y2,
            arrowColor: arrowColor,
            filledArrow: filledArrow,
            strokeWidth: strokeWidth,
            opacity: opacity
        });

        source.outConnections.push(connector);
        target.inConnections.push(connector);

        canvas.add(connector);

        if (source.isOperator || source.isLocator) {
            bringToFront(source);
        }

        if (target.isOperator || target.isMark) {
            bringToFront(target);
        }
        console.log("%c" + "Connection created from " + fromID + " to " + toID, "background: rgb(255,192,36); color: white;");
        return true;
    }
    return false;
}

