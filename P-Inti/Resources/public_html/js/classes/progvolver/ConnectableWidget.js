class ConnectableWidget {

    constructor(baseClass, options) {

        this.expandCompressDuration = 100;
        this.addWithAnimation = options.addWithAnimation;
        this.background = this.createBackground(baseClass, options);
        var backgroundObject = this.background;
        this.label = options.label || '';
        !options.doNotAddLabelObject && this.addLabelObject(options.isMember);
        this.addConnectionDropableArea(options);

        !options.doNotAddConnectionPorts && this.addConnectionPorts(options.connectionPortLocations);

        this.registerEventListeners();
        this.background.childrenOnTop = new Array();

        this.id = this.background.id;

        this.background.setLabel = function (label) {

            var theWidget = this.widget;
            var labelObject = theWidget.labelObject;
            this.label = label || '';
            labelObject.set('text', this.label);

            var bottomPort = theWidget.ports['bottom'];
            var compressedOptions = this.compressedOptions[bottomPort.id];
            var expandedOptions = this.expandedOptions[bottomPort.id];

            if (this.label == '') {
                compressedOptions.y = this.strokeWidth + 1;
                expandedOptions.y = this.strokeWidth + 1;
            } else {
                // the added number of pixels may vary when the final version of the symbol widget is ready
                compressedOptions.y = this.strokeWidth + 22;
                expandedOptions.y = this.strokeWidth + 22;
            }

            this.positionObjects();

        };

        iVoLVER._registerObject(this.background);

        this.background.isMouseDownMoving = false;

        this.background.setProgramTime = function (time) {
            // 'this' here refers to the variable background
            this[window.sliderDimension] = time;
            this.currentTime = time;
            backgroundObject.currentTime = time;
            if (this.references) {
                var filteredReferences = this.references.filter(item => item[window.sliderDimension] <= time);
                var lastReference = filteredReferences[filteredReferences.length - 1];
                console.log(lastReference);
                this.onReferenced && this.onReferenced(lastReference);
            }

            if (this.history) {
                this.oldValues = this.values;
                this.values = this.history.filter(item => item[window.sliderDimension] <= time);

                // if (this.oldValues && (this.oldValues.length == this.values.length)) {
                //     console.log("Duplicate call. Returning");
                //     return;
                // }

                if (this.values.length) {
                    console.log("Mapped to time: " + this.values[this.values.length - 1].time)
                    this.onValuesUpdated && this.onValuesUpdated(this.values[this.values.length - 1]);
                    /*console.log(this.history);
                     console.log(this.values);*/
                }
            }


            if (backgroundObject.movementInteractionEvent) {
                if (backgroundObject.movementInteractionEvent.timeOfMovement != -1) {
                    if (backgroundObject.currentTime < backgroundObject.movementInteractionEvent.timeOfMovement) {
                        backgroundObject.left = backgroundObject.movementInteractionEvent.oldXPosition;
                        backgroundObject.top = backgroundObject.movementInteractionEvent.oldYPosition;
                        backgroundObject.positionObjects();
                    } else {
                        backgroundObject.left = backgroundObject.movementInteractionEvent.newXPosition;
                        backgroundObject.top = backgroundObject.movementInteractionEvent.newYPosition;
                        backgroundObject.positionObjects();
                    }
                }
            }

            if (backgroundObject.disappearanceInteractionEvent) {
                if (backgroundObject.disappearanceInteractionEvent.timeOfDisappearance != -1) {
                    if (backgroundObject.currentTime < backgroundObject.disappearanceInteractionEvent.timeOfDisappearance) {
                        if (!backgroundObject.disappearanceInteractionEvent.isParentOnCanvas) {
                            canvas.add(backgroundObject);
                            backgroundObject.childrenOnTop.forEach(function (child) {
                                canvas.add(child);
                            })

                            backgroundObject.children.forEach(function (child) {
                                canvas.add(child);
                            })

                            backgroundObject.disappearanceInteractionEvent.isParentOnCanvas = true;
                            backgroundObject.positionObjects();
                        }
                    } else {
                        if (backgroundObject.disappearanceInteractionEvent.isParentOnCanvas) {
                            canvas.remove(backgroundObject);
                            backgroundObject.childrenOnTop.forEach(function (child) {
                                canvas.remove(child);
                            })

                            backgroundObject.children.forEach(function (child) {
                                canvas.remove(child);
                            })

                            backgroundObject.disappearanceInteractionEvent.isParentOnCanvas = false;
                        }
                    }
                }
            }

            // // shooting stars decay
            if (backgroundObject.shootingStarsDict) {
                for (const [key, value] of Object.entries(backgroundObject.shootingStarsDict)) {
                    if (backgroundObject.shootingStarsDict[key].array) {
                        console.log("shooting star decay");
                        shootingStarsDecay(backgroundObject, namedSymbols[key]);
                    }
                }
            }

        };
        return this.background;
    }

    createBackground(baseClass, options) {
        var theWidget = this;
        var BackgroundClass = iVoLVER.util.createClass(baseClass, {
            initialize: function (options) {
                options || (options = {});

                options.noScaleCache = false; // to guarantee that the object gets updated during scaling
                this.callSuper('initialize', options);
                this.initExpandable();
            }
        });
        iVoLVER.util.extends(BackgroundClass.prototype, iVoLVER.model.Expandable);

        var fill = options.fill || iVoLVER.util.getRandomColor();
        options.fill = fill;
        options.originX = options.originX || 'center';
        options.originY = options.originY || 'center';
        options.top = options.y;
        options.left = options.x;
        options.stroke = options.stroke || darken(fill);
        options.strokeWidth = options.strokeWidth || 1;
        options.strokeUniform = options.strokeUniform || true;
        options.transparentCorners = options.transparentCorners || false;
        options.cornerColor = options.cornerColor || lighten(fill, 15);
        options.borderColor = options.borderColor || lighten(fill, 10);
        options.borderDashArray = options.borderDashArray || [7, 7];
        options.cornerStrokeColor = options.cornerStrokeColor || darken(fill);
        options.compressed = options.compressed || true;
        options.scaleX = options.scaleX || options.addWithAnimation ? 0 : 1;
        options.scaleY = options.scaleY || options.addWithAnimation ? 0 : 1;
        options.opacity = options.opacity || options.addWithAnimation ? 0 : 1;
        var theBackground = new BackgroundClass(options);
        theBackground.doNotCompressWhenCanvasClicked = options.doNotCompressWhenCanvasClicked;
        if (!options.nonResizable) {
            theBackground.setControlsVisibility({
                mt: false,
                mb: false,
                mr: false,
                ml: false,
                mtr: false
            });
        }
        theBackground.widget = theWidget;
        return theBackground;
    }

    addLabelObject(isMember) {
        var theWidget = this;
        var background = theWidget.background;
        var labelObject = new fabric.Text(theWidget.label, {
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
        if (isMember) {
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

        theWidget.labelObject = labelObject;
        background.labelObject = labelObject;
    }

    addConnectionDropableArea(options) {
        var theWidget = this;
        var background = theWidget.background;
        var height = options.height;
        var width = options.width;
        var x = options.x;
        var y = options.y;
        var padding = 70;
        this.connectionDroppingArea = new fabric.Rect({
            originX: 'center',
            originY: 'center',
            height: height + padding * 2,
            width: width + padding * 2,
            top: y,
            left: x,
            fill: 'transparent',
//            fill: 'yellow',
            strokeWidth: 1,
            hasControl: false,
            selectable: false
        });
        this.connectionDroppingArea.codeNote = this;

        var originParent = {originX: 'center', originY: 'center'};
        var originChild = {originX: 'center', originY: 'center'};
        this.background.addChild(this.connectionDroppingArea, {
            whenCompressed: {
                x: 0, y: 0,
                scaleX: 1, scaleY: 1, opacity: 1,
                originParent: originParent,
                originChild: originChild
            },
            whenExpanded: {
                x: 0, y: 0, opacity: 0.5,
                originParent: originParent,
                originChild: originChild
            },
            movable: false
        });

        this.connectionDroppingArea.on({
            connectionover: function () {
                background.expand({duration: theWidget.expandCompressDuration});
            },
            connectionout: function () {
                background.compress({duration: theWidget.expandCompressDuration});
            }
        });
    }

    registerEventListeners() {

        var theWidget = this;
        var background = theWidget.background;

        background.registerListener('selected', function (options) {
            background.expand({duration: theWidget.expandCompressDuration});
        });

        background.registerListener('deselected', function (options) {
            if (!background.doNotCompressWhenCanvasClicked) {
                background.compress({duration: theWidget.expandCompressDuration});

                if (!iVoLVER.util.isUndefined(theWidget.startLine) && !iVoLVER.util.isUndefined(theWidget.endLine)) {
                    if (window.jsHandler && window.jsHandler.onObjectDeselected) {
                        window.jsHandler.onObjectDeselected({id: background.id}).then(function (response) {
                            console.log(response);
                        });
                    }
                }
            }
        });

        background.registerListener('connectionover', function (options) {
            background.fire('selected');
        });

        background.registerListener('connectionout', function (options) {
            background.fire('deselected');
        });

        background.registerListener('scaling', function (options) {
            if (!background.customScalingFunction) {
                background.setCoords();
                background.positionObjects();
                background.positionHtmlObjects();
            } else {
                background.customScalingFunction();
            }
        });


        background.registerListener('moving', function (options) {
            // Check if the moving event just started
            if (!background.isMouseDownMoving) {
                let position = (background.getPointByOrigin('left', 'top'));

                background.oldPositionY = parseFloat(position.y);
                background.oldPositionX = parseFloat(position.x);

                background.isMouseDownMoving = true;
            }
        });

        background.registerListener('mouseup', function () {
            // Check if it was moving earlier
            if (background.isMouseDownMoving) {
                background.isMouseDownMoving = false;
                let position = (background.getPointByOrigin('left', 'top'));

                background.newPositionY = parseFloat(position.y);
                background.newPositionX = parseFloat(position.x);

                new MovingEvent(background, background.oldPositionX, background.oldPositionY, background.newPositionX, background.newPositionY);
            }
        });

        background.registerListener('added', function (options) {

            !theWidget.connectionDroppingArea.canvas && canvas.add(theWidget.connectionDroppingArea);
            background.bringToFront();
            theWidget.labelObject && !theWidget.labelObject.canvas && canvas.add(theWidget.labelObject);
            theWidget.thePorts && theWidget.thePorts.forEach(function (port) {
                !port.canvas && canvas.add(port);
            });

            background.childrenOnTop.forEach(function (child) {
                child.bringToFront();
            });

            if (theWidget.addWithAnimation) {
                var duration = 400;
                var easing = fabric.util.ease.easeOutBack;
                fabric.util.animate({
                    startValue: 0,
                    endValue: 1,
                    duration: duration,
                    easing: easing,
                    onChange: function (value) {
                        background.scaleX = value;
                        background.scaleY = value;
                        background.opacity = value;
                        background.positionObjects();
                        background.positionHtmlObjects();
                    },
                });
            } else {
                background.positionObjects();
                setTimeout(function () {
                    background.positionHtmlObjects();
                }, 50);
            }

            var color = new fabric.Color(background.fill);

            if (window.jsHandler) {
                window.jsHandler.onObjectCreated({id: background.id, mainColor: '#' + color.toHex(), opacity: 0.25}).then(function (response) {
//                    console.log(response);
                });
            }

            if (background.afterAdded) {
                background.afterAdded();
            }

            new CreationEvent(background);
        });
    }

    addConnectionPorts(connectionPortLocations) {

        var theWidget = this;
        var background = theWidget.background;

        theWidget.thePorts = new Array();
        theWidget.ports = {};

        var originParent;
        var originChild;
        var name;

        for (var i = 0; i < 4; i++) {
            var x = 0, y = 0;
            switch (i) {
                case 0:
                    originParent = {originX: 'left', originY: 'center'};
                    originChild = {originX: 'right', originY: 'center'};
                    name = 'left';
                    x = -(background.strokeWidth + 1);
                    break;
                case 1:
                    originParent = {originX: 'center', originY: 'top'};
                    originChild = {originX: 'center', originY: 'bottom'};
                    name = 'top';
                    y = -(background.strokeWidth + 1);
                    break;
                case 2:
                    originParent = {originX: 'right', originY: 'center'};
                    originChild = {originX: 'left', originY: 'center'};
                    name = 'right';
                    x = (background.strokeWidth + 1);
                    break;
                case 3:
                    originParent = {originX: 'center', originY: 'bottom'};
                    originChild = {originX: 'center', originY: 'top'};
                    name = 'bottom';
//                    y = this.label != '' ? (background.strokeWidth + 1) + 22 : (background.strokeWidth + 1);
                    y = this.label != '' ? (background.strokeWidth + 1) + 15 : (background.strokeWidth + 1);
                    break;
            }

            if (connectionPortLocations && !connectionPortLocations.includes(name))
                continue;

            var thePort = new ConnectionPort({
                fill: background.fill,
                stroke: darken(background.stroke),
                strokeWidth: 1,
                opacity: 0,
                background: background,
                hasBorders: false,
                hasControls: false,
                widget: background
            });

            thePort.registerListener('connectionover', function (options) {
                background.fire('selected');
            });

            thePort.registerListener('connectionout', function (options) {
                background.fire('deselected');
            });

            thePort.registerListener('selected', function (options) {
                background.fire('selected');
            });

            thePort.registerListener('deselected', function (options) {
                background.fire('deselected');
            });

            background.addChild(thePort, {
                whenCompressed: {
                    x: 0, y: y,
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
            theWidget.thePorts.push(thePort);
            theWidget.ports[name] = thePort;
        }
    }
}