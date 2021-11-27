class CodeControlBranchUpdate {
    constructor(options) {
        options.radius = "10";
        options.fill = "gray";
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
                if (window.jsHandler.updateControlBranch) {
                    window.jsHandler.updateControlBranch({branchName: background.parent.branchName});
                }
            }
        });

        this.progvolverType = "Control Addition Branch Update";
        registerProgvolverObject(this);
        return background;
    }
}