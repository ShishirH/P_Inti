class ProgvolverSymbol extends ConnectableWidget {
    constructor(options) {

        var symbolFont = '20px Helvetica';
        var symbolKinds = {
            Alias: '#B3CDE3',
            ArrayType: '#FED9A6',
            Assembly: '#DFE3B3',
            DynamicType: '#B3CDE3',
            ErrorType: '#FED9A6',
            Event: '#DFE3B3',
            Field: '#B3CDE3',
            Label: '#FED9A6',
            Local: '#DFE3B3',
            Method: '#B3CDE3',
            NetModule: '#FED9A6',
            NamedType: '#DFE3B3',
            Namespace: '#B3CDE3',
            Parameter: '#FED9A6',
            PointerType: '#DFE3B3',
            Property: '#B3CDE3',
            RangeVariable: '#FED9A6',
            TypeParameter: '#DFE3B3',
            Preprocessing: '#B3CDE3',
            Discard: '#FED9A6'
        };

        options.height = options.height || 30;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.label = options.label || options.fileName && options.lineNumber ? options.fileName + ' (' + options.lineNumber + ')' : options.fileName || '';
        options.fill = symbolKinds[options.kind];
        options.stroke = options.stroke || darken(symbolKinds[options.kind]);
        options.strokeWidth = options.strokeWidth || 2;
        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = super(fabric.Rect, options);

        var theWidget = background.widget;

        this.values = options.values;
        this.name = options.name;
        this.dataType = options.type;
        this.containingType = options.containingType;
        this.value = options.value || '';
        this.isMember = options.isMember;
        this.doNotRegisterObject = options.doNotRegisterObject || false;

        background.name = options.name;
        background.dataType = options.type;
        background.value = options.value;
        background.values = options.values;
        background.file = options.file;
        background.fileName = options.fileName;
        background.kind = options.kind;
        background.doNotAddLabelObject = options.doNotAddLabelObject;
        background.fontColor = 'rgba(65, 65, 65, 1)';

        background.children = [];
        background.expandedHeight = 30;
        background.widget.labelObject && background.childrenOnTop.push(background.widget.labelObject);

        theWidget.thePorts && theWidget.thePorts.forEach(function (port) {
            background.childrenOnTop.push(port);
        });

//        this.compressedOptions[theWidget.ports['top'].id].y = -28;
//        this.expandedOptions[theWidget.ports['top'].id].y = -28;

//        this.compressedOptions[theWidget.ports['bottom'].id].y = 42;
//        this.expandedOptions[theWidget.ports['bottom'].id].y = 42;


        /*theWidget.thePorts.forEach(function (port) {
         port.connectionAccepted = function () {
         var dataForPlotter = background.values.map(function (item) {
         return {value: item[1], time: item[14], symbol: item[0]}
         });
         console.log(dataForPlotter);
         } 
         });*/

        background.afterCompressing = function () {
            if (this.isMember) {
                background.set('width', 1);
                background.set('height', 1);

                background.children.forEach(function (child) {
                    child.compress && child.compress();
                })
            }
        }

        background.afterExpanding = function () {
            if (this.isMember) {
                background.set('width', background.expandedWidth);
                background.set('height', 30);
                background.positionObjects();
            }
        }

        background.onChangeCompressing = function (currentValue) {
            if (this.isMember) {
                background.set('width', (background.expandedWidth * currentValue));
                background.set('height', (background.expandedHeight * currentValue));
                background.compressed = true;
            }
        }

        background.onChangeExpanding = function (currentValue) {
            if (this.isMember) {
                background.set('width', (background.expandedWidth * currentValue));
                background.set('height', (background.expandedHeight * currentValue));
                background.compressed = false;
            }
        }


        background.widget.labelObject && background.widget.labelObject.on({
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
                                newDispatcher: true,
                                opacity: 0.25
                            };
                            console.log(args);
                            window.jsHandler.goTo(args);
                        }
                    }
                }
            },
        });

        function getValueWidth(theFont) {
            var ctx = canvas.getContext();
            ctx.save();
            ctx.font = theFont;

            var renderableValue = background.value;
            if (!iVoLVER.util.isUndefined(background.value) && iVoLVER.util.isNumber(background.value)) {
                renderableValue = background.value.toFixed(2);
            }

            return ctx.measureText(renderableValue).width;
        }

        background.afterSettingHistory = function () {
            background.removeSliderMarks();
            background.createSliderMarks();
        }

        background.setHistory = function () {
            background.history = window.logData.filter(item => item.widgetsID.indexOf(background.id) != -1);
            background.afterSettingHistory && background.afterSettingHistory();
        }

        background.setReferences = function () {
            background.references = window.useData.filter(item => item.widgetID == background.id);
            background.afterSettingReference && background.afterSettingReference();
        }

        background.showSliderMarks = function () {
            $('.' + background.id).css('opacity', '1');
        }

        background.hideSliderMarks = function () {
            $('.' + background.id).css('opacity', '0');
        }

        background.removeSliderMarks = function () {
            $('.' + background.id).remove();
        }

        background.setValue = function (newValue, withAnimation) {
//            background.value = '' + newValue;
            background.value = newValue;
            background.set('width', getValueWidth(symbolFont) + 10 > 40 ? getValueWidth(symbolFont) + 10 : 40);
            background.expandedWidth = background.width;
            /*var iVoLVER_Value = createNumberValue({
             unscaledValue: newValue
             });*/

            theWidget.thePorts && theWidget.thePorts.forEach(function (port) {
//                port.setValue(iVoLVER_Value, withAnimation);
                port.setValue(newValue, withAnimation);
            });

        }
        background.setValue(this.value);

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
            ctx.fillStyle = background.fontColor;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            //Drawing shooting stars
            // var shootingStarStart = background.getPointByOrigin('right', 'center');
            // shootingStarStart.x += 5;
            // let shootingStarCenter = {x: shootingStarStart.x + 100, y: shootingStarStart.y + 100};
            // let shootingStarEnd = {x: shootingStarStart.x + 250, y: shootingStarStart.y};
            //
            // var points = [shootingStarStart, shootingStarCenter, shootingStarEnd];
            // drawCurveThroughPoints(ctx, points);
            // drawCirclesAlongCurve(ctx, points);

            var renderableValue = background.value;
            if (!iVoLVER.util.isUndefined(background.value) && iVoLVER.util.isNumber(background.value)) {
                renderableValue = background.value.toFixed(2);
            }

            ctx.fillText(renderableValue, center.x, center.y + 3);
        };


        background.onValuesUpdated = function (dataItem) {
            if (dataItem) {

                console.log("dataItem");
                console.log(dataItem);
                let widgetIDs = dataItem.widgetsID.split(",");
                let values = ("" + dataItem.values).split(",");
                let types = ("" + dataItem.types).split(",");
                let index = widgetIDs.indexOf(background.id);

                // // // shooting stars decay
                // if (background.shootingStarsDict) {
                //     for (const [key, value] of Object.entries(background.shootingStarsDict)) {
                //         background.shootingStarsDict[key].array && background.shootingStarsDict[key].array.forEach(function (shootingStar) {
                //             console.log("shooting star decay");
                //             shootingStarsDecay(background, namedSymbols[key]);
                //         });
                //     }
                // }

                let shootingStarsSource;
                shootingStarsSource = parseShootingStarsSource(dataItem.parentStatement);

                if (!shootingStarsSource && dataItem.grandParentStatement)
                    shootingStarsSource = parseShootingStarsSource(dataItem.grandParentStatement);

                console.log("Shooting star source is: " + shootingStarsSource);
                if (shootingStarsSource && shootingStarsSource != background.name) {
                    generateShootingStars(background, namedSymbols[shootingStarsSource]);
                }

                if (types[index] == "SimpleAssignmentExpression" || types[index] == "PostDecrementExpression" || types[index] == "PreDecrementExpression" || types[index] == "PostIncrementExpression") {
                    if (background.value != values[index]) {
                        background.timeOfChange = background.currentTime;
                    }
                    background.setValue(values[index]);
                    background.setFile(dataItem.file);
                    background.setLineNumber(dataItem.line);
                    //background.setLabel(background.fileName + ' (' + background.lineNumber + ')');
                }

                //background.updateColorDecay();
            }

//            if (dataItem) {
//                background.setValue(dataItem.value);
//                background.setFile(dataItem.file);
//                background.setLineNumber(dataItem.line);
//                background.setLabel(background.fileName + ' (' + background.lineNumber + ')');
//            }
        };

        background.updateColorDecay = function () {
            let colorDecay = getColorDecayAtTime(background.currentTime, background.timeOfChange, '#414141');

            if (colorDecay[0] == "#ffNaNNaN") {
                colorDecay = [background.fill, 1];
            }

            let colorValue = colorDecay[0];
            let strokeWidth = colorDecay[1];

            background.set('fontColor', colorValue);

            if (colorValue == '#414141') {
                colorValue = '#DFE3B3';
            }

            let connectionPort = background.widget.ports["right"];
            connectionPort.showColorDecay(colorValue, strokeWidth);
            //connectionPort.set('fill', colorValue);
        };

        background.onReferenced = function (reference) {
            if (reference) {
                if (window.jsHandler) {
                    var line = reference.line - 1;
                    console.log("line: " + line);

                    window.jsHandler.getEditorState({id: background.id}).then(function (response) {
                        var fileName = response.fileName;

                        if (window.jsHandler.setEvaluatedLine) {


                            window.jsHandler.setEvaluatedLine({lineNumber: line}).then(function (response) {

                                var args = {
                                    mainColor: '#add8e6',
                                    opacity: 0.75,
                                    startLine: line,
                                    endLine: line,
                                    file: fileName,
                                    lineNumber: line,
                                    animate: false,
                                    newDispatcher: true,
                                    id: ''
                                };
                                window.jsHandler.goTo(args);


                            });
                        }
                    });
                }
            }
        };

        background.createSliderMarks = function () {

//            var times = background.history.map(function (item) {
//                    return item[window.sliderDimension];
//            });

            let times = new Array();
            let colors = new Array();


            background.history.forEach(function (dataItem) {


//                console.log(dataItem);

                let types = ("" + dataItem.types).split(",");

                let values = ("" + dataItem.values).split(",");

                if (types.length == 1) {
                    let onlyType = types[0];
                    let onlyValue = values[0];
                    //if (onlyType == "SimpleAssignmentExpression" || onlyType == "PostDecrementExpression" || onlyType == "PreDecrementExpression" || onlyType == "PostIncrementExpression") {
                    times.push(dataItem[window.sliderDimension]);
                    colors.push(getSliderMarkColor(onlyValue, onlyType));
                    //}
                }

            });


            var html = '';
            //var pepe = '';
            times.forEach(function (time, index) {
                var left = convertToPercent(time);
                let color = colors[index];
                //pepe += left + '% ';
//                html += '<span class="sliderMark ' + background.id + '" style="opacity: 0; background: ' + background.stroke + '; left: ' + left + '%;" />';                
                html += '<span class="sliderMark ' + background.id + '" style="opacity: 0; background: ' + color + '; left: ' + left + '%;" />';
            });
            sliderMarksElements += html;
            sliderMarksElement.append(html);
        }

        background.registerListener('selected', function (options) {
            removeAllSliderMarks();
            background.showSliderMarks();
        });

        background.registerListener('unselected', function (options) {
            background.hideSliderMarks();
        });

        background.registerListener('mousedblclick', function (options) {
            //alert("event:mousedblclick");
        });

        background.addInteractionEvents = function () {
            var movementInteractionEvent = new MovementInteractionEvent({
                parent: background
            });

            var disappearanceInteraction = new DisappearanceInteractionEvent({
                parent: background
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'bottom'};

            let scaleX, scaleY, opacity;

            scaleX = 0;
            scaleY = 0;
            opacity = 0;

            background.addChild(disappearanceInteraction, {
                whenCompressed: {
                    x: 0, y: -3,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: -3,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.addChild(movementInteractionEvent, {
                whenCompressed: {
                    x: 0, y: -23,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: -23,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            canvas.add(movementInteractionEvent);
            canvas.add(disappearanceInteraction);
            background.movementInteractionEvent = movementInteractionEvent;
            background.disappearanceInteractionEvent = disappearanceInteraction;

            background.registerListener('mouseup', function (event) {
                var rightClick = (event.e.which) ? (event.e.which == 3) : (event.e.which == 2);

                if (rightClick) {
                    background.expandedOptions[background.movementInteractionEvent.id].scaleX = 1;
                    background.expandedOptions[background.movementInteractionEvent.id].scaleY = 1;
                    background.expandedOptions[background.movementInteractionEvent.id].opacity = 1;

                    background.compressedOptions[background.movementInteractionEvent.id].scaleX = 1;
                    background.compressedOptions[background.movementInteractionEvent.id].scaleY = 1;
                    background.expandedOptions[background.movementInteractionEvent.id].opacity = 1;

                    background.expandedOptions[background.disappearanceInteractionEvent.id].scaleX = 1;
                    background.expandedOptions[background.disappearanceInteractionEvent.id].scaleY = 1;
                    background.expandedOptions[background.disappearanceInteractionEvent.id].opacity = 1;

                    background.compressedOptions[background.disappearanceInteractionEvent.id].scaleX = 1;
                    background.compressedOptions[background.disappearanceInteractionEvent.id].scaleY = 1;
                    background.expandedOptions[background.disappearanceInteractionEvent.id].opacity = 1;

                    background.expand();
                    background.positionObjects();

                }
            });

            background.registerListener('deselected', function (options) {
                if (!background.doNotCompressWhenCanvasClicked) {
                    background.expandedOptions[background.movementInteractionEvent.id].scaleX = 0;
                    background.expandedOptions[background.movementInteractionEvent.id].scaleY = 0;
                    background.expandedOptions[background.movementInteractionEvent.id].opacity = 0;

                    background.compressedOptions[background.movementInteractionEvent.id].scaleX = 0;
                    background.compressedOptions[background.movementInteractionEvent.id].scaleY = 0;
                    background.expandedOptions[background.movementInteractionEvent.id].opacity = 0;

                    background.expandedOptions[background.disappearanceInteractionEvent.id].scaleX = 0;
                    background.expandedOptions[background.disappearanceInteractionEvent.id].scaleY = 0;
                    background.expandedOptions[background.disappearanceInteractionEvent.id].opacity = 0;

                    background.compressedOptions[background.disappearanceInteractionEvent.id].scaleX = 0;
                    background.compressedOptions[background.disappearanceInteractionEvent.id].scaleY = 0;
                    background.expandedOptions[background.disappearanceInteractionEvent.id].opacity = 0;

                    background.compress({duration: theWidget.expandCompressDuration});
                    background.positionObjects();

                    if (!iVoLVER.util.isUndefined(theWidget.startLine) && !iVoLVER.util.isUndefined(theWidget.endLine)) {
                        if (window.jsHandler && window.jsHandler.onObjectDeselected) {
                            window.jsHandler.onObjectDeselected({id: background.id}).then(function (response) {
                                console.log(response);
                            });
                        }
                    }
                }
            });
        }

        background.addInteractionEvents();

        this.addProgvolverSymbolName = function () {
            var background = this;

            var styles = {
                0: {}
            };

            for (var i = 0; i < this.dataType.length; i++) {
                styles['0']['' + i] = {fill: 'rgb(0,0,255)'};
            }
            for (var i = this.dataType.length + 1; i < this.dataType.length + 1 + this.name.length; i++) {
                styles['0']['' + i] = {fontWeight: 'bold', fill: 'rgb(0,0,0)'};
            }

            var nameObject = new fabric.Text(this.dataType + " " + this.name, {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white',
                selectable: false,
                eventable: false,
                styles: styles
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'bottom'};

            let scaleX, scaleY, opacity;

            if (this.isMember || options.isPartOfSnapshot) {
                scaleX = 0;
                scaleY = 0;
                opacity = 0;
            } else {
                scaleX = 1;
                scaleY = 1;
                opacity = 1;
            }

            background.addChild(nameObject, {
                whenCompressed: {
                    x: 0, y: -3,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: -3,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            nameObject.on('changed', function () {
                background.positionObject(nameObject);
            });
//            nameObject.on('editing:entered', function () {
//                nameObject.set('backgroundColor', 'rgba(255,255,255,0.9)');
//            });
//            nameObject.on('editing:exited', function () {
//                nameObject.set('backgroundColor', '');
//            });

            this.nameObject = nameObject;
            background.children.push(nameObject);
            background.nameObject = nameObject;
            this.childrenOnTop.push(nameObject);

            canvas.add(nameObject);

        };


        this.addKind = function () {
            var background = this;
            var text = this.kind;

            if (text == 'Parameter' && this.containingProgvolverSymbol && this.containingNamespace) {
                text = this.containingProgvolverSymbol && this.containingProgvolverSymbol != '' ? text + ' @ ' + replaceAll(this.containingProgvolverSymbol, this.containingNamespace + ".", "") : text;
                text = text.substring(0, text.indexOf('('));
            } else {
                text = this.containingType && this.containingType != '' ? text + ' @ ' + this.containingType : text;
            }


            var kindObject = new fabric.IText(text, {
                fontFamily: 'Helvetica',
                fill: '#777',
                padding: 3,
                fontSize: 14,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white',
            });

            var originParent = {originX: 'center', originY: 'bottom'};
            var originChild = {originX: 'center', originY: 'top'};
            background.addChild(kindObject, {
                whenCompressed: {
                    x: 0, y: 25,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 25,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            kindObject.on('changed', function () {
                background.positionObject(kindObject);
            });
            kindObject.on('editing:entered', function () {
                kindObject.set('backgroundColor', 'rgba(255,255,255,0.9)');
            });
            kindObject.on('editing:exited', function () {
                kindObject.set('backgroundColor', '');
            });

            this.kindObject = kindObject;

            this.childrenOnTop.push(kindObject);

            canvas.add(kindObject);

        };

        this.addName = function () {
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

            var typeObject = new fabric.Text(background.type, {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                lineHeight: 0.8,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'right',
                editingBorderColor: 'white',
                selectable: false,
                eventable: false,
                styles: typeStyle
            });

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};

            background.addChild(typeObject, {
                whenCompressed: {
                    x: -10, y: -5,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -10, y: -5,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            typeObject.on('changed', function () {
                background.positionObject(typeObject);
            });

            var nameObject = new fabric.Text(background.name, {
                fontFamily: 'Helvetica',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                lineHeight: 0.8,
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

            background.addChild(nameObject, {
                whenCompressed: {
                    x: -10, y: 10,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -10, y: 10,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            nameObject.on('changed', function () {
                background.positionObject(nameObject);
            });


            background.nameObject = nameObject;
            background.typeObject = typeObject;

            background.childrenOnTop.push(typeObject);
            background.childrenOnTop.push(nameObject);

            canvas.add(typeObject);
            canvas.add(nameObject);
            background.children.push(background.nameObject);
        }


        if (this.isMember) {
            this.addName();
        } else {
            this.addProgvolverSymbolName();
        }
        //this.addKind();

        this.enable = function () {
            var opacity = 1;
            background.set('opacity', opacity);
            //background.kindObject.set('opacity', opacity);
            background.labelObject.set('opacity', opacity);
            background.nameObject.set('opacity', opacity);
        };

        this.disable = function () {
            var opacity = 0.4;
            background.set('opacity', opacity);
//            background.kindObject.set('opacity', opacity);
            background.labelObject.set('opacity', opacity);
            background.nameObject.set('opacity', opacity);
        };

        background.addAll = function () {
            background.expand();
        }

        background.toJson = function () {
            let json = {};

            json['value'] = background.value;
            json['type'] = background.dataType;
            json['name'] = background.name;
            json['file'] = background.file;
            json['fileName'] = background.fileName;
            json['x'] = background.left;
            json['y'] = background.top;
            json['fill'] = background.fill,
                json['kind'] = "ProgvolverSymbol";
            return JSON.stringify(json);
        }

        background.clone = function () {
            return new ProgvolverSymbol({
                value: background.value,
                type: background.dataType,
                name: background.name,
                file: background.file,
                fileName: background.fileName,
                x: 250, y: 250,
                kind: background.kind,
                originalId: background.id,
                doNotAddLabelObject: background.doNotAddLabelObject,
                isPartOfSnapshot: true,
                doNotAddConnectionPorts: true,
                doNotCompressWhenCanvasClicked: true
            })
        }

        console.log("Symbol is: ");
        console.log(background);

        this.progvolverType = "CodeNote";
        if (!this.doNotRegisterObject)
            registerProgvolverObject(this);

        console.log("Adding to persistent entry")
        PERSISTENT_CANVAS_ENTRIES.push(background);
        console.log("Persistent entry is now");
        console.log(PERSISTENT_CANVAS_ENTRIES);
        return background;
    }

    static fromJson(json) {
        console.log("This is being called");

        let obj = new ProgvolverSymbol({
            value: json['value'],
            type: json['type'],
            name: json['name'],
            file: json['file'],
            fileName: json['fileName'],
            x: json['x'], y: json['y'],
            fill: json['fill']
        });

        canvas.add(obj);
    }

}

