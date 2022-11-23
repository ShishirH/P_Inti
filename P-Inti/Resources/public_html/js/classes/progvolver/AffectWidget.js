class AffectWidget {
    constructor(options) {
        var symbolFont = '12px Helvetica';

        options.height = 44;
        options.width = 140;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = WHEN_WIDGET_FILL;
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;

        options.nonResizable = false;
        options.hasControls = false;
        options.hasBorders = false;
        options.lockScalingX = false;


        options.value = "Affect widget";

        var background = createObjectBackground(fabric.Rect, options);

        background.hMargin = 5;
        background.vMargin = 35;
        background.operation = 'increase';

        this.background = background;
        background.noScaleCache = false;

        this.value = options.value || '';

        background.oldRender = background.render;
        background.render = function (ctx) {
            ctx.save();
            ctx.font = symbolFont;
            background.oldRender(ctx);
            var center = background.getPointByOrigin('right', 'top');
            //ctx.fillText("var name: ", center.x - 60, center.y + 20);

            if (background.signalReceiver) {
                var renderableValue = background.signalReceiver.signalsReceived;
                //ctx.fillText(renderableValue, center.x - 40, center.y + 40);
            }
            ctx.restore();
        };


        var addSignalReceiver = function () {
            var signalReceiver = new SignalReceiverWidget({
                fill: '#FED9A6',
                background: background,
                isAffectWidget: true
            });

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};


            background.addChild(signalReceiver, {
                whenCompressed: {
                    x: -4, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -4, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            signalReceiver.bringToFront();
            background.signalReceiver = signalReceiver;
        };

        addSignalReceiver();

        var addOutputPort = function () {
            var outputWidget = new SignalEmitterWidget({
                fill: 'rgb(150, 190, 29, 1)',
                background: background,
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
        }

        addOutputPort();

        this.addOperations = function (options) {
            var events = [
                {val: 'increase', text: 'Increase'},
                {val: 'decrease', text: 'Decrease'},
                {val: 'reset', text: 'Reset'}
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
                background.operation = selectDropdown[0].value;
            });

            var positionDropdown = function () {
                /*console.log(background.getScaledWidth());
                 console.log(background.getScaledHeight());*/
                var sc = getScreenCoordinates(background.getPointByOrigin('left', 'top'));
                var offset = $('#canvasContainer').offset();
                var zoom = canvas.getZoom();
                var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
                var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
                var newTop = sc.y + (background.strokeWidth / 2) * zoom;

                selectDropdown.css({
                    'transform-origin': 'top left',
                    transform: 'scale(' + canvas.getZoom() + ', ' + canvas.getZoom() + ')',
                    left: newLeft + (5 * canvas.getZoom()) + 'px',
                    top: newTop + (7 * canvas.getZoom()) + 'px',
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

        this.addOperations(options);

        background.registerListener('added', function (options) {
            canvas.add(background.signalReceiver);
            canvas.add(background.outputPort);
            background.positionHtmlObjects();
            background.positionObjects();
        });

        this.progvolverType = "CodeNote";
        registerProgvolverObject(this);

        return this.background;
    }
}