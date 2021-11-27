class Snapshot {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.height = options.height || 250;
        options.width = options.width || 250;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = "rgba(240, 240, 240, 0.7)";
        options.stroke = "rgba(130, 130, 130, 1)"
        options.strokeWidth = 1;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = false;
        options.hasBorders = false;

        options.value = "Snapshot Widget";

        var background = createObjectBackground(fabric.Rect, options, this);

        this.background = background;

        background.isSnapshot = true;
        background.memberValues = options.memberValues;
        background.previousMemberInstance = options.previousMemberInstance;
        background.parent = options.parent;
        background.index = options.index;
        background.length = options.length + 1;

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);

            if (!background.isCompressed) {
                background.setCoords();
                let leftTop = background.getPointByOrigin('left', 'top');
                ctx.font = '17px Helvetica';
                ctx.fillStyle = 'black';
                ctx.fillText((background.index + 2) + "/" + background.length, leftTop.x + 20, leftTop.y + 20);
            }
        };

        background.members = [];
        background.membersDict = {};
        background.membersDictParent = options.membersDict;
        background.isSnapshotCopy = options.isSnapshotCopy || false;
        background.addMember = function (member, newValue) {
            var clonedObject = member.clone();

            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};

            let originalMember = (background.parent && background.parent.membersDict[clonedObject.name]) || (background.membersDict[clonedObject.name]);
            console.log("Original member is: ");
            console.log(originalMember);
            console.log(background.parent.membersDict);
            let xCoord = background.parent.expandedOptions[originalMember.id].x;
            let yCoord = background.parent.expandedOptions[originalMember.id].y;
            background.addChild(clonedObject, {
                whenCompressed: {
                    x: xCoord, y: yCoord,
                    scaleX: 0, scaleY: 0, opacity: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: xCoord, y: yCoord,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.members.push(clonedObject);
            background.membersDict[clonedObject.name] = clonedObject;
            canvas.add(clonedObject);

            if (background.index > 0) {
                let previousSnapshot = background.parent.snapshots[background.index - 1];
                let previousValue = previousSnapshot.membersDict[clonedObject.name].value;
                
                console.log("Previous snapshot and value");
                console.log(previousSnapshot);
                console.log(previousValue);
                if (previousValue != newValue) {
                    clonedObject.stroke = 'red';
                }
            }
            newValue && clonedObject.setValue(newValue);
            clonedObject.bringToFront();

            if (background.isExpanded) {
                console.log("Entered");
                clonedObject.addAll();
            }
        }

        background.registerListener('mousedown', function (event) {
            if (!background.isSnapshotCopy) {
                let x = event.e.x;
                let y = event.e.y;
                background.down = true;

                background.initialX = x;
                background.initialY = y;

                background.initialLeft = background.left;
                background.initialTop = background.top;

                background.lockMovementX = false;
                background.lockMovementY = false;

                let fill = background.fill;
                let stroke = darken(background.fill);
                var square = new Snapshot({
                    height: background.height,
                    width: background.width,
                    hasControls: false,
                    hasBorders: false,
                    x: background.left,
                    y: background.top,
                    membersDict: background.membersDict,
                    parent: background,
                    index: background.index,
                    length: background.length - 1,
                    isSnapshotCopy: true
                });
                background.square = square;
                canvas.add(background.square);
                background.square.bringToFront();
            }
        });

        background.registerListener('moving', function (event) {
            if (!background.isSnapshotCopy) {
                background.left = background.initialLeft;
                background.top = background.initialTop;
                background.positionObjects();
                if (background.down) {
                    let deltaX = background.initialX - event.e.x;
                    let deltaY = background.initialY - event.e.y;

                    background.square.addAll();
                    background.square.bringContentsToFront();

                    background.square.left = background.left - deltaX;
                    background.square.top = background.top - deltaY;
                    background.square.setCoords();
                    background.square.positionObjects();
                }
            }
        });

        background.registerListener('added', function () {
            if (background.membersDictParent) {
                background.expand();
                for (const [key, member] of Object.entries(background.membersDictParent)) {
                    background.addMember(member, null);
                }
            } else {
                background.previousMemberInstance.forEach(function (member) {
                    background.addMember(member, background.memberValues[member.name]);
                })
            }
        });

        background.addAll = function () {
            background.members.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        content.expand && content.expand();
                    })
                }
                child.expand && child.expand();
            });
            background.expand && background.expand();
        }

        background.removeAll = function () {
            background.members.forEach(function (child) {
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

        background.bringContentsToFront = function () {
            background.members.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        content.bringToFront && content.bringToFront();
                    })
                }
                child.bringToFront && child.bringToFront();
            });
        }


        this.progvolverType = "Snapshot";

        return this.background;
    }
}