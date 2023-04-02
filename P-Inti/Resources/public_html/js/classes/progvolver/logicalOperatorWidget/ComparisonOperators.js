class ComparisonOperators {
    constructor(options) {
        var symbolFont = '17px Helvetica';

        options.height = 44;
        options.width = 140;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = "#69c8d1";
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
                parent: background,
            });

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'left', originY: 'center'};


            background.addChild(inputPortLeft, {
                whenCompressed: {
                    x: 5, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 5, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            var inputPortRight = new VariableInputConnection({
                parent: background,
            });

            originParent = {originX: 'right', originY: 'center'};
            originChild = {originX: 'right', originY: 'center'};


            background.addChild(inputPortRight, {
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

            background.inputPortLeft = inputPortLeft;
            background.inputPortRight = inputPortRight;
            background.children.push(inputPortLeft);
            background.children.push(inputPortRight);
        }

        var addOutputPort = function () {
            var outputPort = new LogicalOutputConnection({
                parent: background,
                isOutputPort: true
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
                background.outputPort.updateOutput();
            });

            var positionDropdown = function () {
                /*console.log(background.getScaledWidth());
                 console.log(background.getScaledHeight());*/
                background.setCoords();
                var sc = getScreenCoordinates(background.getPointByOrigin('center', 'top'));
                var leftSc = getScreenCoordinates(background.getPointByOrigin('left', 'center'));
                var offset = $('#canvasContainer').offset();
                var zoom = canvas.getZoom();
                var borderWidth = parseFloat(selectDropdown.css('borderWidth'));
                var newLeft = sc.x + (offset.left + background.strokeWidth / 2 - borderWidth) * zoom;
                var newTop = sc.y + (background.strokeWidth / 2) * zoom;
                let leftPositionPointer = 0;

                if (background.width == 140) {
                  //default width`
                  leftPositionPointer = -26;
                } else if (background.width > 140 && background.width < 180) {
                    leftPositionPointer = -14;
                } else if (background.width > 180 && background.width < 220) {
                    leftPositionPointer = -26;
                } else if (background.width > 220) {
                    leftPositionPointer = -56;
                }

                selectDropdown.css({
                    'transform-origin': 'top left',
                    transform: 'scale(' + canvas.getZoom() + ', ' + canvas.getZoom() + ')',
                    left: newLeft + (leftPositionPointer * canvas.getZoom()) + 'px',
                    top: newTop + (6 * canvas.getZoom()) + 'px',
                    width: 50 + 'px',
                    height: 30 + 'px',
                });
            };

            background.operations = selectDropdown;
            background.addHtmlChild(selectDropdown, positionDropdown);
            background.positionHtmlObjects();
        };

        background.modifyWidth = function (newWidthDifference) {
            let leftWidth = background.inputPortLeft.width;
            let rightWidth = background.inputPortRight.width;

            background.set('width', leftWidth + rightWidth + 70);
            background.positionObjects();
            background.positionHtmlObjects();
        }

        background.setUpdatedValue = function (value, isLeft) {
            console.log("isLeft : ");
            console.log(isLeft);

            console.log("Value is: ");
            console.log(value);

            if (isLeft) {
                background.leftOperandValue = value;
            } else {
                background.rightOperandValue = value;
            }

            console.log("Left operand is: ");
            console.log(background.leftOperandValue);
            console.log("Right operand is: ");
            console.log(background.rightOperandValue)
        }

        background.setProgramTime = function (time) {
            // 'this' here refers to the variable background
            console.log("This is being run!");
            background.outputPort.updateOutput();
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
        registerProgvolverObject(background);

        console.log("Background is: ");
        console.log(background);
        operatorsOnCanvas.push(background);
        return this.background;
    }
}