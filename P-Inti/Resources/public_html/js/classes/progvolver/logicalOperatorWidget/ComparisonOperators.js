class ComparisonOperators {
    constructor(options) {
        var symbolFont = '17px Helvetica';

        options.height = 44;
        options.width = 110;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = WHEN_WIDGET_FILL;
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;

        options.hasControls = false;
        options.hasBorders = false;

        options.value = "Comparison Operator";

        var background = createObjectBackground(fabric.Rect, options, this);

        background.hMargin = 5;
        background.vMargin = 35;
        background.event = 'increases';
        background.children = [];

        this.background = background;
        background.noScaleCache = false;

        this.value = options.value || '';

        background.currentOperator = "<";

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = symbolFont;
            ctx.fillStyle = 'rgba(65, 65, 65, ' + background.opacity + ')';
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('left', 'center');

            // var renderableValue = background.currentOperator;
            // ctx.fillText(renderableValue, center.x + 22, center.y);
            ctx.restore();
        };

        var addInputPorts = function () {
            var inputPortLeft = new VariableInputConnection({
                background: background,
            });

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};


            background.addChild(inputPortLeft, {
                whenCompressed: {
                    x: -5, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -5, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            var inputPortRight = new VariableInputConnection({
                background: background,
            });

            var originParent = {originX: 'right', originY: 'center'};
            var originChild = {originX: 'left', originY: 'center'};


            background.addChild(inputPortRight, {
                whenCompressed: {
                    x: +5, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: +5, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.inputPortLeft = inputPortLeft;
            background.inputPortRight = inputPortRight;
            background.children.push(inputPortLeft);
            background.children.push(inputPortRight);
        }

        var addOutputPort = function () {
            var outputPort = new LogicalInputConnection({
                background: background,
            });

            var originParent = {originX: 'center', originY: 'bottom'};
            var originChild = {originX: 'center', originY: 'top'};


            background.addChild(outputPort, {
                whenCompressed: {
                    x: 0, y: 5,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 5,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.outputPort = outputPort;
            background.children.push(outputPort);
        }


        addInputPorts();
        addOutputPort();
        //addEvents();

        this.addEvents = function (options) {
            var events = [
                {val: '<', text: '<'},
                {val: '>', text: '>'},
                {val: '>=', text: '>='},
                {val: '<=', text: '<='},
                {val: '==', text: '=='},
            ];

            var selectDropdown = $('<select/>')
                .css({
                    position: "absolute",
                    outline: 'none',
                    'box-shadow': 'none',
                    'font': 'Helvetica',
                    'border-radius': '0px',
                    'font-size': '17px',
                    'text-align-last': 'center',
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
                background.currentOperator = selectDropdown[0].value;
            });

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
                    left: newLeft + (-92 * canvas.getZoom()) + 'px',
                    top: newTop + (6 * canvas.getZoom()) + 'px',
                    width: 70 + 'px',
                    height: 30 + 'px',
                });
            };

            background.operations = selectDropdown;
            background.addHtmlChild(selectDropdown, positionDropdown);
            background.positionHtmlObjects();
        };

        this.addEvents(options);

        background.registerListener('added', function (options) {
            canvas.add(background.inputPortLeft);
            canvas.add(background.inputPortRight);
            canvas.add(background.outputPort);
            background.positionHtmlObjects();
            background.positionObjects();
        });

        this.progvolverType = "ComparisonOperator";
        registerProgvolverObject(this);

        return this.background;
    }
}