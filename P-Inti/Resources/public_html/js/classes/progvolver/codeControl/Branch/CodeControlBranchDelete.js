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

        var addDeletePath = function () {
            let svgString = "M384.955,256l120.28-120.28c9.019-9.019,9.019-23.642,0-32.66L408.94,6.765\n" +
                "\tc-9.019-9.019-23.642-9.019-32.66,0l-120.28,120.28L135.718,6.765c-9.019-9.019-23.642-9.019-32.66,0L6.764,103.058\n" +
                "\tc-9.019,9.019-9.019,23.642,0,32.66l120.28,120.28L6.764,376.28c-9.019,9.019-9.019,23.642,0,32.66l96.295,96.294\n" +
                "\tc9.019,9.019,23.642,9.019,32.66,0l120.28-120.28l120.28,120.28c9.019,9.019,23.642,9.019,32.66,0l96.295-96.294\n" +
                "\tc9.019-9.019,9.019-23.642,0-32.66L384.955,256z";

            var path = new fabric.Circle({
                fill: 'red',
                radius: 10,
                hasControls: false,
                hasBorders: false
            });

            path.scaleToHeight(20);
            path.scaleToWidth(20);

            var originParent = {originX: 'center', originY: 'center'};
            var originChild = {originX: 'center', originY: 'center'};
            background.addChild(path, {
                whenCompressed: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 0,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.deletePath = path;
            background.childrenOnTop.push(path);
        }

        //addDeletePath();

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