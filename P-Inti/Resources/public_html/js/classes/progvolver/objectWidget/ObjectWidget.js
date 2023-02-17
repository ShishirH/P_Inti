class ObjectWidget {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.height = options.height || 0;
        options.width = options.width || 0;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = OBJECT_WIDGET_FILL;
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;
        options.nonResizable = false;
        options.hasControls = false;
        options.hasBorders = false;
        options.lockScalingX = false;
        options.value = "Object widget"; //options.name;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.childrenOnTop = [];
        background.innerReferences = [];

        background.expandedHeight = (((Object.keys(options.objectMembers).length - 1) * 60) + 32) || 300;
        background.expandedWidth = 120;

        background.onChangeCompressing = function (currentValue) {
            background.set('width', (background.expandedWidth * currentValue) + 50);
            background.set('height', (background.expandedHeight * currentValue) + 50);
            background.compressed = true;
        }

        background.afterCompressing = function () {
            background.set('width', 0);
            background.set('height', 0);

            background.rightPane.objectMemberSelectionArray.forEach(function (child) {
                child.selectButton.visibility = false;
                child.setVisibility(false);
            });
        }

        background.onChangeExpanding = function (currentValue) {
            background.set('width', (background.expandedWidth * currentValue));
            background.set('height', (background.expandedHeight * currentValue));
            background.compressed = false;
        }

        background.afterExpanding = function (currentValue) {
            background.set('width', (background.expandedWidth));
            background.set('height', (background.expandedHeight));
            background.compressed = false;

            background.rightPane.objectMemberSelectionArray.forEach(function (child) {
                child.selectButton.visibility = true;
            });

            background.innerReferences.forEach(function (innerMember) {
                console.log("Inner member is: ");
                console.log(innerMember);
                innerMember.minimizeButton.setCoords();
            })
        }


        background.children = [];
        this.background = background;
        background.noScaleCache = false;
        this.value = options.value || '';
        background.label = options.label || options.fileName && options.lineNumber ? options.fileName + ' (' + options.lineNumber + ')' : options.fileName || '';
        background.objectMembersDict = options.objectMembers;

        console.log("Object members dict is: ");
        console.log(background.objectMembersDict);
        background.objectMembers = [];

        background.objectMembers = [];
        background.objectWidgetsDict = {};

        console.log("background.objectMembersDict");
        console.log(background.objectMembersDict);
        var addObjectMembers = function () {
            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};
            let index = 0;

            background.elementHeight = 45;
            background.gap = 5;
            for (const [key, objectMember] of Object.entries(background.objectMembersDict)) {

                background.addChild(objectMember, {
                    whenCompressed: {
                        x: 53, y: (index * background.elementHeight) + background.gap,
                        //scaleX: 1, scaleY: 1, opacity: 1,
                        originParent: originParent,
                        originChild: originChild
                    },
                    whenExpanded: {
                        x: 53, y: (index * background.elementHeight) + background.gap,
                        scaleX: 1, scaleY: 1, opacity: 1,
                        originParent: originParent,
                        originChild: originChild
                    },
                    movable: false
                });
                objectMember.lockMovementX = true;
                objectMember.lockMovementY = true;


                canvas.add(objectMember);
                background.objectMembers.push(objectMember);
                background.objectWidgetsDict[key] = objectMember;
                background.children.push(objectMember);

                if (objectMember.isReference) {
                    background.innerReferences.push(objectMember);

                    objectMember.compress();
                }

                index++;
            }
        };

        addObjectMembers();
        background.setProgramTime = function (time) {
            this.time = time;
            console.log("Background history is: ");
            console.log(background.history);
            if (background.history) {
                this.values = background.history.filter(item => item.time <= time);
                console.log(this.values);
                if (this.values.length) {
                    background.onValuesUpdated && background.onValuesUpdated(this.values);
                }
            }
        };
        this.setProgramTime = background.setProgramTime;
        background.setHistory = function () {
            background.history = window.logData.filter(item => item.widgetsID == background.id);
        }

        this.setHistory = background.setHistory;
        background.onValuesUpdated = function (values) {
            for (let j = 0; j < values.length; j++) {
                if (background.objectMembersDict[values[j].expressions]) {
                    background.objectMembersDict[values[j].expressions].value = values[j].values;
                }
            }
        }

        background.registerListener('added', function () {
            background.bringToFront();
            bringToFront(background);
            background.children.forEach(function (child) {
                if (child == background.rightPane) {
                    canvas.add(child);
                    background.rightPane.objectMemberSelectionArray.forEach(function (grandChild) {
                        canvas.add(grandChild);
                        canvas.add(grandChild.selectButton);
                    });
                } else if (child.isReference) {
                    child.organizeChildren();
                } else {
                    var contents = child.childrenOnTop || child.children;
                    if (contents) {
                        contents.forEach(function (content) {
                            content.bringToFront();
                            bringToFront(content);
                        })
                    }
                    child.bringToFront();
                    bringToFront(child)
                }
            });
            background.collapseButton.compress();
            console.log("Compressing right pane")
            background.rightPane.compress();
            background.rightPane.objectMemberSelectionArray.forEach(function (child) {
                child.compress();
            });
        })

        this.addAll = function () {
            console.log("Entered addAll");
            background.children.forEach(function (child) {
                if (child !== background.rightPane) {
                    var contents = child.childrenOnTop || child.children;
                    if (contents) {
                        contents.forEach(function (content) {
                            content.expand && content.expand();
                        })
                    }
                    child.expand && child.expand();
                }
            });
            background.expand && background.expand();

            background.rightPane.compress();
            background.rightPane.objectMemberSelectionArray.forEach(function (child) {
                child.compress();
                console.log(child.setVisibility)
                child.setVisibility(false);
            });
        }

        this.removeAll = function () {
            console.log("Entered removeAll");
            background.children.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        content.compress && content.compress();
                    })
                }
                child.compress && child.compress();
            });
            background.compress && background.compress();
        }

        var objectMembersSelect = [];
        background.addCollapseButton = function () {
            var collapseButton = createObjectBackground(fabric.Rect, {
                height: 10,
                width: 10,
                fill: background.stroke,
                strokeWidth: 2,
                stroke: darken(OBJECT_WIDGET_FILL),
                hasControls: false,
                hasBorders: false
            }, null);

            collapseButton.oldRender = collapseButton.render;
            collapseButton.render = function (ctx) {
                collapseButton.oldRender(ctx);
                ctx.save();
                if (background.rightPane.isCompressed) {
                    this.value = ">";
                } else {
                    this.value = "<";
                }

                if (background.isCompressed) {
                    this.value = "";
                }

                ctx.font = '18px Helvetica';
                ctx.fillStyle = background.fill;
                var center = this.getPointByOrigin('center', 'center');
                ctx.fillText(this.value, center.x, center.y);
                ctx.restore();
            }

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};

            background.addChild(collapseButton, {
                whenCompressed: {
                    x: -12, y: 0,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -12, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            collapseButton.lockMovementX = true;
            collapseButton.lockMovementY = true;

            collapseButton.registerListener('mouseup', function () {
                if (!background.rightPane.isCompressed) {
                    console.log("isCompressed: " + background.rightPane.isCompressed);
                    background.rightPane.compress();
                    background.rightPane.objectMemberSelectionArray.forEach(function (child) {
                        child.compress();
                        child.setVisibility(false);
                        //child.selectButton.expand();
                    });
                    background.collapseButton.compress();
                } else {
                    console.log("isCompressed: " + background.rightPane.isCompressed);
                    background.rightPane.expand();
                    background.rightPane.objectMemberSelectionArray.forEach(function (child) {
                        child.expand();
                        child.setVisibility(true);
                        //child.selectButton.expand();
                    });
                    background.collapseButton.expand();
                }
            });

            background.children.push(collapseButton);
            background.collapseButton = collapseButton;
            background.collapseButton.setCoords();
        }
        background.addCollapseButton();

        var objectMembersSelect = {};
        this.addSelect = function (options) {
            for (const [key, objectMember] of Object.entries(background.objectMembersDict)) {
                objectMembersSelect[key] = objectMember.type + " " + objectMember.name;
            }

            var rightPane = new ObjectSelectionPane({
                height: background.expandedHeight,
                width: 150,
                fill: 'transparent',
                stroke: 'transparent',
                x: 150,
                y: 150,
                parent: background,
                objectMembers: objectMembersSelect
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};

            background.addChild(rightPane, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            rightPane.lockMovementX = true;
            rightPane.lockMovementY = true;

            background.children.push(rightPane);
            background.rightPane = rightPane;
            canvas.add(rightPane);
        };

        this.addSelect();

        background.addLabelObject = function () {
            var labelObject = new fabric.Text(background.label, {
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
            scaleX = 0;
            scaleY = 0;
            opacity = 0;

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
            canvas.add(background.labelObject);
        }

        background.addLabelObject();
        window.rightPane = background.rightPane;

        background.addAll = this.addAll;
        background.removeAll = this.removeAll;

        background.setValue = function(value) {
            console.log("value is: ");
            console.log(value);

            const valueObj = JSON.parse(value);
            if (valueObj && valueObj.constructor == Object) {
                // confirmed that value is a dictionary
                console.log("Value is a dict")
                for (const [key, memberValue] of Object.entries(valueObj)) {
                    console.log("Key: " + key);
                    console.log("Value: ");
                    console.log(memberValue);

                    if (key === "memoryAddress") {
                        background.memoryAddress = memberValue;
                        objectsOnCanvasMemoryAddress.add(background.memoryAddress);
                    } else {
                        background.objectWidgetsDict[key].setValue(memberValue);
                    }
                }
            }
        }
        this.progvolverType = "ObjectWidget";
        return background;
    }
}