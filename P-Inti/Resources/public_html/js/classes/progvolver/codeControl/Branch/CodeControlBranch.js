class CodeControlBranch {
    constructor(options) {
        options.height = 30;
        options.width = options.parent.width - 6;
        options.fill = "white";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 1;
        options.hasControls = false;
        options.hasBorders = false;

        const background = createObjectBackground(fabric.Rect, options, this);
        background.childrenOnTop = [];
        background.id = options.id;
        background.branchName = options.branchName;
        background.isOnCanvas = false;

        background.addName = function () {
            let labelObject = new fabric.IText("", {
                fontFamily: 'Trebuchet MS',
                fill: '#333',
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

            background.updateBranch = updateObject;
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

            background.deleteBranch = deleteObject;
            background.childrenOnTop.push(deleteObject);
        }

        background.addName();
        background.addUpdate();
        background.addDelete();

        background.registerListener('added', function () {
            if (!background.isOnCanvas) {
                background.isOnCanvas = true;
                addChildrenToCanvas(background);
                background.labelObject.enterEditing().selectAll();
            }
        });

        background.registerListener('mouseup', function (event) {
            if (window.selectedCodeControl === background.parent) {
                if (window.jsHandler && window.jsHandler.goToControlBranch) {
                    window.jsHandler.goToControlBranch({branchName: background.branchName});
                    console.log("went to branch: " + background.branchName);

                    background.parent.updateSelectedBranch(background);
                }
            } else {
                // Ctrl + clicking branch from another non-selected branch. Merge those two branches and show them together
                if (event.e.ctrlKey) {
                    if (window.jsHandler && window.jsHandler.goToControlBranch) {
                        // First, go to the selected branch in the active code control again.
                        window.jsHandler.goToControlBranch({branchName: window.selectedCodeControl.selectedBranch});
                        background.parent.updateSelectedBranch(background);

                        // Then, merge the two branches together
                        if (window.jsHandler.mergeBranches) {
                            window.jsHandler.mergeBranches({
                                branchOne: window.selectedCodeControl.selectedBranch,
                                branchTwo: background.branchName
                            });
                        }
                    }
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

                let additionYPosition = CodeControlBranch.getYPositionForIndex(positionIndex);
                background.parent.compressedOptions[background.parent.controlAddition.id].y = additionYPosition;
                background.parent.expandedOptions[background.parent.controlAddition.id].y = additionYPosition;

                background.parent.positionObjects();
                removeWidgetFromCanvas(background);
            }
        }

        this.progvolverType = "Code Control Branch";
        registerProgvolverObject(this);
        return background;
    }

    static getYPositionForIndex(index) {
        return (index * 30) + 40;
    }
}