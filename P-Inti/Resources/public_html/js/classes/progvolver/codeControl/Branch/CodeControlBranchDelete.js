class CodeControlBranchDelete {
    constructor(options) {
        options.radius = "10";
        options.fill = "red";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 1;
        options.hasControls = false;
        options.hasBorders = false;

        const background = createObjectBackground(fabric.Circle, options, this);
        background.childrenOnTop = [];
        background.parent = options.parent;

        background.registerListener('added', function() {
            addChildrenToCanvas(background);
        });

        background.registerListener('mouseup', function() {
            if (window.jsHandler) {
                if (window.jsHandler.deleteControlBranch) {
                    window.jsHandler.deleteControlBranch({branchName: background.parent.branchName});

                    background.parent.removeFromCanvas();
                }
            }
        });

        this.progvolverType = "Control Addition Branch Delete";
        registerProgvolverObject(this);
        return background;
    }
}