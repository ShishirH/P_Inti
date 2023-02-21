class ObjectSelectionPane {
    constructor(options) {
        var symbolFont = '20px Helvetica';
        options.height = 1//options.height || 1;
        options.width = 1//options.width || 1;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.fill = options.fill || "#B3CDE3";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.objectCaching = true;
        options.nonResizable = false;
        options.hasControls = true;
        options.hasBorders = true;
        options.lockScalingX = false;
        options.eventable = false;
        options.selectable = false;
        options.value = "Object selection pane"; //options.name;

        var background = createObjectBackground(fabric.Rect, options);
        background.children = [];
        this.background = background;
        this.value = options.value || '';
        background.objectMembersDict = options.objectMembers;
        background.objectMembers = [];
        background.parent = options.parent;

        background.objectMemberSelectionArray = [];
        background.addObjectMembersSelection = function (options) {
            let i = 0;
            var strokeDashArray;
            for (const [key, name] of Object.entries(background.objectMembersDict)) {
                let nameArray = name.split(' ');
                let type = nameArray[0];
                let varName = nameArray[1];
                var height = 40;
                var width = 120;

                if (i == 0) {
                    strokeDashArray = [(2 * width + height), (height)];
                } else {
                    strokeDashArray = [0, width, (height + width), height];
                }
                var objectMemberSelection = new ObjectMemberSelection({
                    height: height,
                    width: width,
                    fill: 'black',
                    hasControls: false,
                    hasBorders: false,
                    type: type,
                    name: varName,
                    x: 250,
                    y: 250,
                    strokeDashArray: strokeDashArray,
                    index: i,
                    parent: background,
                    grandparent: background.parent
                });

                var originParent = {originX: 'left', originY: 'top'};
                var originChild = {originX: 'left', originY: 'top'};

                background.addChild(objectMemberSelection, {
                    whenCompressed: {
                        x: -1, y: (i * 40) - 2,
                        scaleX: 0, scaleY: 0, opacity: 0,
                        originParent: originParent,
                        originChild: originChild
                    },
                    whenExpanded: {
                        x: -1, y: (i * 40) - 2,
                        scaleX: 1, scaleY: 1, opacity: 1,
                        originParent: originParent,
                        originChild: originChild
                    },
                    movable: false
                });

                objectMemberSelection.lockMovementX = true;
                objectMemberSelection.lockMovementY = true;
                background.objectMemberSelectionArray.push(objectMemberSelection);
                background.children.push(objectMemberSelection);
                i++;
            }
        };
        background.addObjectMembersSelection();

        background.addAll = this.addAll;
        background.removeAll = this.removeAll;
        this.progvolverType = "CodeNote";
        registerProgvolverObject(this);
        return background;
    }
}