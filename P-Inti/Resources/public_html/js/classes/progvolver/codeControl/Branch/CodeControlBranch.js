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
        background.displayName = options.displayName || "";
        background.isOnCanvas = false;
        background.parent = options.parent;

        background.lockMovementX = true;
        background.lockMovementY = true;

        background.addName = function () {
            let labelObject = new fabric.IText(background.displayName, {
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

                if (background.displayName == "") {
                    background.labelObject.enterEditing().selectAll();
                } else {
                    if (window.jsHandler) {
                        if (window.jsHandler.createCodeControlBranch) {
                            window.jsHandler.createCodeControlBranch({
                                id: background.parent.id,
                                branchId: background.id,
                                branchName: background.displayName
                            }).then(function (response) {

                            });
                        }
                    }
                    background.branchName = background.displayName;
                }

                background.labelObject.on("editing:exited", function (e) {
                    //console.log('updated text:',e.target.text);
                    console.log("text:editing:exited");
                    if (window.jsHandler) {
                        if (window.jsHandler.createCodeControlBranch) {
                            window.jsHandler.createCodeControlBranch({
                                id: background.parent.id,
                                branchId: background.id,
                                branchName: background.labelObject.text
                            }).then(function (response) {

                            });
                        }
                    }
                    background.branchName = background.labelObject.text;
                });

            }
            background.positionObjects();
        });

        background.registerListener('mouseup', function (event) {
            console.log("Mouse up of code control branch")
            CodeControls.updateSelectedCodeControl(background.parent);
            if (window.jsHandler && window.jsHandler.goToControlBranch) {
                window.jsHandler.goToControlBranch({
                    variantName: background.branchName,
                    variantId: background.id,
                    codeShiftId: background.parent.id,
                });

                console.log("went to branch: " + background.branchName);

                background.parent.updateSelectedBranch(background);
                getAssociatedVariablesForCodeVariants();

            }
        });

        background.removeFromCanvas = function () {
            console.log("Removing variant from the canvas")
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

        background.toJson = function () {
            let json = {};

            //json['codeBranches'] = background.codeBranches.toJson();
            json['branchName'] = background.branchName;
            json['id'] = background.id;
            json['kind'] = "CodeVariant";
            return JSON.stringify(json);
        }

        this.progvolverType = "Code Control Branch";
        registerProgvolverObject(this);
        return background;
    }

    static getYPositionForIndex(index) {
        console.log("Index is: " + index);
        console.log("Returning: " + ((index * 30) + 25));
        return (index * 30) + 25;
    }
}
