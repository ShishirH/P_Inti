class CodeControlBranch {
    constructor(options) {
        options.height = 30;
        options.width = 200;
        options.fill = "white";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 1;
        options.hasControls = false;
        options.hasBorders = false;

        const background = createObjectBackground(fabric.Rect, options, this);
        background.childrenOnTop = [];
        background.id = options.id;
        background.branchName = options.branchName;

        background.addName = function() {
            let labelObject = new fabric.IText("BRANCH_NAME", {
                fontFamily: 'Arial',
                fill: '#0366d6',
                fontSize: 14,
                hasControls: false,
                hasBorders: false,
                textAlign: 'center',
                fontWeight: '100',
                hoverCursor: "pointer"
            });

            const originParent = {originX: 'left', originY: 'center'};
            const originChild = {originX: 'left', originY: 'center'};

            background.addChild(labelObject, {
                whenCompressed: {
                    x: 10, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 10, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.childrenOnTop.push(labelObject);
        }

        background.addUpdate = function() {
            let updateObject = new CodeControlBranchUpdate({
                parent: background
            });

            const originParent = {originX: 'right', originY: 'center'};
            const originChild = {originX: 'right', originY: 'center'};

            background.addChild(updateObject, {
                whenCompressed: {
                    x: -30, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -30, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.childrenOnTop.push(updateObject);
        }

        background.addName();
        background.addUpdate();

        background.registerListener('added', function() {
            addChildrenToCanvas(background);
        });

        background.registerListener('mouseup', function() {
            if (window.jsHandler) {
                if (window.jsHandler.goToControlBranch) {
                    window.jsHandler.goToControlBranch({branchName: background.branchName});
                    console.log("went to branch: " + background.branchName);
                }
            }
        });

        this.progvolverType = "Control Addition Branch";
        registerProgvolverObject(this);
        return background;
    }
}