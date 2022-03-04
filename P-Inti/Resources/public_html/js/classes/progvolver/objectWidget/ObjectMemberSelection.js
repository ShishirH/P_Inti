class ObjectMemberSelection {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.height = options.height || 60;
        options.width = options.width || 120;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = OBJECT_WIDGET_FILL;
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;
        options.nonResizable = false;
        options.lockScalingX = false;

        var background = createObjectBackground(fabric.Rect, options);

        background.children = [];
        this.background = background;
        this.name = options.name;
        this.type = options.type;
        background.parent = options.parent;
        background.grandparent = options.grandparent;
        background.index = options.index;
        background.visibility = false;

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            if (this.visibility && this.name && this.name != "") {
                ctx.font = '16px Helvetica';
                ctx.fillStyle = 'rgb(0,0,255)';
                var center = background.getPointByOrigin('left', 'center');
                ctx.textAlign = 'left';
                ctx.fillText(this.type, center.x + 30, center.y);
                ctx.fillStyle = 'rgb(0,0,0)';
                ctx.font = 'bold 16px Helvetica';
                ctx.fillText(" " + this.name, ctx.measureText(this.type).width + center.x + 28, center.y);
            }
            ctx.restore();
        };

        background.setVisibility = function (visibility) {
            background.visibility = visibility;

            if (visibility === false) {
                background.selectButton.value = "";
            } else {
                background.selectButton.value = "✓";
            }
        }

//        background.registerListener('added', function () {
//            console.log("Inside added for member")
//            background.bringToFront();
//            bringToFront(background);
//            background.children.forEach(function (child) {
//                var contents = child.childrenOnTop || child.children;
//                if (contents) {
//                    contents.forEach(function (content) {
//                        content.bringToFront();
//                        bringToFront(content);
//                    })
//                }
//                child.bringToFront();
//                bringToFront(child)
//            });
//        })

        this.addAll = function () {
            console.log("Entered addAll");
            background.expand();
        }

        this.removeAll = function () {
            console.log("Entered removeAll");
            background.children.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        canvas.remove(content);
                    })
                }
                canvas.remove(child)
            });
            canvas.remove(background);
        }

        background.addSelectButton = function () {
            var selectButton = new ObjectSelectionCheckBox({
                height: 15,
                width: 15,
                hasControls: false,
                hasBorders: false,
                stroke: darken(OBJECT_WIDGET_FILL),
                value: "✓"
            });

            var originParent = {originX: 'left', originY: 'center'};
            var originChild = {originX: 'left', originY: 'center'};

            background.addChild(selectButton, {
                whenCompressed: {
                    x: 5, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 5, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                }
            });

            selectButton.registerListener('mouseup', function () {
                let elementHeight = background.grandparent.elementHeight;
                let gap = background.grandparent.gap;
                if (selectButton.value && selectButton.value == "✓") {
                    selectButton.value = "";
                    let selectedObject = background.grandparent.objectMembers[background.index];
                    selectedObject.compress();
                    for (let j = background.index + 1; j < background.grandparent.objectMembers.length; j++) {
                        background.grandparent.expandedOptions[background.grandparent.objectMembers[j].id].y = ((j - 1) * elementHeight) + gap;
                        background.grandparent.compressedOptions[background.grandparent.objectMembers[j].id].y = ((j - 1) * elementHeight) + gap;
                        background.grandparent.positionObject(background.grandparent.objectMembers[j]);
                        background.grandparent.objectMembers[j].positionObjects();
                    }
                } else {
                    selectButton.value = "✓";
                    let selectedObject = background.grandparent.objectMembers[background.index];
                    selectedObject.expand();
                    for (let j = background.index + 1; j < background.grandparent.objectMembers.length; j++) {
                        background.grandparent.expandedOptions[background.grandparent.objectMembers[j].id].y = ((j) * elementHeight) + gap;
                        background.grandparent.compressedOptions[background.grandparent.objectMembers[j].id].y = ((j) * elementHeight) + gap;
                        background.grandparent.positionObject(background.grandparent.objectMembers[j]);
                        background.grandparent.objectMembers[j].positionObjects();
                    }
                }
                background.grandparent.setCoords();
            });

            selectButton.lockMovementX = true;
            selectButton.lockMovementY = true;

            background.children.push(selectButton);
            background.selectButton = selectButton;
            //canvas.add(selectButton);
        }
        background.addSelectButton();

        background.addAll = this.addAll;
        background.removeAll = this.removeAll;
        this.progvolverType = "CodeNote";
        registerProgvolverObject(this);
        return background;
    }
}