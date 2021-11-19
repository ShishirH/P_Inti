function textDroppedAt(id, x, y, selectedText, startPos, endPos, startLine, endLine) {

    var xCanvas, yCanvas;
    var viewportLeft = canvas.viewportTransform[4];
    var viewportTop = canvas.viewportTransform[5];

    xCanvas = (x - viewportLeft - $('#theCanvas').offset().left) / canvas.getZoom();
    yCanvas = (y - viewportTop - $('#theCanvas').offset().top) / canvas.getZoom();

    //we need to check whether something is being dragged onto an existing codenote
        
    var group = new fabric.Group([], {
        id: id,
        selectedText: selectedText,
        startPos: startPos,
        endPos: endPos,
        startLine: startLine,
        endLine: endLine,
        originX: 'center',
        originY: 'center',
        top: xCanvas,
        left: yCanvas
    });


    var circle = new fabric.Circle({
        radius: 20,
        fill: iVoLVER.util.getRandomColor(),
        originX: 'center',
        originY: 'center',
        top: 0,
        left: 0
    });


    group.mainColor = circle.fill;

    var text = new fabric.Text(selectedText + " start: " + startPos + " end: " + endPos + " startLine: " + startLine + " endLine: " + endLine, {
        fontSize: 14,
        originX: 'center',
        originY: 'top',
        top: 20
    });

    group.addWithUpdate(circle);
    group.addWithUpdate(text);



    group.setPositionByOrigin(new fabric.Point(xCanvas, yCanvas), 'center', 'center');


    canvas.add(group);
    addWithAnimation(group);

    group.propertiesToAdd = ['id', 'selectedText', 'startPos', 'endPos', 'startLine', 'endLine', 'mainColor'];



    group.on({
        selected: function () {
            if (window.jsHandler && window.jsHandler.onObjectSelected) {
                var promise = window.jsHandler.onObjectSelected(group.toJSON(group.propertiesToAdd)).then(function (response) {
                    console.log(response);
                });
            }
        },
        deselected: function () {
            if (window.jsHandler && window.jsHandler.onObjectDeselected) {
                var promise = window.jsHandler.onObjectDeselected(group.toJSON(group.propertiesToAdd)).then(function (response) {
                    console.log(response);
                });
            }
        }
    });

    /*canvas.add(new fabric.Circle({
     radius: 5,
     fill: 'red',
     originX: 'center',
     originY: 'center',
     top: yCanvas,
     left: xCanvas
     }));*/

    if (window.jsHandler) {
        var args = group.toJSON(group.propertiesToAdd);
        args.opacity = 0.75;
        var promise = window.jsHandler.onObjectCreated(args).then(function (response) {
            console.log(response);
        });
    }


    return group.toJSON(group.propertiesToAdd);

}

function addWithAnimation(object) {
    var duration = 400;
    var easing = fabric.util.ease.easeOutBack;
    fabric.util.animate({
        startValue: 0,
        endValue: 1,
        duration: duration,
        easing: easing,
        onChange: function (value) {
            object.scaleX = value;
            object.scaleY = value;
            object.opacity = value;
        },
    })
}