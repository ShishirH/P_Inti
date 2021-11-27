class CodeControlAddition {
    constructor(options) {
        options.radius = 10;
        options.fill = "red";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.hasControls = false;
        options.hasBorders = false;

        let background = createObjectBackground(fabric.Circle, options, this);
        background.parent = options.parent;
        background.childrenOnTop = [];

        background.createCodeControl = function () {
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

                        let yPosition = (background.parent.codeBranches.length * 40) + 40;

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
                        canvas.add(codeControlBranch);
                    });
                }
            }
        }

        background.registerListener('added', function () {
            addChildrenToCanvas(background);
        });

        background.registerListener('mouseup', background.createCodeControl);

        this.progvolverType = "Control Addition";
        registerProgvolverObject(this);
        return background;
    }
}