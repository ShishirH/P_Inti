class ControlAddition {
    constructor(options) {
        options.radius = 10;
        options.fill = "red";
        options.stroke = options.stroke || darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Circle, options, this);
        background.childrenOnTop = [];


        background.createCodeControl = function () {
            if (window.jsHandler) {
                if (window.jsHandler.createCodeControl) {
                    window.jsHandler.createCodeControl(null);
                }
            }
        }

        background.registerListener('added', function() {
            addChildrenToCanvas(background);
        });

        background.registerListener('mouseup', background.createCodeControl);

        this.progvolverType = "Control Addition";
        registerProgvolverObject(this);
        return background;
    }
}