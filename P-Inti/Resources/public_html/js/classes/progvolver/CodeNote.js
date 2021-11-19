class CodeNote extends ConnectableWidget {

    constructor(options) {

        options.cornerSize = 9;

//        var fileName = options.fileName.split('\\').pop().split('/').pop();
        options.label = options.label || options.fileName ? options.fileName + " (" + (options.startLine + 1) + " - " + (options.endLine + 1) + ")" : '';

        var background = super(fabric.Rect, options);
        var theWidget = background.widget;

        /*theWidget.fileName = background.fileName;
         theWidget.startLine = background.startLine;
         theWidget.endLine = background.endLine;
         theWidget.lineNumber = background.startLine;*/

        background.widget.labelObject.on({
            mouseup: function (options) {
                deselectAllObjects();
                background.fire('selected');

                /*console.log(background.startLine);
                 console.log(background.endLine);*/

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



        background.registerListener('drop', function (options) {

            var dataTransfer = options.e.dataTransfer;
            dataTransfer.effectAllowed = "copy";
            dataTransfer.dropEffect = "copy";
            var value = dataTransfer.getData("text") || dataTransfer.getData("text/plain");

            if (window.jsHandler && window.jsHandler.getEditorState) {

                window.jsHandler.getEditorState({id: background.id}).then(function (response) {

                    var selectedText = response.selectedText;
                    var startPos = response.startPos;
                    var endPos = response.endPos;
                    var startLine = response.startLine;
                    var endLine = response.endLine;

                    background.startLine = startLine;
                    background.endLine = endLine;

                    var fileName = response.fileName.split('\\').pop().split('/').pop();
                    var title = selectedText.replace(/\n|\r/g, "");
                    title = title.split(' ').join('');
                    title = title.substring(0, 15);

                    background.titleObject.set('text', title);
//                    theCodeNote.textarea.text(selectedText);

                    background.file = response.fileName;
                    background.fileName = fileName;
                    background.lineNumber = response.startLine;

                    background.setLabel(fileName + " (" + (startLine + 1) + " - " + (endLine + 1) + ")");

//                    theWidget.labelObject.set('text', fileName + " (" + (startLine + 1) + " - " + (endLine + 1) + ")");
//                    background.positionObject(theWidget.labelObject);

                    canvas.setActiveObject(background);
                    background.fire('selected');
                });
            }
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
            this.textarea.css('border', this.stroke + ' 1px solid');
            this.widget.thePorts.forEach(function (port) {
                port.set('fill', newColor);
                port.set('stroke', darken(darken(newColor)));
            });
        };

        this.addTextArea = function (options) {

            var background = this;
            var hMargin = this.hMargin;
            var vMargin = this.vMargin;

            var textarea = $('<textarea />')
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
                    .focus(function () {
                        canvas.setActiveObject(background);
                        background.fire('selected');
                    })
                    .appendTo("body")
                    .addClass('scalable')
                    .bind("dragover", function (e) {
                        var dataTransfer = e.originalEvent.dataTransfer;
                        dataTransfer.effectAllowed = "copy";
                        dataTransfer.dropEffect = "copy";
//                    console.log("dataTransfer.effectAllowed: " + dataTransfer.effectAllowed);
//                    console.log("dataTransfer.dropEffect: " + dataTransfer.dropEffect);
                        return false;
                    })
                    .bind("dragenter", function (e) {
                        var dataTransfer = e.originalEvent.dataTransfer;
                        dataTransfer.effectAllowed = "copy";
                        dataTransfer.dropEffect = "copy";
//                    console.log("dataTransfer.effectAllowed: " + dataTransfer.effectAllowed);
//                    console.log("dataTransfer.dropEffect: " + dataTransfer.dropEffect);
                        return false;
                    })
                    .bind("drop", function (e) {
                        var dataTransfer = e.originalEvent.dataTransfer;
                        dataTransfer.effectAllowed = "copy";
                        dataTransfer.dropEffect = "copy";
                        var value = dataTransfer.getData("text") ||
                                dataTransfer.getData("text/plain");
                        this.value = value;
                        return false;
                    });

            var positionTextArea = function () {
                /*console.log(background.getScaledWidth());
                 console.log(background.getScaledHeight());*/
                var sc = getScreenCoordinates(background.getPointByOrigin('left', 'top'));
                var offset = $('#canvasContainer').offset();
                var zoom = canvas.getZoom();
                var borderWidth = parseFloat(textarea.css('borderWidth'));
                var newLeft = sc.x + (offset.left + hMargin + background.strokeWidth / 2 - borderWidth) * zoom;
                var newTop = sc.y + (vMargin + background.strokeWidth / 2) * zoom;
                textarea.css({
                    'transform-origin': 'top left',
                    transform: 'scale(' + canvas.getZoom() + ', ' + canvas.getZoom() + ')',
                    left: newLeft + 'px',
                    top: newTop + 'px',
                    width: (background.getScaledWidth() - hMargin * 2 - background.strokeWidth) + 'px',
                    height: (background.getScaledHeight() - vMargin - hMargin - background.strokeWidth) + 'px',
                });
            };

            this.textarea = textarea;
            background.addHtmlChild(textarea, positionTextArea);
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

                    // right click
//                    if (options.button == 3) {

                    var hexColor = new fabric.Color(icon.fill);
                    var hexColorString = "#" + hexColor.toHex();
                    $('#color-picker').val(hexColorString);

                    $(".context-menu-one").attr('codeNoteID', background.id);
                    $(".context-menu-one").contextMenu({x: options.e.pageX, y: options.e.pageY});
                    $(".context-menu-icon.context-menu-icon--fa").css('color', icon.fill);





                    //                        setTimeout(function () {
//                            $('#color-picker').spectrum("reflow");
//                        }, 750);



//                    }

                }
            });

            this.icon = icon;
            this.childrenOnTop.push(icon);
            canvas.add(icon);

        };

        this.addTextArea(options);
        this.addTitle();
        this.addIcon();


        background.labelObject.set('text', options.label);

        this.progvolverType = "CodeNote";
        registerProgvolverObject(this);



        return this;
    }

}




