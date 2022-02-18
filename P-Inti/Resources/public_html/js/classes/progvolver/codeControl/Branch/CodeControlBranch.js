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

        background.addName = function () {
            let labelObject = new fabric.IText("", {
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

            // labelObject.on("editing:exited", function (e) {
            //     //console.log('updated text:',e.target.text);
            //     console.log("text:editing:exited");
            // });

            background.childrenOnTop.push(labelObject);
            background.labelObject = labelObject;

        }

        background.addUpdate = function () {
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

        background.addDelete = function () {
            let deleteObject = new CodeControlBranchDelete({
                parent: background
            });

            const originParent = {originX: 'right', originY: 'center'};
            const originChild = {originX: 'right', originY: 'center'};

            background.addChild(deleteObject, {
                whenCompressed: {
                    x: -5, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -5, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.childrenOnTop.push(deleteObject);
        }

        background.addName();
        background.addUpdate();
        background.addDelete();

        background.registerListener('added', function () {
            addChildrenToCanvas(background);
            background.labelObject.enterEditing().selectAll();
        });

        background.registerListener('mouseup', function () {
            if (window.jsHandler) {
                if (window.jsHandler.goToControlBranch) {
                    window.jsHandler.goToControlBranch({branchName: background.branchName});
                    console.log("went to branch: " + background.branchName);

                    background.parent.updateSelectedBranch(background);
                }
            }
        });

        background.removeFromCanvas = function () {
            let index = background.parent.codeBranches.indexOf(background);

            if (index > -1) {
                background.parent.codeBranches.splice(index, 1);

                let positionIndex = 0;
                background.parent.codeBranches.forEach(function (codeBranch) {
                    let yPosition = CodeControlBranch.getYPositionForIndex(positionIndex);
                    background.parent.compressedOptions[codeBranch.id].y = yPosition;
                    background.parent.expandedOptions[codeBranch.id].y = yPosition;
                    codeBranch.positionObjects();
                    positionIndex++;
                });

                background.parent.positionObjects();
                removeWidgetFromCanvas(background);
            }
        }

        this.progvolverType = "Control Addition Branch";
        registerProgvolverObject(this);
        return background;
    }

    getYPositionForIndex(index) {
        return (index * 40) + 40;
    }

    static getYPositionForIndex(index) {
        return (index * 40) + 40;
    }
}