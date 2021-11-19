class NumberFormatter {
    constructor(options) {
        var symbolFont = '12px Helvetica';

        options.height = 30;
        options.width = 120;
        options.rx = options.rx || 0;
        options.ry = options.ry || 0;
        options.strokeWidth = options.strokeWidth || 2;

        options.hasControls = false;
        options.hasBorders = false;

        var background = createObjectBackground(fabric.Rect, options, this);
        background.unitMultiplier = 1;
        background.children = [];

        background = background;
        background.noScaleCache = false;

        this.value = options.value || '';

        background.oldRender = background.render;
        background.render = function (ctx) {
            background.oldRender(ctx);

            if (!background.isCompressed) {
                ctx.save();
                ctx.font = symbolFont;
                ctx.fillStyle = 'white';
                ctx.textAlign = "left";
                var center = background.getPointByOrigin('left', 'center');

                var renderableValue = "Units:";
                ctx.fillText(renderableValue, center.x + 8, center.y);
                ctx.restore();
            }
        };

        var units = ['Metre', 'Deci (* 10)', 'Centi (* 10^2)', 'Milli (* 10^3)'];
        var unitMultipliers  = [1, 10, 100, 1000];
        
        this.addUnits = function (options) {
            var dropdown = new Dropdown({
                background: background,
                width: 70,
                height: 25,
                fill: lighten(background.fill, 10),
                dropdownOptions: units,
                unitMultipliers: unitMultipliers,
                parent: background
            });

            var originParent = {originX: 'right', originY: 'center'};
            var originChild = {originX: 'right', originY: 'center'};


            background.addChild(dropdown, {
                whenCompressed: {
                    x: -4, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                whenExpanded: {
                    x: -4, y: 0,
                    originParent: originParent,
                    originChild: originChild
                },
                movable: false
            });
            
            dropdown.lockMovementX = true;
            dropdown.lockMovementY = true;
            
            canvas.add(dropdown);
            background.dropdown = dropdown;
            background.children.push(dropdown);

        };

        this.addUnits(options);

        background.registerListener('added', function (options) {
//            background.bringToFront();
//            background.dropdown.bringToFront();
//            
//            background.dropdown.dropdowns.forEach(function (option) {
//                option.bringToFront();
//            })
            background.positionObjects();
        });

        background.bringContentsToFront = function () {
            background.bringToFront();
            background.dropdown.bringToFront();

            background.dropdown.dropdowns.forEach(function (option) {
                option.bringToFront();
            })
        }

        this.progvolverType = "NumberFormatter";
        registerProgvolverObject(this);

        return background;
    }
}