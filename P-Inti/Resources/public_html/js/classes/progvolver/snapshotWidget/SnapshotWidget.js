class SnapshotWidget {
    constructor(options) {
        var symbolFont = '20px Helvetica';

        options.height = options.height || 250;
        options.width = options.width || 250;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = "rgba(240, 240, 240, 0.7)";
        options.stroke = "rgba(130, 130, 130, 1)"
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;

        options.nonResizable = true;
        options.hasControls = true;
        options.hasBorders = false;

        options.value = "Snapshot Widget";

        var background = createObjectBackground(fabric.Rect, options);

        this.background = background;

        background.isSnapshotWidget = true;
        background.memberValues = [];

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);

            if (background.snapshots.length != 0) {
                background.setCoords();
                let leftTop = background.getPointByOrigin('left', 'top');
                ctx.font = '17px Helvetica';
                ctx.fillStyle = 'black';
                ctx.fillText((background.index + 1) + "/" + (background.snapshots.length + 1), leftTop.x + 20, leftTop.y + 20);
            }
        };

        var addSignalReceiver = function () {
            var signalReceiver = new SignalReceiverSnapshot({
                fill: '#FED9A6',
                background: background
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

            background.signalReceiver = signalReceiver;
        };

        background.index = 0;
        var addControls = function () {
            var leftArrow = new fabric.Triangle({
                height: 14,
                width: 14,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
                angle: 270
            });

            var rightArrow = new fabric.Triangle({
                height: 14,
                width: 14,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
                angle: 90
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'center'};


            background.addChild(leftArrow, {
                whenCompressed: {
                    x: -55, y: +29,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    angle: 270,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -45, y: +29,
                    angle: 270,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.addChild(rightArrow, {
                whenCompressed: {
                    x: -25, y: +14,
                    angle: 90,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -15, y: +14,
                    angle: 90,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            leftArrow.on('mouseup', function () {
                if (background.isCompressed) {
                    let memberValues = null;

                    if (background.memberValuesArray && background.memberValuesArray[background.index]) {
                        memberValues = background.memberValuesArray[background.index];
                    }

                    background.members.forEach(function (member) {
                        if (memberValues) {
                            member.value = memberValues[member.name];
                        }
                    });

                    if (background.index != 0) {
                        background.index--;
                    }
                }
            })

            rightArrow.on('mouseup', function () {
                if (background.isCompressed) {
                    let memberValues = null;

                    if (background.memberValuesArray && background.memberValuesArray[background.index]) {
                        memberValues = background.memberValuesArray[background.index];
                    }

                    background.members.forEach(function (member) {
                        if (memberValues) {
                            member.value = memberValues[member.name];
                        }
                    });

                    if (background.index != background.memberValuesArray.length) {
                        background.index++;
                    }
                }
            })


            background.leftArrow = leftArrow;
            background.rightArrow = rightArrow;
        }

        addSignalReceiver();

        var addListControl = function () {
            var listArrow = new fabric.Triangle({
                height: 8,
                width: 8,
                fill: darken(background.stroke),
                hasControls: false,
                hasBorders: false,
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'left', originY: 'center'};


            background.addChild(listArrow, {
                whenCompressed: {
                    x: -10, y: +25,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    angle: 180,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -10, y: +25,
                    angle: 180,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            listArrow.on('mouseup', function () {
                if (background.snapshots.length != 0) {
                    if (background.snapshots[0].isCompressed) {
                        background.snapshots.forEach(function (snapshot) {
                            background.expand();
                            snapshot.addAll();
                        });
                    } else {
                        background.snapshots.forEach(function (snapshot) {
                            snapshot.removeAll();
                            background.compress();
                        })
                    }
                }
            })
            canvas.add(listArrow);
            background.listArrow = listArrow;
        }

        background.members = [];
        background.membersDict = {};
        background.addMember = function (member, options) {
            var clonedObject = member//fabric.util.object.clone(object);

            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};

            background.addChild(clonedObject, {
                whenCompressed: {
                    x: options.x, y: options.y,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: options.x, y: options.y,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            clonedObject.registerListener('moving', function (e) {
                console.log("Event");
//                console.log(e);
//                console.log(clonedObject);
                clonedObject.setCoords();
                let parentCoords = background.getPointByOrigin('left', 'top');
                let childCoords = clonedObject.getPointByOrigin('left', 'top');

                let xPosition = -parentCoords.x + childCoords.x;
                let yPosition = -parentCoords.y + childCoords.y;

                background.expandedOptions[clonedObject.id].x = xPosition;
                background.expandedOptions[clonedObject.id].y = yPosition;
                background.compressedOptions[clonedObject.id].x = xPosition;
                background.compressedOptions[clonedObject.id].y = yPosition;

                background.positionObject(clonedObject);
                clonedObject.positionObjects();

                if (background.snapshots.length != 0) {
                    background.snapshots.forEach(function (snapshot) {
                        snapshot.membersDict[clonedObject.name].setCoords();
                        snapshot.expandedOptions[snapshot.membersDict[clonedObject.name].id].x = xPosition;
                        snapshot.expandedOptions[snapshot.membersDict[clonedObject.name].id].y = yPosition;

                        snapshot.compressedOptions[snapshot.membersDict[clonedObject.name].id].x = xPosition;
                        snapshot.compressedOptions[snapshot.membersDict[clonedObject.name].id].y = yPosition;

                        snapshot.positionObjects(snapshot.membersDict[clonedObject.name]);
                    })
                }
            })
            background.members.push(clonedObject);
            background.membersDict[clonedObject.name] = clonedObject;
            canvas.add(clonedObject);
            member.bringToFront();
        }

        background.memberValuesArray = [];
        background.snapshots = [];
        background.parseMemberValues = function () {
            var signalId = background.signalReceiver.signalId;

            if (window.signalData) {
                background.signalData = window.signalData.filter(item => item.widgetsID == signalId);

                let index = 0;
                let lastIndex = background.signalData.length - 1;
                if (background.signalData) {
                    background.signalData.forEach(function (entry) {
                        var memberValuesDict = {};
                        var currentTime = entry.time;
                        var currentValues = window.logData.filter(item => item.time <= currentTime);

                        background.members.forEach(function (member) {
                            var symbolName = member.name;
                            var id;

                            if (member.isArray) {
                                id = member.object.id;
                            } else {
                                id = member.id;
                            }
                            var memberValues = currentValues.filter(item => item.widgetsID.indexOf(id) != -1)
                            let currentMemberValue = ""
                            if (memberValues.length) {
                                if (!member.isArray) {
                                    currentMemberValue = memberValues[memberValues.length - 1].values;
                                } else {
                                    currentMemberValue = memberValues[memberValues.length - 1].array;
                                }
                            }

                            console.log("Current membervalue is");
                            console.log(currentMemberValue);
                            memberValuesDict[symbolName] = currentMemberValue;
                        });
                        background.memberValuesArray.push(memberValuesDict);

                        let previousMemberInstance;

                        if (index == 0) {
                            previousMemberInstance = background.members;
                        } else {
                            previousMemberInstance = background.snapshots[index - 1].members;
                        }

                        var snapshot = new Snapshot({
                            height: background.cacheHeight - (2 * background.strokeWidth),
                            width: background.cacheWidth - (2 * background.strokeWidth),
                            hasControls: false,
                            hasBorders: false,
                            x: 250,
                            y: 250,
                            memberValues: memberValuesDict,
                            previousMemberInstance: previousMemberInstance,
                            parent: background,
                            index: index,
                            length: background.signalData.length
                        });

                        var originParent = {originX: 'center', originY: 'top'};
                        var originChild = {originX: 'center', originY: 'top'};


                        background.addChild(snapshot, {
                            whenCompressed: {
                                x: ((lastIndex - index + 1) * 2), y: ((lastIndex - index + 1) * 2),
                                scaleX: 1, scaleY: 1, opacity: 1,
                                originParent: originParent,
                                originChild: originChild
                            },
                            whenExpanded: {
                                x: 0, y: ((index + 1) * background.height),
                                scaleX: 1, scaleY: 1, opacity: 1,
                                originParent: originParent,
                                originChild: originChild
                            },
                            movable: false
                        });

                        canvas.add(snapshot);
                        snapshot.bringToFront();

                        snapshot.lockMovementX = true;
                        snapshot.lockMovementY = true;
                        background.bringToFront();
                        background.snapshots.push(snapshot);
                        index++;
                    })
                }
                addControls();
                canvas.add(background.leftArrow);
                canvas.add(background.rightArrow);
                background.leftArrow.bringToFront();
                background.rightArrow.bringToFront();
                background.afterCompressing();
            }
        }

        background.registerListener('added', function () {
            canvas.add(background.signalReceiver);
            background.signalReceiver.bringToFront();

            background.members.forEach(function (member) {
                canvas.add(member);
                member.bringToFront();
            })

            background.positionObjects();
        });

        background.registerListener('scaling', function () {
            background.positionObjects();
            background.set('height', background.cacheHeight);
            background.set('width', background.cacheWidth);
        })

        background.afterCompressing = function () {
            background.snapshots.forEach(function (snapshot) {
                snapshot.removeAll();
                snapshot.bringToFront();
            })

            background.bringToFront();
            background.members.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        content.bringToFront && content.bringToFront();
                    })
                }
                child.bringToFront && child.bringToFront();
            })

            background.leftArrow.fill = darken(background.fill);
            background.rightArrow.fill = darken(background.fill);

            background.leftArrow.bringToFront();
            background.rightArrow.bringToFront();
        }

        background.afterExpanding = function () {
            background.members.forEach(function (child) {
                var contents = child.childrenOnTop || child.children;
                if (contents) {
                    contents.forEach(function (content) {
                        content.bringToFront && content.bringToFront();
                    })
                }
                child.bringToFront && child.bringToFront();
            });

            background.snapshots.forEach(function (snapshot) {
                snapshot.addAll();
                snapshot.bringContentsToFront();
            })

            background.leftArrow.fill = lighten(background.leftArrow.fill, 50);
            background.rightArrow.fill = lighten(background.rightArrow.fill, 50);
        }

        this.progvolverType = "SnapshotWidget";
        registerProgvolverObject(this);

        return this.background;
    }
}