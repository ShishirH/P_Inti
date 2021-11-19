class WhenWidget {
    constructor(options) {
        var symbolFont = '17px Helvetica';

        options.height = 44;
        options.width = 220;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = WHEN_WIDGET_FILL;
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;

        options.hasControls = false;
        options.hasBorders = false;

        options.value = "When widget";

        var background = createObjectBackground(fabric.Rect, options, this);

        background.hMargin = 5;
        background.vMargin = 35;
        background.event = 'increases';
        background.children = [];

        this.background = background;
        background.noScaleCache = false;

        this.value = options.value || '';

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = symbolFont;
            ctx.fillStyle = 'rgba(65, 65, 65, ' + background.opacity + ')';
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('left', 'center');

            var renderableValue = "When";
            ctx.fillText(renderableValue, center.x + 8, center.y);
            ctx.restore();
        };


        var addInputPort = function () {
            var inputPort = new WhenSignal({
                fill: '#FED9A6',
                background: background
            });

            var originParent = {originX: 'center', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};


            background.addChild(inputPort, {
                whenCompressed: {
                    x: -35, y: -1,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -35, y: -1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            inputPort.bringToFront();
            background.inputPort = inputPort;
            background.children.push(inputPort);
        };

        addInputPort();

        var addOutputPort = function () {
            var outputWidget = new SignalEmitterWidget({
                fill: 'rgb(150, 190, 29, 1)',
                background: background,
                angle: 90
            });

            var originParent = {originX: 'right', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};


            background.addChild(outputWidget, {
                whenCompressed: {
                    x: 10, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    angle: 90,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 10, y: 0,
                    angle: 90,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            background.outputPort = outputWidget;
            background.children.push(outputWidget);
        }

        addOutputPort();
        //addEvents();

//        this.addEvents = function (options) {
//            var events = [
//                {val: 'increases', text: 'Increases'},
//                {val: 'decreases', text: 'Decreases'},
//                {val: 'changes', text: 'Changes'}
//            ];
//
//
//            var selectDropdown = $('<select/>')
//                    .css({
//                        position: "absolute",
//                        'background-color': 'rgba(255,255,255,0.9)',
//                        outline: 'none',
//                        'box-shadow': 'none',
//                        border: background.stroke + ' 1px solid',
//                        'border-radius': '0px',
//                        'font-size': '12px',
//                        resize: 'both',
//                    })
//                    .focus(function () {
//                        canvas.setActiveObject(background);
//                        background.fire('selected');
//                    })
//                    .appendTo("body")
//                    .addClass('scalable');
//
//
//            $(events).each(function () {
//                selectDropdown.append($("<option>").attr('value', this.val).text(this.text));
//            });
//
//            selectDropdown.change(function (e) {
//                console.log(selectDropdown[0].value);
//                background.event = selectDropdown[0].value;
//            });
//
////            var positionDropdown = function () {
////                /*console.log(background.getScaledWidth());
////                 console.log(background.getScaledHeight());*/
////                var sc = getScreenCoordinates(background.getPointByOrigin('center', 'top'));
////                var offset = $('#canvasContainer').offset();
////                var zoom = canvas.getZoom();
////                var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
////                var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
////                var newTop = sc.y + (background.strokeWidth / 2) * zoom;
////
////                selectDropdown.css({
////                    'transform-origin': 'top left',
////                    transform: 'scale(' + canvas.getZoom() + ', ' + canvas.getZoom() + ')',
////                    left: newLeft + 10 + 'px',
////                    top: newTop + 'px',
////                    width: (background.getScaledWidth() - background.strokeWidth) / 2.2 + 'px',
////                    height: (background.getScaledHeight() - background.strokeWidth) + 'px',
////                });
////            };
//
//
//            var positionDropdown = function () {
//                /*console.log(background.getScaledWidth());
//                 console.log(background.getScaledHeight());*/
//                var sc = getScreenCoordinates(background.getPointByOrigin('center', 'top'));
//                var offset = $('#canvasContainer').offset();
//                var zoom = canvas.getZoom();
//                var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
//                var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
//                var newTop = sc.y + (background.strokeWidth / 2) * zoom;
//
//                selectDropdown.css({
//                    'transform-origin': 'top left',
//                    transform: 'scale(' + canvas.getZoom() + ', ' + canvas.getZoom() + ')',
//                    left: newLeft + 'px',
//                    top: newTop + 'px',
//                    width: (background.getScaledWidth() - background.strokeWidth) / 2.2 + 'px',
//                    height: (background.getScaledHeight() - background.strokeWidth) + 'px',
//                });
//            };
//
//            var sc = getScreenCoordinates(background.getPointByOrigin('center', 'top'));
//            var offset = $('#canvasContainer').offset();
//            var zoom = canvas.getZoom();
//            var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
//            var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
//            var newTop = sc.y + (background.strokeWidth / 2) * zoom;
//
////            console.log("sc");
////            console.log(sc);
////            console.log("offset");
////            console.log(offset);
////            console.log("Zoom");
////            console.log(zoom);
////            console.log("borderWidth");
////            console.log(borderWidth);
////            console.log("newLeft");
////            console.log(newLeft);
////            console.log("newTop");
////            console.log(newTop);
//
//            background.events = selectDropdown;
//            background.addHtmlChild(selectDropdown, positionDropdown);
//            background.positionHtmlObjects();
//        };


        this.addEvents = function (options) {
            var events = [
                {val: 'increases', text: 'Increases'},
                {val: 'decreases', text: 'Decreases'},
                {val: 'changes', text: 'Changes'}
            ];

            var selectDropdown = $('<select/>')
                    .css({
                        position: "absolute",
                        outline: 'none',
                        'box-shadow': 'none',
                        'font': 'Helvetica',
                        'border-radius': '0px',
                        'font-size': '17px',
                        'color': 'rgba(65, 65, 65, 1)',
                        border: background.stroke + ' 1px solid',
                        resize: 'both',
                        'background-color': lighten(background.fill, 10)
                    })
                    .focus(function () {
                        canvas.setActiveObject(background);
                        background.fire('selected');
                    })
                    .appendTo("body")
                    .addClass('scalable');

            $(events).each(function () {
                selectDropdown.append($("<option>").attr('value', this.val).text(this.text));
            });

            selectDropdown.change(function (e) {
                console.log(selectDropdown[0].value);
                background.event = selectDropdown[0].value;
            });

//            selectDropdown.change(function (e) {
//                console.log(selectDropdown[0].value);
//                background.event = selectDropdown[0].value;
//            });

            var positionDropdown = function () {
                /*console.log(background.getScaledWidth());
                 console.log(background.getScaledHeight());*/
                background.setCoords();
                var sc = getScreenCoordinates(background.getPointByOrigin('right', 'top'));
                var offset = $('#canvasContainer').offset();
                var zoom = canvas.getZoom();
                var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
                var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
                var newTop = sc.y + (background.strokeWidth / 2) * zoom;

                selectDropdown.css({
                    'transform-origin': 'top left',
                    transform: 'scale(' + canvas.getZoom() + ', ' + canvas.getZoom() + ')',
                    left: newLeft + (-120 * canvas.getZoom()) + 'px',
                    top: newTop + (6 * canvas.getZoom()) + 'px',
                    width: 110 + 'px',
                    height: 30 + 'px',
                });
            };

            var sc = getScreenCoordinates(background.getPointByOrigin('center', 'top'));
            var offset = $('#canvasContainer').offset();
            var zoom = canvas.getZoom();
            var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
            var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
            var newTop = sc.y + (background.strokeWidth / 2) * zoom;

//            console.log("sc");
//            console.log(sc);
//            console.log("offset");
//            console.log(offset);
//            console.log("Zoom");
//            console.log(zoom);
//            console.log("borderWidth");
//            console.log(borderWidth);
//            console.log("newLeft");
//            console.log(newLeft);
//            console.log("newTop");
//            console.log(newTop);

            background.operations = selectDropdown;
            background.addHtmlChild(selectDropdown, positionDropdown);
            background.positionHtmlObjects();
        };

        this.addEvents(options);

        background.registerListener('added', function (options) {
            canvas.add(background.inputPort);
            canvas.add(background.outputPort);
            background.positionHtmlObjects();
            background.positionObjects();
        });

        this.progvolverType = "CodeNote";
        registerProgvolverObject(this);

        return this.background;
    }
}