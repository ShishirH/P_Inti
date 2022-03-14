class LollipopPlot extends ConnectableWidget {
    constructor(options) {

        options.doNotAddConnectionPorts = true;
        options.cornerSize = 9;
        options.label = options.label || options.fileName ? options.fileName + " (" + (options.startLine + 1) + " - " + (options.endLine + 1) + ")" : '';
        var background = super(fabric.Rect, options);
        var theWidget = background.widget;

        background.symbols = new Array();

        let margin = {top: 15, right: 20, bottom: 30, left: 35};
        let xScale, yScale, colorScale, xAxisGenerator, xAxis, yAxisGenerator, yAxis;
        background.grayOutData = null;
        background.allData = null;

        background.widget.labelObject.on({
            mouseup: function (options) {
                deselectAllObjects();
                background.fire('selected');

                if (!iVoLVER.util.isUndefined(background.startLine) && !iVoLVER.util.isUndefined(background.endLine)) {
                    if (window.jsHandler) {
                        if (window.jsHandler.goTo) {
                            var args = {
                                id: background.id,
                                mainColor: background.fill,
                                startLine: background.startLine,
                                endLine: background.endLine,
                                file: background.file,
                                lineNumber: background.lineNumber,
                                animate: true,
                                newDispatcher: true,
                                opacity: 0.25
                            };
                            //console.log(args);
                            window.jsHandler.goTo(args);
                        }
                    }
                }
            },
        });

        this.expandCompressDuration = 100;
        this.hMargin = 5;
        this.vMargin = 35;
        this.iconWidth = 35;
        this.programElementType = options.programElementType || ""; // M for method, C for comment, N for note
        this.programElementType = options.programElementType;
        this.drawIconSpace = options.programElementType && options.programElementType != '';
        this.metadata = options.metadata || "";
        this.enterEditing = !options.title;
        this.title = options.title || "[Note's title]";
        this.addWithAnimation = options.addWithAnimation;
        background.oldRender = background._render;
        background._render = function (ctx) {
            background.oldRender(ctx);
            ctx.fillStyle = lighten(ctx.fillStyle, 15);
            ctx.fillRect(-background.width / 2 + background.hMargin / background.scaleX,
                -background.height / 2 + background.hMargin / background.scaleY,
                background.width - 2 * background.hMargin / background.scaleX,
                (background.vMargin - 2 * background.hMargin) / background.scaleY);
            ctx.fillStyle = background.fill;
            if (this.drawIconSpace) {
                ctx.fillRect(background.width / 2 - background.hMargin / background.scaleX - background.iconWidth / background.scaleX - 2,
                    -background.height / 2 + background.hMargin / background.scaleY,
                    background.hMargin / background.scaleX,
                    (background.vMargin - 2 * background.hMargin) / background.scaleY);
            }
        };
        this.changeColor = function (newColor) {
            this.set('fill', newColor);
            this.set('stroke', darken(newColor));
            this.set('cornerColor', lighten(newColor, 15));
            this.set('borderColor', lighten(newColor, 10));
            this.set('cornerStrokeColor', darken(newColor));
            this.icon.set('fill', this.stroke);
            this.plottingDiv.css('border', this.stroke + ' 1px solid');
            this.widget.thePorts && this.widget.thePorts.forEach(function (port) {
                port.set('fill', newColor);
                port.set('stroke', darken(darken(newColor)));
            });
            this.inputPort.set('fill', newColor);
            this.inputPort.set('stroke', darken(darken(newColor)));
        };


        this.setUpD3 = function (plottingDiv, data, svg, availableWidth, availableHeight, xCoord) {
            let width = availableWidth - margin.left - margin.right,
                height = availableHeight - margin.top - margin.bottom;

            svg.attr("width", plottingDiv.width())
                .attr("height", plottingDiv.height())
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            let minX = d3.min(data, d => d[xCoord]);
            let maxX = d3.max(data, d => d[xCoord]);

            xScale = d3.scaleLinear()
                .range([0, width])
                .domain([minX, maxX]);

            xAxisGenerator = d3.axisBottom(xScale);
            xAxis = svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(xAxisGenerator);

            xAxis.selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            var minValue = d3.min(data, d => d.values);
            var maxValue = d3.max(data, d => d.values);

            console.log("MinY is: ");
            console.log(minValue);

            console.log("MaxY: ");
            console.log(maxValue);

            yScale = d3.scaleLinear()
                .domain([minValue, maxValue])
                .range([height, 0]);

            yAxisGenerator = d3.axisLeft(yScale).ticks(3);
            yAxis = svg.append("g").call(yAxisGenerator);

            colorScale = d3.scaleOrdinal()
                .domain(background.symbols)
                .range(d3.schemeCategory10);

            svg.append("line")
                .attr("class", "zeroLine")
                .attr("x1", xScale(minX))
                .attr("x2", xScale(maxX))
                .attr("y1", 0)
                .attr("y2", 0)
                .attr("stroke", 'grey')
        }

        // this.setUpD3 = function (plottingDiv, data, svg, availableWidth, availableHeight, xCoord) {
        //
        //     let width = availableWidth - margin.left - margin.right,
        //         height = availableHeight - margin.top - margin.bottom;
        //
        //     svg.attr("width", plottingDiv.width())
        //         .attr("height", plottingDiv.height())
        //         .append("g")
        //         .attr("transform",
        //             "translate(" + margin.left + "," + margin.top + ")");
        //
        //     let minX = d3.min(data, d => d[xCoord]);
        //     let maxX = d3.max(data, d => d[xCoord]);
        //
        //     xScale = d3.scaleLinear()
        //         .range([0, width])
        //         .domain([minX, maxX]);
        //
        //     xAxisGenerator = d3.axisBottom(xScale);
        //     xAxis = svg.append("g")
        //         .attr("transform", "translate(0," + height + ")")
        //         .call(xAxisGenerator);
        //
        //     xAxis.selectAll("text")
        //         .attr("transform", "translate(-10,0)rotate(-45)")
        //         .style("text-anchor", "end");
        //
        //     var minValue = d3.min(data, d => d.value);
        //     var maxValue = d3.max(data, d => d.value);
        //     yScale = d3.scaleLinear()
        //         .domain([minValue, maxValue])
        //         .range([height, 0]);
        //
        //     yAxisGenerator = d3.axisLeft(yScale).ticks(3);
        //     yAxis = svg.append("g").call(yAxisGenerator);
        //
        //     colorScale = d3.scaleOrdinal()
        //         .domain(background.symbols)
        //         .range(d3.schemeCategory10);
        //
        //     svg.append("line")
        //         .attr("class", "zeroLine")
        //         .attr("x1", xScale(minX))
        //         .attr("x2", xScale(maxX))
        //         .attr("y1", 0)
        //         .attr("y2", 0)
        //         .attr("stroke", 'grey')
        //
        //
        // }

        this.updatePlot = function (svg, data, newWidth, newHeight, doNotAnimate, xCoord) {
           console.log("data:");
           console.log(data);

            let duration = doNotAnimate ? 0 : 500;

//                console.log(data);

            let width = newWidth - margin.left - margin.right;
            let height = newHeight - margin.top - margin.bottom;

            let minX = d3.min(data, d => d[xCoord]);
            let maxX = d3.max(data, d => d[xCoord]);

//                console.log(minX, maxX);

            if (!xScale)
                return;

            xScale.range([0, width])
                //                        .domain([0, maxX]);
                .domain([minX, maxX]);

            xAxisGenerator.scale(xScale);
            xAxis.attr("transform", "translate(0," + height + ")")
                .transition().duration(duration).call(xAxisGenerator)

            xAxis.selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            let minValue = d3.min(data, d => d.values);
            let maxValue = d3.max(data, d => d.values);

            var onlyPositives = minValue > 0 && maxValue > 0;
            var onlyNegatives = minValue < 0 && maxValue < 0;

            yScale.domain([minValue, maxValue])
                .range([height, 0]);
            yAxis.transition().duration(duration).call(yAxisGenerator.scale(yScale));

            svg.selectAll("line.zeroLine")
                .transition().duration(duration)
                .attr("x1", xScale(minX))
                .attr("x2", xScale(maxX))
                .attr("y1", yScale(0))
                .attr("y2", yScale(0))
                .attr("opacity", !onlyPositives && !onlyNegatives ? 1 : 0)

            var linesJoin = svg.selectAll("line.pancho")
                .data(data);

            function endPoint(d) {
                var value = 0;
                if (onlyPositives) {
                    value = minValue;
                } else if (onlyNegatives) {
                    value = maxValue;
                }
                return yScale(value);
            }

            linesJoin.enter()
                .append("line")
                .classed("pancho", true)
                .attr("opacity", 0)
                .attr("x1", d => xScale(d[xCoord]))
                .attr("x2", d => xScale(d[xCoord]))
                .attr("y1", d => endPoint(d))
                .attr("y2", d => endPoint(d))
                .attr("stroke", d => darken(colorScale(d.symbolName)))
                .attr("stroke-width", 0.25)
                .transition()
                .duration(duration)
                .attr("y2", d => yScale(d.values))
                .attr("opacity", 1)

            // update
            linesJoin
                .transition()
                .duration(duration)
                .attr("x1", d => xScale(d[xCoord]))
                .attr("x2", d => xScale(d[xCoord]))
                .attr("y1", d => yScale(d.values))
                .attr("y2", d => endPoint(d))
                .attr("stroke", d => darken(colorScale(d.symbolName)))

            // lines that have to be removed
            linesJoin.exit()
                .transition()
                .duration(duration)
                .attr("opacity", 0)
                .remove()









            let circlesJoin = svg.selectAll("circle.pepe")
                .data(data);

            circlesJoin.enter()
                .append("circle")
                .classed("pepe", true)
                .attr("opacity", 0.5)
                .attr("cx", d => xScale(d[xCoord]))
                .attr("cy", d => endPoint(d))
                .attr("r", "2")
                .style("fill", d => colorScale(d.symbolName))
                .attr("stroke", d => darken(colorScale(d.symbolName)))
                .attr("stroke-width", 0.5)
                .transition()
                .duration(duration)
                .attr("cy", d => yScale(d.values))
                .attr("opacity", 1)


            circlesJoin
                .transition()
                .duration(duration)
                .attr("cx", d => xScale(d[xCoord]))
                .attr("cy", d => yScale(d.values))
                .style("fill", d => colorScale(d.symbolName))
                .attr("stroke", d => darken(colorScale(d.symbolName)))

            circlesJoin.exit()
                .transition()
                .duration(duration)
                .attr("opacity", 0)
                .remove()

        }

        this.updatePlotWithCurrentTime = function (svg, data, grayOutData, allValues, newWidth, newHeight, doNotAnimate, xCoord) {
            console.log("data is: ");
            console.log(data);
            console.log("Grayout");
            console.log(grayOutData);
            console.log("alldata");
            console.log(allValues);
            let duration = doNotAnimate ? 0 : 500;

            let width = newWidth - margin.left - margin.right;
            let height = newHeight - margin.top - margin.bottom;

            let dataToBeDisplayed;

            if (allValues && allValues.length !== 0) {
                dataToBeDisplayed = allValues;
            } else {
                dataToBeDisplayed = data;
            }

            let minX = d3.min(dataToBeDisplayed, d => d[xCoord]);
            let maxX = d3.max(dataToBeDisplayed, d => d[xCoord]);

            if (!xScale)
                return;

            xScale.range([0, width])
                .domain([minX, maxX]);

            xAxisGenerator.scale(xScale);
            xAxis.attr("transform", "translate(0," + height + ")")
                .transition().duration(duration).call(xAxisGenerator)

            xAxis.selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");

            let minValue = d3.min(dataToBeDisplayed, d => d.values);
            let maxValue = d3.max(dataToBeDisplayed, d => d.values);

            var onlyPositives = minValue > 0 && maxValue > 0;
            var onlyNegatives = minValue < 0 && maxValue < 0;

            yScale.domain([minValue, maxValue])
                .range([height, 0]);
            yAxis.transition().duration(duration).call(yAxisGenerator.scale(yScale));

            svg.selectAll("line.zeroLine")
                .transition().duration(duration)
                .attr("x1", xScale(minX))
                .attr("x2", xScale(maxX))
                .attr("y1", yScale(0))
                .attr("y2", yScale(0))
                .attr("opacity", !onlyPositives && !onlyNegatives ? 1 : 0)

            var currentLines = svg.selectAll("line.pancho")
                .data(data);

            function endPoint(d) {
                var value = 0;
                if (onlyPositives) {
                    value = minValue;
                } else if (onlyNegatives) {
                    value = maxValue;
                }
                return yScale(value);
            }

            currentLines.enter()
                .append("line")
                .classed("pancho", true)
                .attr("opacity", 0)
                .attr("x1", d => xScale(d[xCoord]))
                .attr("x2", d => xScale(d[xCoord]))
                .attr("y1", d => endPoint(d))
                .attr("y2", d => endPoint(d))
                .attr("stroke", d => darken(colorScale(d.symbols)))
                .attr("stroke-width", 0.5)
                .transition()
                .duration(duration)
                .attr("y2", d => yScale(d.values))
                .attr("opacity", 1)

            if (background.grayOutData && background.grayOutData.length != 0) {

                console.log("Entering here!");
                var grayOutLines = svg.selectAll("line.pancho")
                    .data(grayOutData);

                grayOutLines.enter()
                    .append("line")
                    .classed("pancho", true)
                    .attr("opacity", 0)
                    .attr("x1", d => xScale(d[xCoord]))
                    .attr("x2", d => xScale(d[xCoord]))
                    .attr("y1", d => endPoint(d))
                    .attr("y2", d => endPoint(d))
                    .attr("stroke", d => "gray")
                    .attr("stroke-width", 0.25)
                    .transition()
                    .duration(duration)
                    .attr("y2", d => yScale(d.values))
                    .attr("opacity", 1)

                grayOutLines
                    .transition()
                    .duration(duration)
                    .attr("x1", d => xScale(d[xCoord]))
                    .attr("x2", d => xScale(d[xCoord]))
                    .attr("y1", d => yScale(d.values))
                    .attr("y2", d => endPoint(d))
                    .attr("stroke", d => darken(colorScale(d.symbols)))


                // lines that have to be removed
                grayOutLines.exit()
                    .transition()
                    .duration(duration)
                    .attr("opacity", 0)
                    .remove()

                let grayCircles = svg.selectAll("circle.pepe")
                    .data(grayOutData);

                grayCircles.enter()
                    .append("circle")
                    .classed("pepe", true)
                    .attr("opacity", 0.5)
                    .attr("cx", d => xScale(d[xCoord]))
                    .attr("cy", d => endPoint(d))
                    .attr("r", "2")
                    .style("fill", d => "gray")
                    .attr("stroke", d => darken("gray"))
                    .attr("stroke-width", 0.5)
                    .transition()
                    .duration(duration)
                    .attr("cy", d => yScale(d.values))
                    .attr("opacity", 1)


                grayCircles
                    .transition()
                    .duration(duration)
                    .attr("cx", d => xScale(d[xCoord]))
                    .attr("cy", d => yScale(d.values))
                    .style("fill", d => "gray")
                    .attr("stroke", d => darken("gray"))

                grayCircles.exit()
                    .transition()
                    .duration(duration)
                    .attr("opacity", 0)
                    .remove()
            } else {
                console.log("Not entering here");
            }

            // update
            currentLines
                .transition()
                .duration(duration)
                .attr("x1", d => xScale(d[xCoord]))
                .attr("x2", d => xScale(d[xCoord]))
                .attr("y1", d => yScale(d.values))
                .attr("y2", d => endPoint(d))
                .attr("stroke", d => darken(colorScale(d.symbolName)))


            // lines that have to be removed
            currentLines.exit()
                .transition()
                .duration(duration)
                .attr("opacity", 0)
                .remove()

            let circlesJoin = svg.selectAll("circle.pepe")
                .data(data);

            circlesJoin.enter()
                .append("circle")
                .classed("pepe", true)
                .attr("opacity", 0.5)
                .attr("cx", d => xScale(d[xCoord]))
                .attr("cy", d => endPoint(d))
                .attr("r", "2")
                .style("fill", d => colorScale(d.symbolName))
                .attr("stroke", d => darken(colorScale(d.symbolName)))
                .attr("stroke-width", 0.5)
                .transition()
                .duration(duration)
                .attr("cy", d => yScale(d.values))
                .attr("opacity", 1)


            circlesJoin
                .transition()
                .duration(duration)
                .attr("cx", d => xScale(d[xCoord]))
                .attr("cy", d => yScale(d.values))
                .style("fill", d => colorScale(d.symbolName))
                .attr("stroke", d => darken(colorScale(d.symbolName)))

            circlesJoin.exit()
                .transition()
                .duration(duration)
                .attr("opacity", 0)
                .remove()

        }

        this.addPlottingArea = function (options) {

            var background = this;
            var hMargin = this.hMargin;
            var vMargin = this.vMargin;

            background.selector = "div_" + background.id;

            var plottingDiv = $('<div />', {id: background.selector})
                .css({
                    position: "absolute",
                    'background-color': 'rgba(255,255,255,0.9)',
                    outline: 'none',
                    'box-shadow': 'none',
                    border: background.stroke + ' 1px solid',
                    'border-radius': '0px',
                    'font-size': '16px',
                    resize: 'none',
                })
                .appendTo("body")
                .addClass('scalable');


            this.addContextMenu(background.selector);






            var svg = d3.select("#" + background.selector)
                .append("svg")
                .attr("overflow", "visible")
                .attr("width", plottingDiv.width())
                .attr("height", plottingDiv.height())
                .append("g")
                .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

            background.svg = svg;

            //background.setUpD3(plottingDiv, plotterData, svg, plottingDiv.width(), plottingDiv.height(), background.currentXCoord);

            var positionTextArea = function () {

                /*console.log(background.getScaledWidth());
                 console.log(background.getScaledHeight());*/
                let sc = getScreenCoordinates(background.getPointByOrigin('left', 'top'));
                let offset = $('#canvasContainer').offset();
                let zoom = canvas.getZoom();
                let borderWidth = parseFloat(plottingDiv.css('borderWidth'));
                let newLeft = sc.x + (offset.left + hMargin + background.strokeWidth / 2 - borderWidth) * zoom;
                let newTop = sc.y + (vMargin + background.strokeWidth / 2) * zoom;
                let newWidth = (background.getScaledWidth() - hMargin * 2 - background.strokeWidth);
                let newHeight = (background.getScaledHeight() - vMargin - hMargin - background.strokeWidth);
                plottingDiv.css({
                    'transform-origin': 'top left',
                    transform: 'scale(' + zoom + ', ' + zoom + ')',
                    left: newLeft + 'px',
                    top: newTop + 'px',
                    width: newWidth + 'px',
                    height: newHeight + 'px',
                });

                background.updatePlotWithCurrentTime(svg, background.currentData, background.grayOutData, background.allData, newWidth, newHeight, true, background.currentXCoord);
            };

            this.plottingDiv = plottingDiv;
            background.addHtmlChild(plottingDiv, positionTextArea);
        };
        this.addTitle = function () {
            var background = this;
            var titleObject = new fabric.IText(this.title, {
                fontFamily: 'Helvetica',
                fill: '#333',
                fontSize: 14,
                fontWeight: 'bold',
                padding: 3,
                hasControls: false,
                borderColor: 'white',
                textAlign: 'left',
                editingBorderColor: 'white'
            });
            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};
            background.addChild(titleObject, {
                whenCompressed: {
                    x: this.hMargin + 3, y: 10,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: this.hMargin + 3, y: 10,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            titleObject.on('changed', function () {
                background.positionObject(titleObject);
            });
            titleObject.on('editing:entered', function () {
                titleObject.set('backgroundColor', 'rgba(255,255,255,0.9)');
            });
            titleObject.on('editing:exited', function () {
                titleObject.set('backgroundColor', '');
            });
            background.titleObject = titleObject;
            this.childrenOnTop.push(titleObject);
            if (this.enterEditing) {
                titleObject.on('added', function (options) {
                    titleObject.selectionStart = 0;
                    titleObject.selectionEnd = titleObject.text.length;
                    titleObject.enterEditing();
                });
            }

            canvas.add(titleObject);
        };
        this.setIconLetter = function (letter) {
            this.programElementType = letter;
            this.icon.set('text', this.programElementType);
        }

        this.getAwailablePlottingDimensions = function () {
            var newWidth = (background.getScaledWidth() - background.hMargin * 2 - background.strokeWidth);
            var newHeight = (background.getScaledHeight() - background.vMargin - background.hMargin - background.strokeWidth);
            return {w: newWidth, h: newHeight};
        }

        this.getDataOfSymbol = function (symbolName) {


            return background.histories[symbolName];

//            return plotterData.filter(item => item.symbolName == symbolName);
        }

        this.addContextMenu = function (selector) {

            var background = this;

            var plotter = iVoLVER.getObjectByID(background.id);
            var hexColor = new fabric.Color(plotter.fill);
            var hexColorString = "#" + hexColor.toHex();

            var items = {};



            items.showSubMenu = {
                name: "Show...",
                items: {}
            };


            background.symbols.forEach(function (symbol) {
                items.showSubMenu.items[symbol] = {
                    name: symbol,
                    type: 'checkbox',
//                    selected: symbol == 'symbol1', // TMP
                    selected: true, // TMP
                    events: {
                        click: function (e) {

                            var symbolName = replaceAll(e.target.name, "context-menu-input-", "");

//                            let newWidth = (background.getScaledWidth() - background.hMargin * 2 - background.strokeWidth);
//                            let newHeight = (background.getScaledHeight() - background.vMargin - background.hMargin - background.strokeWidth);

                            var size = background.getAwailablePlottingDimensions();
                            let newWidth = size.w;
                            let newHeight = size.h;

                            if (!e.target.checked) {
                                // we need to remove the data of this symbol
                                background.currentData = background.currentData.filter(item => item.symbolName != symbolName);
                            } else {

//                                var symbolData = plotterData.filter(item => item.symbolName == symbolName);
                                var symbolData = background.getDataOfSymbol(symbolName);
                                // we need to add the data of this symbol
                                background.currentData = background.currentData.concat(symbolData);
                            }

                            background.updatePlotWithCurrentTime(background.svg, background.currentData, background.grayOutData, background.allData, newWidth, newHeight, false, background.currentXCoord);

                        }
                    }
                };
            });
            items.sep2 = "---------";

            items.xAxisSubMenu = {
                name: "x Axis",
                items: {
                    radio1: {
                        name: "Time",
                        type: 'radio',
                        radio: 'xAxisRadio',
                        value: '1',
                        selected: true
                    },
//                    radio3: {
//                        name: "Global Index",
//                        type: 'radio',
//                        radio: 'xAxisRadio',
//                        value: '3'
//                    },
                    radio2: {
                        name: "Local Index",
                        type: 'radio',
                        radio: 'xAxisRadio',
                        value: '2'
                    }
                }
            };

            Object.keys(items.xAxisSubMenu.items).forEach(function (radioItemKey) {
                var radioItem = items.xAxisSubMenu.items[radioItemKey];
                radioItem.events = {
                    click: function (e) {
                        var val = e.target.value;
                        if (val == 1) {
                            background.currentXCoord = "time";
                        } else if (val == 2) {
                            background.currentXCoord = "localIndex";
                        } else if (val == 3) {
                            background.currentXCoord = "globalIndex";
                        }

                        let size = background.getAwailablePlottingDimensions();
                        let newWidth = size.w;
                        let newHeight = size.h;

                        console.log(size);

                        background.updatePlotWithCurrentTime(background.svg, background.currentData, background.grayOutData, background.allData, newWidth, newHeight, false, background.currentXCoord);

                    }
                }
            });

            items.sep3 = "---------";

            items.color = {
                "name": "Color",
                items: {
                    colorChooser: {
                        type: 'html',
                        html: '<input class="colorPickerDiv" id="color-picker" value="' + hexColorString + '"/>',
                        icon: function ($element, key, item) {

                            $('#color-picker').spectrum({
                                type: "flat",
                                showInput: false,
                                showAlpha: false,
                                allowEmpty: false,
                                showButtons: false,
                                showPalette: false,
                                show: function (color) {
                                    $('#color-picker').spectrum("reflow");
                                    setTimeout(function () {
                                        $('#color-picker').spectrum("reflow");
                                    }, 500);
                                },
                                move: function (tinycolor) {
                                    var r = Math.round(tinycolor._r);
                                    var g = Math.round(tinycolor._g);
                                    var b = Math.round(tinycolor._b);

                                    var hexColor = new fabric.Color.fromRgb('rgb(' + r + ',' + g + ',' + b + ')');
                                    var hexColorString = "#" + hexColor.toHex();
                                    plotter.changeColor(hexColorString);

                                }
                            });
                            $(".context-menu-item .context-menu-html").css("padding", "0");
                            $(".sp-container").css("padding", "0");
                            $(".sp-container").css("margin", "0");
                            $(".sp-container").css("border", "none");
                            $(".sp-container").css("box-shadow", "none");

                        },

                    }
                },
            };

            $.contextMenu({
                selector: "#" + selector,
                items: items,
                callback: function (key, options) {
                    var m = "clicked: " + key;
                    window.console && console.log(m) || alert(m);
                },
                events: {
                    show: function (opt) {
                        // this is the trigger element
                        var $this = this;
                        // import states from data store



                        var data = $this.data();
                        console.log(opt, data);

                        if (!(Object.keys(data).length === 0 && data.constructor === Object)) {
                            $.contextMenu.setInputValues(opt, $this.data());
                            // this basically fills the input commands from an object
                            // like {name: "foo", yesno: true, radio: "3", &hellip;}
                        }


                    },
                    hide: function (opt) {
                        // this is the trigger element
                        var $this = this;
                        // export states to data store
                        $.contextMenu.getInputValues(opt, $this.data());
                        // this basically dumps the input commands' values to an object
                        // like {name: "foo", yesno: true, radio: "3", &hellip;}
                    }
                },
                trigger: 'none',
            });







        }

        this.addIcon = function () {
            var background = this;
            var icon = new fabric.Text(this.programElementType || '', {
                fontFamily: 'Arial',
                fontSize: 25,
                hasControls: false,
                hasBorders: false,
                textAlign: 'center',
                fontWeight: 'bold',
                eventable: false,
                selectable: false,
                fill: background.stroke,
                hoverCursor: "pointer"
            });
            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'center', originY: 'center'};
            var x = -this.hMargin - this.iconWidth / 2;
            var y = this.hMargin + (this.vMargin - 2 * this.hMargin) / 2;
            background.addChild(icon, {
                whenCompressed: {
                    x: x, y: y,
                    scaleX: 1, scaleY: 1, opacity: 1,
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

            icon.on({
                mousedown: function (options) {
                    var hexColor = new fabric.Color(icon.fill);
                    var hexColorString = "#" + hexColor.toHex();
                    $('#color-picker').val(hexColorString);
                    var element = $("#" + background.selector);
                    element.attr('codeNoteID', background.id);
                    element.contextMenu({x: options.e.pageX, y: options.e.pageY});
                }
            });

            this.icon = icon;
            this.childrenOnTop.push(icon);
            canvas.add(icon);
        };




        this.addInputPort = function () {


            var background = this;
            var theWidget = background.widget;

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};
            var x = -5;
            var y = 0;

            var inputPort = new ConnectionPort({
                radius: 15,
                fill: background.fill,
                stroke: darken(background.stroke),
                strokeWidth: 1,
                opacity: 0,
                background: background,
                hasBorders: false,
                hasControls: false
            });

            background.addChild(inputPort, {
                whenCompressed: {
                    x: x, y: y,
                    originParent: originParent,
                    originChild: originChild,
                    scaleX: 1, scaleY: 1, opacity: 1
                },
                whenExpanded: {
                    x: x, y: y,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });


            inputPort.registerListener('connectionover', function (options) {
                background.fire('selected');
            });

            inputPort.registerListener('connectionout', function (options) {
                background.fire('deselected');
            });

            inputPort.registerListener('selected', function (options) {
                background.fire('selected');
            });

            inputPort.registerListener('deselected', function (options) {
                background.fire('deselected');
            });

            inputPort.acceptConnection = function (theConnector, value) {
                var connectedHistory = theConnector.source.background.history;
                var symbolName = connectedHistory[0].symbolName;

                console.log("connectedHistory BEFORE: ");
                console.log(connectedHistory);


                // Assigning the local index variable
                connectedHistory.forEach(function (element, index) {
                    element.localIndex = index;
                });

                console.log("connectedHistory AFTER: ");
                console.log(connectedHistory);

                background.symbols.push(symbolName);

                background.histories[symbolName] = connectedHistory;

                if (!xScale || background.symbols.length == 1) {
                    background.setUpD3(background.plottingDiv, connectedHistory, background.svg, background.plottingDiv.width(), background.plottingDiv.height(), background.currentXCoord);
                }

//                console.log("background.histories:");
//                console.log(background.histories);


                // this must be an array
                background.currentData = background.currentData.concat(connectedHistory);

                let newWidth = (background.getScaledWidth() - background.hMargin * 2 - background.strokeWidth);
                let newHeight = (background.getScaledHeight() - background.vMargin - background.hMargin - background.strokeWidth);
                background.updatePlotWithCurrentTime(background.svg, background.currentData, background.grayOutData, background.allData, newWidth, newHeight, false, background.currentXCoord);

//                console.log("theConnector.source.values");
//                console.log(theConnector.source.values);
//                console.log("value");
//                console.log(value);

            }

            canvas.add(inputPort);

            background.childrenOnTop.push(inputPort);

            background.inputPort = inputPort;

        }

        background.histories = {};


//        background.currentData = background.getDataOfSymbol("symbol1"); // TMP
//        background.currentData = plotterData;
        background.currentData = new Array();
        background.currentXCoord = 'time';



        this.addInputPort();
        this.addPlottingArea(options);
        this.addTitle();
        this.addIcon();

        background.labelObject.set('text', options.label);
        this.progvolverType = "Plotter";
        registerProgvolverObject(this);



        this.setProgramTime = function (time) {

            var symbolNames = Object.keys(background.histories);

            var valuesToPlot = new Array();
            var grayOutValues = new Array();
            var allValues = new Array();

            symbolNames.forEach(function (symbolName) {
                var symbolHistory = background.histories[symbolName];
                var currentValues = symbolHistory.filter(item => item.time <= time);
                var futureValues = symbolHistory.filter(item => item.time > time);
                valuesToPlot = valuesToPlot.concat(currentValues);
                grayOutValues = grayOutValues.concat(futureValues);
                allValues = allValues.concat(symbolHistory);
            });

            // we need to modify (i.e., filter) the values of what we are showing at this point)
            background.currentData = valuesToPlot;
            background.grayOutData = grayOutValues;
            background.allData = allValues;

            let newWidth = (background.getScaledWidth() - background.hMargin * 2 - background.strokeWidth);
            let newHeight = (background.getScaledHeight() - background.vMargin - background.hMargin - background.strokeWidth);
            background.updatePlotWithCurrentTime(background.svg, background.currentData, background.grayOutData, background.allData, newWidth, newHeight, true, background.currentXCoord);

//            console.log("Aqui version overloaded");

        }

        return this;
    }

}
