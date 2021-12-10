class CodeControlBranchDelete {
    constructor(options) {
        options.radius = "10";
        options.fill = "transparent";
        options.stroke = options.parent.fill;
        options.strokeWidth = options.strokeWidth || 1;
        options.hasControls = false;
        options.hasBorders = false;

        const background = createObjectBackground(fabric.Circle, options, this);
        background.childrenOnTop = [];
        background.parent = options.parent;

        background.oldRender = background.render;
        background.render = function (ctx) {
            ctx.save();
            ctx.font = "40px Helvetica";
            ctx.fillStyle = "DarkRed"
            background.oldRender(ctx);
            var center = background.getPointByOrigin('center', 'center');
            ctx.fillText("-", center.x - 4, center.y + 12);
            ctx.restore();
        };

        background.registerListener('mouseup', function() {
            if (window.selectedCodeControl === background.parent.parent) {
                if (window.jsHandler) {
                    if (window.jsHandler.deleteControlBranch) {
                        window.jsHandler.deleteControlBranch({branchName: background.parent.branchName});

                        background.parent.removeFromCanvas();
                    }
                }
            }
        });

        this.progvolverType = "Control Addition Branch Delete";
        registerProgvolverObject(this);
        return background;
    }
}