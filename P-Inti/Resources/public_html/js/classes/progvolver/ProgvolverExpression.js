class ProgvolverExpression extends ConnectableWidget {
    constructor(options) {

        var symbolFont = '20px Helvetica';

        options.height = options.height || 30;
        options.rx = options.rx || 5;
        options.ry = options.ry || 5;
        options.label = options.label || options.fileName && options.lineNumber ? options.fileName + ' (' + options.lineNumber + ')' : options.fileName || '';
        options.fill = '#e0e0e0';
        options.stroke = '#3b3b3b';
        options.strokeWidth = options.strokeWidth || 2;
        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        var background = super(fabric.Rect, options);

        var theWidget = background.widget;

        this.values = options.values;
        this.dataType = options.type;
        this.containingType = options.containingType;
        this.value = options.value || '';

        this.compressedOptions[theWidget.ports['top'].id].y = -20;
        this.expandedOptions[theWidget.ports['top'].id].y = -20;

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












        background.widget.labelObject.on({
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

        // RELEVANT CODE
        background.setHistory = function () {
            
            console.log("background.id:");
            console.log(background.id);
            
            background.history = window.logData.filter(item => item.widgetsID.indexOf(background.id) != -1);
            
            console.log("background.history:");
            console.log(background.history);
            
            background.afterSettingHistory && background.afterSettingHistory();
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

//            var iVoLVER_Value = createNumberValue({
//                unscaledValue: newValue
//            });
//
//            theWidget.thePorts.forEach(function (port) {
//                port.setValue(iVoLVER_Value, withAnimation);
//            });

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
            ctx.fillStyle = 'rgba(65, 65, 65, ' + background.opacity + ')';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            var renderableValue = background.value;
            if (!iVoLVER.util.isUndefined(background.value) && iVoLVER.util.isNumber(background.value)) {
                renderableValue = background.value.toFixed(2);
            }

            ctx.fillText(renderableValue, center.x, center.y + 3);
        };


        background.onValuesUpdated = function (dataItem) {
            if (dataItem) {              
                                
                let widgetIDs = dataItem.widgetsID.split(",");
                let values = dataItem.values.split(",");
                let index = widgetIDs.indexOf(background.id);

                background.setValue(values[index]);
                background.setFile(dataItem.file);
                background.setLineNumber(dataItem.line);
                background.setLabel(background.fileName + ' (' + background.lineNumber + ')');
            }
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
            
            console.log("****** createSliderMarks ******");
            console.log(background.history);
            console.log("****************");
            
            var times = background.history.map(function (item) {
                return item.time;
            });
            var html = '';
            var pepe = '';
            times.forEach(function (time) {
                var left = convertToPercent(time);
                pepe += left + '% ';
                html += '<span class="sliderMark ' + background.id + '" style="opacity: 0; background: ' + background.stroke + '; left: ' + left + '%;" />';
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


        this.addProgvolverExpressionName = function () {
            var background = this;

            /*for (var i = 0; i < this.dataType.length; i++) {
                styles['0']['' + i] = {fill: 'rgb(0,0,255)'};
            }
            for (var i = this.dataType.length + 1; i < this.dataType.length + 1 + this.name; i++) {
                styles['0']['' + i] = {fontWeight: 'bold', fill: 'rgb(0,0,0)'};
            }*/

            var nameObject = new fabric.IText(this.expression, {
                fontFamily: 'Consolas,monaco,monospace',
                fill: '#333',
                padding: 3,
                fontSize: 16,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white',
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'bottom'};


            background.addChild(nameObject, {
                whenCompressed: {
                    x: 0, y: -3,
                    scaleX: 1, scaleY: 1, opacity: 1,
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

            nameObject.on('changed', function () {
                background.positionObject(nameObject);
            });
            nameObject.on('editing:entered', function () {
                nameObject.set('backgroundColor', 'rgba(255,255,255,0.9)');
            });
            nameObject.on('editing:exited', function () {
                nameObject.set('backgroundColor', '');
            });

            this.nameObject = nameObject;

            this.childrenOnTop.push(nameObject);

            canvas.add(nameObject);

        };


        this.addKind = function () {
            var background = this;
            var text = this.kind;

            if (text == 'Parameter' && this.containingProgvolverExpression && this.containingNamespace) {
                text = this.containingProgvolverExpression && this.containingProgvolverExpression != '' ? text + ' @ ' + replaceAll(this.containingProgvolverExpression, this.containingNamespace + ".", "") : text;
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


        this.addProgvolverExpressionName();
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

        this.progvolverType = "CodeNote";
        registerProgvolverObject(this);


    }
}

