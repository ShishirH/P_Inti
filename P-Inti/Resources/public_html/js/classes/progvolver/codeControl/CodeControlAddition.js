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

        background.createCodeControl = function (event, existingCodeVariant) {
            let codeControlBranch = null;
            if (existingCodeVariant) {
                codeControlBranch = existingCodeVariant;
            } else {
                codeControlBranch = new CodeControlBranch({
                    parent: background.parent,
                    branchName: background.id
                });
            }

            console.log("CodeControlBranch is: ");
            console.log(codeControlBranch);
            if (window.selectedCodeControl === background.parent) {
                let backgroundHeight = background.parent.height;
                background.parent.set('height', backgroundHeight + 30);

                console.log("Updating y pos");
                const originParent = {originX: 'center', originY: 'top'};
                const originChild = {originX: 'center', originY: 'top'};

                console.log("Getting yPos from here");
                let yPosition = CodeControlBranch.getYPositionForIndex(background.parent.codeBranches.length);

                console.log("yPosition for the branch is: " + yPosition);
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
                console.log("Another yPos for the addition button")
                let additionYPosition = CodeControlBranch.getYPositionForIndex(background.parent.codeBranches.length);

                background.parent.expandedOptions[background.id].y = additionYPosition;
                background.parent.compressedOptions[background.id].y = additionYPosition;

                canvas.add(codeControlBranch);
                background.parent.updateSelectedBranch(codeControlBranch);
                background.parent.positionObjects();
            }
        }

        background.registerListener('mouseup', background.createCodeControl);

        this.progvolverType = "Control Addition";
        registerProgvolverObject(this);
        return background;
    }
}