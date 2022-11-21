class CodeControls {
    constructor(options) {
        options.height = options.height || 60;
        options.width = options.width || 200;
        options.left = options.x || 250;
        options.top = options.y || 250;
        options.index = (codeControlsOnCanvas.length % colorsArray.length);//"WhiteSmoke";
        options.fill = colorsArray[options.index];
        options.stroke = darken(options.fill); //"Gainsboro"//darken(options.fill);
        options.strokeWidth = options.strokeWidth || 2;
        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.childrenOnTop = [];

        background.codeBranches = [];
        background.codeBranchesMap = options.codeBranchesMap || {};
        background.selectedBranch = null;
        background.isOnCanvas = false;
        background.name = options.name || "";
        background.index = options.index;
        background.saturatedColor = background.fill;
        background.unsaturatedColor = desaturatedColorsArray[options.index];
        background.kind = "CodeControls";

        background.addName = function () {
            let labelObjectText = "CONTROL_NAME";
            if (background.name != "") {
                labelObjectText = background.name;
            }

            let labelObject = new fabric.IText(labelObjectText, {
                fontFamily: 'Trebuchet MS',
                fill: '#333',
                fontSize: 16,
                hasControls: false,
                hasBorders: false,
                textAlign: 'center',
                fontWeight: 'bold',
                hoverCursor: "pointer"
            });

            var originParent = {originX: 'left', originY: 'top'};
            var originChild = {originX: 'left', originY: 'top'};

            labelObject.on('editing:exited', function () {
                console.log("Updated name is: " + name);
                if (window.jsHandler && window.jsHandler.updateCodeControlName) {
                    window.jsHandler.updateCodeControlName({
                        id: background.id,
                        name: labelObject.text,
                    });
                }
            });

            background.addChild(labelObject, {
                whenCompressed: {
                    x: 5, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: 5, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.labelObject = labelObject;
            background.childrenOnTop.push(labelObject);
        }

        background.addSelectButton = function () {
            var selectButton = new CodeControlCheckBox({
                height: 15,
                width: 15,
                hasControls: false,
                hasBorders: false,
                stroke: darken(background.stroke),
                fill: darken(background.fill),
                parent: background
            });

            var originParent = {originX: 'right', originY: 'top'};
            var originChild = {originX: 'right', originY: 'top'};

            background.addChild(selectButton, {
                whenCompressed: {
                    x: -5, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -5, y: 4,
                    scaleX: 1, scaleY: 1, opacity: 1,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });

            background.selectButton = selectButton;
            background.childrenOnTop.push(selectButton);
        }

        background.addControlAddition = new function () {
            let controlAddition = new CodeControlAddition({
                parent: background
            });

            var originParent = {originX: 'center', originY: 'top'};
            var originChild = {originX: 'center', originY: 'top'};

            console.log("Calling this function");
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
            if (window.selectedCodeControl !== background) {
                background.codeBranches.forEach(function (branch) {
                    let codeControlBranch = branch;
                    let deselectedColor = 'white';
                    codeControlBranch.set('fill', deselectedColor);
                    codeControlBranch.deleteBranch.set('stroke', deselectedColor);
                    codeControlBranch.updateBranch.set('stroke', deselectedColor);
                })
            } else {
                // Turn off color for any currently selected branch across different code controls
                // codeControlsOnCanvas.forEach(function (codeControl) {
                //     if (codeControl.selectedBranch) {
                //         let codeControlBranch = codeControl.codeBranchesMap[codeControl.selectedBranch];
                //         let deselectedColor = 'white';
                //         codeControlBranch.set('fill', deselectedColor);
                //         codeControlBranch.deleteBranch.set('stroke', deselectedColor);
                //         codeControlBranch.updateBranch.set('stroke', deselectedColor);
                //     }
                // });
                background.codeBranches.forEach(function (branch) {
                    let codeControlBranch = branch;
                    let deselectedColor = 'white';
                    codeControlBranch.set('fill', deselectedColor);
                    codeControlBranch.deleteBranch.set('stroke', deselectedColor);
                    codeControlBranch.updateBranch.set('stroke', deselectedColor);
                })
            }

            background.selectedBranch = selectedBranch.id;
            let selectedColor = background.unsaturatedColor;//'DarkSeaGreen';
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

            if (window.jsHandler && window.jsHandler.initializeCodeControl) {
                window.jsHandler.initializeCodeControl({
                    name: background.name,
                    id: background.id,
                    saturatedColor: background.saturatedColor,
                    unsaturatedColor: background.unsaturatedColor
                });
            }

            codeControlsOnCanvas.push(background);
            CodeControls.updateSelectedCodeControl(background);

            console.log("Code controls is: ");
            console.log(background);
            background.positionObjects();
        });

        background.toJson = function () {
            let json = {};
            let codeVariantsArray = [];

            for (let i = 0; i < background.codeBranches.length; i++) {
                let codeVariant = background.codeBranches[i];
                console.log(codeVariant);
                codeVariantsArray.push(codeVariant.toJson());
                console.log(codeVariantsArray);
            }

            console.log("background.codeBranches");
            console.log(codeVariantsArray);
            json['codeVariantsArray'] = codeVariantsArray;
            json['name'] = background.labelObject.text;
            json['x'] = background.left;
            json['y'] = background.top;
            json['index'] = background.index;
            json['id'] = background.id;
            json['kind'] = "CodeControls";

            console.log("Json is:");
            console.log(json);
            return JSON.stringify(json);
        }

        // background.registerListener('mouseup', function (event) {
        //     CodeControls.updateSelectedCodeControl(background);
        // })

        background.addName();
        background.addSelectButton();
        background.noScaleCache = false;

        // Add this to the list of code controls, and make this code control active.
        this.progvolverType = "Code Controls";
        PERSISTENT_CANVAS_ENTRIES.push(background);
        registerProgvolverObject(this);

        return background;
    }

    static updateSelectedCodeControl(background) {
        // First code control on the canvas
        if (!window.selectedCodeControl) {
            window.selectedCodeControl = background;
        } else {
            // Deselect previous selected code control
            window.selectedCodeControl.set('fill', window.selectedCodeControl.unsaturatedColor);
            window.selectedCodeControl.set('stroke', darken(window.selectedCodeControl.fill));
            if (window.selectedCodeControl.selectButton) {
                window.selectedCodeControl.selectButton.value = "";
            }
            window.selectedCodeControl = background;
        }

        if (window.jsHandler && window.jsHandler.updateSelectedCodeControl) {
            console.log("Calling text thing")
            window.jsHandler.updateSelectedCodeControl({
                id: background.id
            })
        }

        if (window.selectedCodeControl) {
            window.selectedCodeControl.set('fill', window.selectedCodeControl.saturatedColor);
            window.selectedCodeControl.set('stroke', darken(window.selectedCodeControl.fill));

            if (window.selectedCodeControl.selectButton)
                window.selectedCodeControl.selectButton.value = "✓";
        }

        //window.selectedCodeControl.set('stroke', 'rgba(130, 130, 130, 1)');
    }

    static fromJson(json) {
        console.log("Codecontrol being created");
        console.log("codeVariantsArray");
        console.log(json['codeVariantsArray']);


        let labelObjectName = json['name'] || "CONTROL_TEXT";
        let obj = new CodeControls({
            name: labelObjectName,
            x: json['x'], y: json['y'],
            index: json['index'],
            id: json['id'],
        });

        canvas.add(obj);

        for (let i = 0; i < json['codeVariantsArray'].length; i++) {
            let codeVariant = JSON.parse(json['codeVariantsArray'][i]);

            console.log("BranchName");
            console.log(codeVariant['branchName']);
            console.log("BranchID");
            console.log(codeVariant['id']);

            let codeControlBranch = new CodeControlBranch({
                parent: obj,
                displayName: codeVariant['branchName'],
                id: codeVariant['id']
            });

            obj.controlAddition.createCodeControl(null, codeControlBranch);
        }
    }
}