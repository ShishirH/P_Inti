class CodeControlAddition {
    constructor(options) {
        options.height = 30;
        options.width = options.parent.width - 6;
        options.fill = "white";
        options.stroke = options.stroke || darken("white");
        options.strokeWidth = options.strokeWidth || 1;
        options.hasControls = false;
        options.hasBorders = false;

        let background = createObjectBackground(fabric.Rect, options, this);
        background.parent = options.parent;
        background.childrenOnTop = [];

        background.oldRender = background.render;
        background.render = function (ctx) {
            ctx.save();
            ctx.font = "23px Helvetica";
            ctx.fillStyle = "ForestGreen"
            background.oldRender(ctx);
            var center = background.getPointByOrigin('center', 'center');
            ctx.fillText("+", center.x, center.y + 8);
            ctx.restore();
        };

        background.createCodeControl = function () {
            if (window.selectedCodeControl === background.parent) {
                if (window.jsHandler) {
                    if (window.jsHandler.createCodeControl) {
                        window.jsHandler.createCodeControl(null).then(function (response) {

                            console.log("Response ID: " + response.id);
                            console.log("Branch name: " + response.branchName);

                            let codeControlBranch = new CodeControlBranch({
                                parent: background.parent,
                                id: response.id,
                                branchName: response.branchName
                            });

                            const originParent = {originX: 'center', originY: 'top'};
                            const originChild = {originX: 'center', originY: 'top'};

                            let yPosition = CodeControlBranch.getYPositionForIndex(background.parent.codeBranches.length);

                            background.parent.addChild(codeControlBranch, {
                                whenCompressed: {
                                    x: 0, y: yPosition,
                                    scaleX: 1, scaleY: 1, opacity: 1,
                                    originParent: originParent,
                                    originChild: originChild
                                },
                                whenExpanded: {
                                    x: 0, y: yPosition,
                                    scaleX: 1, scaleY: 1, opacity: 1,
                                    originParent: originParent,
                                    originChild: originChild
                                },
                                movable: false
                            });

                            background.parent.childrenOnTop.push(codeControlBranch);
                            background.parent.codeBranches.push(codeControlBranch);
                            background.parent.codeBranchesMap[codeControlBranch.id] = codeControlBranch;

                            // Move the addition button below the newly created branch
                            let additionYPosition = CodeControlBranch.getYPositionForIndex(background.parent.codeBranches.length);
                            background.parent.expandedOptions[background.id].y = additionYPosition;
                            background.parent.compressedOptions[background.id].y = additionYPosition;

                            canvas.add(codeControlBranch);
                            background.parent.updateSelectedBranch(codeControlBranch);
                            background.parent.positionObject(codeControlBranch);
                            background.parent.positionObject(background);
                            codeControlBranch.positionObjects();
                        });
                    }
                }
            }
        }

        background.registerListener('mouseup', background.createCodeControl);

        this.progvolverType = "Control Addition";
        registerProgvolverObject(this);
        return background;
    }
}