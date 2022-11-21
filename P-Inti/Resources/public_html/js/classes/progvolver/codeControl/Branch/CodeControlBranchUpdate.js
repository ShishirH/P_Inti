class CodeControlBranchUpdate {
    constructor(options) {
        options.radius = "10";
        options.fill = "transparent";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 1;
        options.hasControls = false;
        options.hasBorders = false;

        const background = createObjectBackground(fabric.Circle, options, this);
        background.childrenOnTop = [];
        background.parent = options.parent;

        background.oldRender = background.render;
        background.render = function (ctx) {
            ctx.save();
            ctx.font = "30px Helvetica";
            ctx.fillStyle = "gray"
            background.oldRender(ctx);
            var center = background.getPointByOrigin('center', 'center');
            ctx.fillText("⟳", center.x - 10, center.y + 10);
            ctx.restore();
        };

        background.registerListener('mouseup', function() {
            if (window.selectedCodeControl === background.parent.parent) {
                if (window.jsHandler && window.jsHandler.updateControlBranch) {
                    console.log("Updating control branch")
                    window.jsHandler.updateControlBranch({
                        variantName: background.parent.branchName,
                        variantId: background.parent.id,
                        codeShiftId: background.parent.parent.id
                    });
                }
            }
        });

        this.progvolverType = "Control Addition Branch Update";
        registerProgvolverObject(this);
        return background;
    }
}