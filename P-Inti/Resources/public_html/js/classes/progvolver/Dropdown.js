class Dropdown {
    constructor(options) {
        var symbolFont = '8px Helvetica';

        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.children = [];
        background.dropdownOptions = options.dropdownOptions;
        background.unitMultipliers = options.unitMultipliers;
        
        background.parent = options.parent;

        background.value = background.dropdownOptions[0];
        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);
            ctx.save();
            ctx.font = symbolFont;
            ctx.fillStyle = 'white';
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var center = background.getPointByOrigin('center', 'center');

            if (background.value && !background.parent.isCompressed) {
                ctx.fillText(background.value, center.x - 5, center.y);
                let rightCenter = background.getPointByOrigin('right', 'center');
                
                ctx.beginPath();
                ctx.moveTo(rightCenter.x - 15, rightCenter.y - 3);
                ctx.lineTo(rightCenter.x - 10, rightCenter.y - 3);
                ctx.lineTo(rightCenter.x - 12.5, rightCenter.y + 2);
                ctx.closePath();

                // the outline
                ctx.strokeStyle = '#666666';
                ctx.stroke();

                // the fill color
                ctx.fillStyle = "#FFCC00";
                ctx.fill();
            }
            ctx.restore();
        };

        background.dropdowns = [];
        var addDropdownOptions = function () {
            let index = 0;
            background.dropdownOptions.forEach(function (option) {
                var dropdownOption = new TextRectangle({
                    fill: background.fill,
                    height: background.height,
                    width: background.width,
                    stroke: darken(background.fill),
                    strokeWidth: 1,
                    value: option,
                    unitMultiplier: background.unitMultipliers[index],
                    hasControls: false,
                    hasBorders: false,
                    parent: background
                });

                var originParent = {originX: 'left', originY: 'bottom'};
                var originChild = {originX: 'left', originY: 'top'};

                background.addChild(dropdownOption, {
                    whenCompressed: {
                        x: 0, y: (index * background.height) + 1,
                        originParent: originParent,
                        originChild: originChild
                    },
                    whenExpanded: {
                        x: 0, y: (index * background.height) + 1,
                        originParent: originParent,
                        originChild: originChild
                    },
                    movable: false
                });

                dropdownOption.on('mouseup', function() {
                    background.value = dropdownOption.value;
                    background.parent.unitMultiplier = dropdownOption.unitMultiplier;
                    background.parent.parent.convertUnits(background.parent.parent.value);
                    background.compress();
                })
                
                canvas.add(dropdownOption);
                dropdownOption.bringToFront();
                background.dropdowns.push(dropdownOption);
                index++;
            })
        };

        addDropdownOptions();

        background.registerListener('mouseup', function () {
            if (background.isCompressed) {
                background.expand();
            } else {
                background.compress();
            }
        });
        
        background.registerListener('added', function (options) {
            background.positionObjects();
        });

        this.progvolverType = "Dropdown";
        registerProgvolverObject(this);

        return background;
    }
}