class CodeControls {
    constructor(options) {
        options.height = options.height || 200;
        options.width = options.width || 200;
        options.left = options.x || 250;
        options.top = options.y || 250;
        options.fill = "WhiteSmoke";
        options.stroke = "Gainsboro"//darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.childrenOnTop = [];

        background.codeBranches = [];
        background.codeBranchesMap = {};
        background.selectedBranch = null;
        background.isOnCanvas = false;

        background.addName = function () {
            let labelObject = new fabric.IText("CONTROL_NAME", {
                fontFamily: 'Trebuchet MS',
                fill: '#333',
                fontSize: 16,
                hasControls: false,
                hasBorders: false,
                textAlign: 'center',
                fontWeight: 'bold',
                hoverCursor: "pointer"
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'top'};

            background.addChild(labelObject, {
                whenCompressed: {
                    x: 0, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 0, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.childrenOnTop.push(labelObject);
        }

        background.addControlAddition = new function () {
            let controlAddition = new CodeControlAddition({
                parent: background
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'top'};

            let yPosition = CodeControlBranch.getYPositionForIndex(background.codeBranches.length);
            background.addChild(controlAddition, {
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

            background.controlAddition = controlAddition;
            background.childrenOnTop.push(controlAddition);
        }

        background.updateSelectedBranch = function (selectedBranch) {
            // Turn off color for any currently selected branch across different code controls
            codeControlsOnCanvas.forEach(function (codeControl) {
                if (codeControl.selectedBranch) {
                    let codeControlBranch = codeControl.codeBranchesMap[codeControl.selectedBranch];
                    let deselectedColor = 'white';
                    codeControlBranch.set('fill', deselectedColor);
                    codeControlBranch.deleteBranch.set('stroke', deselectedColor);
                    codeControlBranch.updateBranch.set('stroke', deselectedColor);
                }
            });

            background.selectedBranch = selectedBranch.id;
            let selectedColor = 'DarkSeaGreen';
            let codeControlBranch = background.codeBranchesMap[background.selectedBranch];
            codeControlBranch.set('fill', selectedColor);
            codeControlBranch.deleteBranch.set('stroke', selectedColor);
            codeControlBranch.updateBranch.set('stroke', selectedColor);

        }
        background.registerListener('added', function () {
            if (!background.isOnCanvas) {
                background.isOnCanvas = true;
                addChildrenToCanvas(background);
            }
        });

        background.registerListener('mouseup', function (event) {
            CodeControls.updateSelectedCodeControl(background);
        })

        background.addName();
        background.noScaleCache = false;

        // Add this to the list of code controls, and make this code control active.
        //TODO Why am I getting an error here? window.codeControls.push(background);
        codeControlsOnCanvas.push(background);
        CodeControls.updateSelectedCodeControl(background);

        this.progvolverType = "Code Controls";
        registerProgvolverObject(this);

        return background;
    }

    static updateSelectedCodeControl(background) {
        // First code control on the canvas
        if (!window.selectedCodeControl) {
            window.selectedCodeControl = background;
        } else {
            // Deselect previous selected code control
            window.selectedCodeControl.set('stroke', 'Gainsboro');
            window.selectedCodeControl = background;
        }

        window.selectedCodeControl.set('stroke', 'rgba(130, 130, 130, 1)');
    }
}