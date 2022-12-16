class SignalHolder {
    constructor(options) {
        var symbolFont = '20px Helvetica';

        options.height = 40;
        options.width = 90;
        options.radius = options.radius || 10;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = "#B3CDE3";
        options.stroke = darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = true;
        options.hasBorders = false;
        options.y = 250;
        options.x = 250;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.signal = options.signal;

        this.background = background;
        background.lineNumber = options.lineNumber || '';
        background.lineContent = options.lineContent;
        background.file = options.file;
        background.label = options.fileName && options.lineNumber ? options.fileName + ' (' + options.lineNumber + ')' : options.fileName || '';

        background.oldRender = background.render;

        background.setControlsVisibility({
            mb: false, // middle top disable
            mt: false, // midle bottom
            ml: false, // middle left
            mr: false, // I think you get it
            mtr: false
        });

        var addSignal = function () {
            var signal = background.signal;
            var originParent = {originX: 'right', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};


            background.addChild(signal, {
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

            canvas.add(signal);
            signal.bringToFront();
        };

        addSignal();

        var addLabelObject = function () {
            var labelObject = new fabric.IText(background.label, {
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

            scaleX = 1;
            scaleY = 1;
            opacity = 1;

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

            background.labelObject = labelObject;

            background.labelObject && background.labelObject.on({
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
        }

        addLabelObject();

        var addLineContent = function () {
            let font = '15px Courier New';
            let constrainedText = '';
            let lineContentWidth = getValueWidth(background.lineContent, font);
            console.log("full line width " + lineContentWidth);
            console.log("Background width " + background.width);

            var lineContentTextBox = new fabric.Textbox(background.lineContent, {
                fontFamily: 'Courier New',
                fontSize: 15,
                width: lineContentWidth,
                height: background.height,
                hasControls: false,
                selectable: false,
                evented: false,
                hasBorders: false,
                padding: 3,
                editable: false,
                textAlign: 'center',
                originY: 'center',
                fontWeight: '100',
            });
            
            background.set('width', lineContentWidth);
            var originParent = {originX: 'center', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};

            let scaleX, scaleY, opacity;

            scaleX = 1;
            scaleY = 1;
            opacity = 1;

            background.addChild(lineContentTextBox, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: scaleX, scaleY: scaleY, opacity: opacity,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.lineContentTextBox = lineContentTextBox;
        }

        addLineContent();

        background.setProgramTime = function (time) {
            background.signal.setProgramTime(time);
        };

        background.on('scaling', function () {
//            background.set('height', background.cacheHeight);
//            background.set('width', background.cacheWidth);
//
            background.lineContentTextBox.width = background.width * background.scaleX;

            if (background.cacheWidth > getValueWidth(background.lineContent)) {
                background.lineContentTextBox.text = background.lineContent;
            }

            background.positionObjects();
        })

        background.registerListener('added', function () {
            background.bringToFront();
            bringToFront(background);
            background.signal.bringToFront();
            bringToFront(background.signal);
            background.positionObjects();

            canvas.add(background.labelObject)
            canvas.add(background.lineContentTextBox);
        });

        this.progvolverType = "SignalHolder";
        registerProgvolverObject(this);

        return this.background;
    }
}